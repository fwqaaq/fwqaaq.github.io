import { Hono } from 'hono'
import { paymentMiddleware, x402ResourceServer } from '@x402/hono'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { createPaywall } from '@x402/paywall'
import { evmPaywall } from '@x402/paywall/evm'
import { content, premium } from './content.generated.js'
import { isAiCrawler } from './crawlers'
import { hasValidPass, issueToken, passCookie } from './access'
import { getFacilitator } from './facilitator'

interface Env {
  ASSETS: Fetcher
  PAY_TO_ADDRESS: string
  NETWORK: string
  FACILITATOR_URL: string
  PRICE: string
  CRAWL_PRICE: string
  PREMIUM_PRICE: string
  ACCESS_TOKEN_SECRET: string
  PASS_TTL_SECONDS: string
  CDP_API_KEY_ID: string
  CDP_API_KEY_SECRET: string
}

const articles = content as Record<string, unknown>
const premiumArticles = premium as Record<
  string,
  { title: string; html: string; price?: string }
>

const app = new Hono<{ Bindings: Env }>()

// Env is constant per deployment, so the resource server and each route's
// middleware are built once per isolate and cached. This also means the
// facilitator's supported kinds are fetched (initialize) only once, not per
// request.
let sharedServer: x402ResourceServer | undefined
function resourceServer(env: Env) {
  if (!sharedServer) {
    sharedServer = new x402ResourceServer(getFacilitator(env)).register(
      env.NETWORK,
      new ExactEvmScheme(),
    )
  }
  return sharedServer
}

const gateCache = new Map<string, ReturnType<typeof paymentMiddleware>>()
const browserPaywall = createPaywall().withNetwork(evmPaywall).build()

/** Builds (and caches) a v2 x402 payment gate for one route. */
function gate(env: Env, routeKey: string, price: string, description: string) {
  const cacheKey = [
    routeKey,
    price,
    env.NETWORK,
    env.PAY_TO_ADDRESS,
  ].join('|')
  let middleware = gateCache.get(cacheKey)
  if (!middleware) {
    middleware = paymentMiddleware(
      {
        [routeKey]: {
          accepts: [
            {
              scheme: 'exact',
              price,
              network: env.NETWORK,
              payTo: env.PAY_TO_ADDRESS,
            },
          ],
          description,
        },
      },
      resourceServer(env),
      { appName: 'fwqaaq 的博客', testnet: env.NETWORK !== 'eip155:8453' },
      browserPaywall,
      // syncFacilitatorOnStart=true (default): fetch supported kinds from the
      // facilitator on first use, so it knows `exact` is supported here.
    )
    gateCache.set(cacheKey, middleware)
  }
  return middleware
}

/**
 * x402 paid API for agents. Validate the slug first so a missing article
 * returns 404 WITHOUT charging the caller.
 */
app.use('/api/content/*', async (c, next) => {
  const slug = c.req.path.split('/').pop() ?? ''
  if (!(slug in articles)) return c.json({ error: 'Not found', slug }, 404)
  return gate(
    c.env,
    'GET /api/content/*',
    c.env.PRICE,
    'Structured blog article content (JSON)',
  )(c, next)
})

app.get('/api/content/:slug', (c) => {
  const slug = c.req.param('slug')
  return c.json(articles[slug])
})

/**
 * Pay-per-crawl gate for article HTML pages. Known AI crawlers pay via x402 to
 * read `/posts/*`; real browsers and unknown UAs pass through free. On payment
 * the request falls through to the static asset (the article HTML) below.
 */
app.use('/posts/*', async (c, next) => {
  if (!isAiCrawler(c.req.header('user-agent'))) return next()

  const res = (await gate(
    c.env,
    'GET /posts/*',
    c.env.CRAWL_PRICE,
    'Blog article HTML page (pay-per-crawl)',
  )(c, next)) ?? c.res
  // Paid crawl content is served from static assets (Cache-Control: public).
  // Override so it isn't cached/replayed for free.
  if (res.status === 200) {
    const r = new Response(res.body, res)
    r.headers.set('Cache-Control', 'no-store')
    return r
  }
  return res
})

/**
 * Human paid articles. A valid access-pass cookie skips payment; otherwise the
 * x402 middleware serves the built-in browser paywall (or JSON 402 for agents).
 * After payment the handler returns the full article HTML and issues a pass.
 */
app.use('/premium/*', async (c, next) => {
  const slug = c.req.path.split('/').pop() ?? ''
  if (!(slug in premiumArticles)) return c.text('Not found', 404)

  if (await hasValidPass(c.req.header('cookie'), slug, c.env.ACCESS_TOKEN_SECRET)) {
    return next()
  }

  // Never cache any premium response — Safari otherwise replays a cached 402
  // for the paywall's X-PAYMENT retry ("Payment retry failed"). Covers the
  // paid 200 too.
  const res = (await gate(
    c.env,
    'GET /premium/*',
    premiumArticles[slug].price ?? c.env.PREMIUM_PRICE,
    'Full paid article (HTML)',
  )(c, next)) ?? c.res
  const out = new Response(res.body, res)
  out.headers.set('Cache-Control', 'no-store')
  out.headers.set('Vary', 'Cookie')
  return out
})

app.get('/premium/:slug', async (c) => {
  const slug = c.req.param('slug')
  // Paid content must never be cached (browser or CDN edge), or it could be
  // replayed without payment. Keys on cookie so passes aren't shared.
  c.header('Cache-Control', 'no-store')
  c.header('Vary', 'Cookie')
  // Reached here means: valid pass OR payment just settled. Mint a pass if none.
  if (!(await hasValidPass(c.req.header('cookie'), slug, c.env.ACCESS_TOKEN_SECRET))) {
    const ttl = Number(c.env.PASS_TTL_SECONDS)
    const token = await issueToken(slug, c.env.ACCESS_TOKEN_SECRET, ttl)
    const secure = new URL(c.req.url).protocol === 'https:'
    c.header('Set-Cookie', passCookie(slug, token, ttl, secure))
  }
  return c.html(premiumArticles[slug].html)
})

// Everything else falls through to the built static site.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
