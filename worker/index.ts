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
    )
    gateCache.set(cacheKey, middleware)
  }
  return middleware
}

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

app.use('/posts/*', async (c, next) => {
  if (!isAiCrawler(c.req.header('user-agent'))) return next()

  const res = (await gate(
    c.env,
    'GET /posts/*',
    c.env.CRAWL_PRICE,
    'Blog article HTML page (pay-per-crawl)',
  )(c, next)) ?? c.res
  if (res.status === 200) {
    const r = new Response(res.body, res)
    r.headers.set('Cache-Control', 'no-store')
    return r
  }
  return res
})

app.use('/premium/*', async (c, next) => {
  const slug = c.req.path.split('/').pop() ?? ''
  if (!(slug in premiumArticles)) return c.text('Not found', 404)

  const hadPass = await hasValidPass(
    c.req.header('cookie'),
    slug,
    c.env.ACCESS_TOKEN_SECRET,
  )
  if (hadPass) return next()

  const res = (await gate(
    c.env,
    'GET /premium/*',
    premiumArticles[slug].price ?? c.env.PREMIUM_PRICE,
    'Full paid article (HTML)',
  )(c, next)) ?? c.res

  const out = new Response(res.body, res)
  out.headers.set('Cache-Control', 'no-store')
  out.headers.set('Vary', 'Cookie')

  const paymentResponse = out.headers.get('X-PAYMENT-RESPONSE')
  if (out.status === 200 && !paymentResponse) {
    out.headers.delete('Set-Cookie')
    return new Response('Missing x402 payment response', {
      status: 402,
      headers: {
        'Cache-Control': 'no-store',
        'Vary': 'Cookie',
      },
    })
  }

  if (out.status === 200 && paymentResponse) {
    const ttl = Number(c.env.PASS_TTL_SECONDS)
    const token = await issueToken(slug, c.env.ACCESS_TOKEN_SECRET, ttl)
    const secure = new URL(c.req.url).protocol === 'https:'
    out.headers.append('Set-Cookie', passCookie(slug, token, ttl, secure))
  }

  return out
})

app.get('/premium/:slug', (c) => {
  const slug = c.req.param('slug')
  c.header('Cache-Control', 'no-store')
  c.header('Vary', 'Cookie')
  return c.html(premiumArticles[slug].html)
})

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
