import { Hono } from 'hono'
import { paymentMiddleware, x402ResourceServer } from '@x402/hono'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { getDefaultAsset } from '@x402/evm'
import { createPaywall } from '@x402/paywall'
import { evmPaywall } from '@x402/paywall/evm'
import { recoverMessageAddress } from 'viem'
import { content, premium } from './content.generated.js'
import { isAiCrawler } from './crawlers'
import {
  hasValidPass,
  hasValidPassToken,
  issueChallenge,
  issueToken,
  passCookie,
  verifyChallenge,
} from './access'
import { getFacilitator } from './facilitator'
import { paywallHtml } from './paywall'

interface Env {
  ASSETS: Fetcher
  PURCHASES: KVNamespace
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

function premiumUrl(slug: string): string {
  return `/premium/${encodeURIComponent(slug)}`
}

function accessUrl(slug: string, token: string): string {
  return `/access/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`
}

/** KV key of a permanent purchase record (wallet-as-account). */
function purchaseKey(network: string, address: string, slug: string): string {
  return `purchase:${network}:${address.toLowerCase()}:${slug}`
}

function premiumPrice(env: Env, slug: string): string {
  return premiumArticles[slug].price ?? env.PREMIUM_PRICE
}

/**
 * Payment requirements for the lightweight paywall page — must mirror exactly
 * what the v2 middleware computes for the route (scheme/network/amount/asset/
 * payTo/extra), or verification of the page-built payment would fail.
 */
function premiumRequirements(env: Env, slug: string) {
  const price = premiumPrice(env, slug)
  const asset = getDefaultAsset(env.NETWORK)
  const amount = String(
    Math.round(parseFloat(price.replace('$', '')) * 10 ** asset.decimals),
  )
  return {
    scheme: 'exact' as const,
    network: env.NETWORK,
    amount,
    asset: asset.address,
    payTo: env.PAY_TO_ADDRESS,
    maxTimeoutSeconds: 300,
    extra: { name: asset.name, version: asset.version },
  }
}

/** Extracts the payer address from the request's PAYMENT-SIGNATURE header. */
function payerFromRequest(header: string | undefined): string | undefined {
  if (!header) return undefined
  try {
    const payload = JSON.parse(atob(header))
    const from = payload?.payload?.authorization?.from
    return typeof from === 'string' ? from : undefined
  } catch {
    return undefined
  }
}

function addRecoveryLink(html: string, slug: string, token: string): string {
  const link = accessUrl(slug, token)
  const note = `<div class="paywall-recovery" style="margin:1rem 0;padding:1rem;border:1px solid currentColor"><p>如果浏览器没有保存 cookie，请保存下面的恢复链接，之后可用它恢复本文访问，不需要再次付款。</p><p><a href="${link}">恢复访问链接</a></p></div>`
  return html.includes('<article class="blog-article">')
    ? html.replace('<article class="blog-article">', `<article class="blog-article">${note}`)
    : `${note}${html}`
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

/**
 * Replaces the context's response. On payment success the v2 adapter assigns
 * `c.res` itself, which marks the context finalized — Hono then IGNORES a
 * middleware's returned Response, so the original (already-consumed) body
 * would be sent and crash with "Body has already been used". Clearing first
 * also avoids the setter merging stale headers (e.g. Content-Length).
 */
function replaceRes(c: { res: Response | undefined }, resp: Response): Response {
  c.res = undefined
  c.res = resp
  return resp
}

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
    return replaceRes(c, r)
  }
  return replaceRes(c, res)
})

app.get('/access/:slug', async (c) => {
  const slug = c.req.param('slug')
  if (!(slug in premiumArticles)) return c.text('Not found', 404)

  if (await hasValidPass(c.req.header('cookie'), slug, c.env.ACCESS_TOKEN_SECRET)) {
    return c.redirect(premiumUrl(slug), 302)
  }

  const token = c.req.query('token')
  if (!(await hasValidPassToken(token, slug, c.env.ACCESS_TOKEN_SECRET))) {
    return c.redirect(premiumUrl(slug), 302)
  }

  const ttl = Number(c.env.PASS_TTL_SECONDS)
  const secure = new URL(c.req.url).protocol === 'https:'
  c.header('Set-Cookie', passCookie(slug, token!, ttl, secure))
  c.header('Cache-Control', 'no-store')
  return c.redirect(premiumUrl(slug), 302)
})

app.use('/premium/*', async (c, next) => {
  const parts = c.req.path.split('/').filter(Boolean)
  const last = parts[parts.length - 1] ?? ''
  // /premium/:slug/challenge and /premium/:slug/restore are free sub-routes
  // (wallet-signature access recovery); let their handlers run.
  if (last === 'challenge' || last === 'restore') return next()

  const slug = last
  if (!(slug in premiumArticles)) return c.text('Not found', 404)

  const hadPass = await hasValidPass(
    c.req.header('cookie'),
    slug,
    c.env.ACCESS_TOKEN_SECRET,
  )
  if (hadPass) return next()

  // Browsers without a payment retry get our lightweight paywall page instead
  // of the 2.3MB official bundle. Agents (no text/html) and the page's own
  // PAYMENT-SIGNATURE retry continue into the x402 middleware.
  const isBrowser = (c.req.header('accept') ?? '').includes('text/html') &&
    (c.req.header('user-agent') ?? '').includes('Mozilla')
  const paymentHeader = c.req.header('payment-signature') ??
    c.req.header('x-payment')
  if (isBrowser && !paymentHeader) {
    const requirements = premiumRequirements(c.env, slug)
    const html = paywallHtml({
      x402Version: 2,
      slug,
      title: premiumArticles[slug].title,
      priceLabel: premiumPrice(c.env, slug).replace('$', ''),
      resource: {
        url: c.req.url,
        description: 'Full paid article (HTML)',
        mimeType: '',
      },
      accepts: [requirements],
    })
    return c.html(html, 402, {
      'Cache-Control': 'no-store',
      'Vary': 'Cookie',
    })
  }

  const res = (await gate(
    c.env,
    'GET /premium/*',
    premiumPrice(c.env, slug),
    'Full paid article (HTML)',
  )(c, next)) ?? c.res

  const out = new Response(res.body, res)
  out.headers.set('Cache-Control', 'no-store')
  out.headers.set('Vary', 'Cookie')

  // v2 emits PAYMENT-RESPONSE; X-PAYMENT-RESPONSE is the v1 name.
  const paymentResponse = out.headers.get('PAYMENT-RESPONSE') ??
    out.headers.get('X-PAYMENT-RESPONSE')
  if (out.status === 200 && !paymentResponse) {
    return replaceRes(
      c,
      new Response('Missing x402 payment response', {
        status: 402,
        headers: {
          'Cache-Control': 'no-store',
          'Vary': 'Cookie',
        },
      }),
    )
  }

  if (out.status === 200 && paymentResponse) {
    // Permanent purchase record: wallet-as-account, survives lost cookies.
    const payer = payerFromRequest(paymentHeader)
    if (payer) {
      c.executionCtx.waitUntil(
        c.env.PURCHASES.put(
          purchaseKey(c.env.NETWORK, payer, slug),
          JSON.stringify({ paidAt: Date.now(), price: premiumPrice(c.env, slug) }),
        ),
      )
    }

    const ttl = Number(c.env.PASS_TTL_SECONDS)
    const token = await issueToken(slug, c.env.ACCESS_TOKEN_SECRET, ttl)
    const secure = new URL(c.req.url).protocol === 'https:'
    const paid = new Response(addRecoveryLink(await out.text(), slug, token), out)
    paid.headers.delete('Content-Length')
    paid.headers.append('Set-Cookie', passCookie(slug, token, ttl, secure))
    return replaceRes(c, paid)
  }

  return replaceRes(c, out)
})

/**
 * Wallet-signature access recovery (free, off-chain): prove you control an
 * address that has a purchase record in KV, get a fresh pass cookie.
 */
app.get('/premium/:slug/challenge', async (c) => {
  const slug = c.req.param('slug')
  if (!(slug in premiumArticles)) return c.text('Not found', 404)
  const address = c.req.query('address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return c.json({ error: 'invalid address' }, 400)
  }
  const challenge = await issueChallenge(slug, address, c.env.ACCESS_TOKEN_SECRET)
  return c.json({ challenge }, 200, { 'Cache-Control': 'no-store' })
})

app.post('/premium/:slug/restore', async (c) => {
  const slug = c.req.param('slug')
  if (!(slug in premiumArticles)) return c.text('Not found', 404)

  let body: { address?: string; challenge?: string; signature?: string }
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'invalid body' }, 400)
  }
  const { address, challenge, signature } = body
  if (!address || !challenge || !signature) {
    return c.json({ error: 'missing fields' }, 400)
  }

  if (!(await verifyChallenge(challenge, slug, address, c.env.ACCESS_TOKEN_SECRET))) {
    return c.json({ error: 'invalid or expired challenge' }, 400)
  }
  let recovered: string
  try {
    recovered = await recoverMessageAddress({
      message: challenge,
      signature: signature as `0x${string}`,
    })
  } catch {
    return c.json({ error: 'invalid signature' }, 400)
  }
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    return c.json({ error: 'signature does not match address' }, 403)
  }

  const record = await c.env.PURCHASES.get(
    purchaseKey(c.env.NETWORK, address, slug),
  )
  if (!record) return c.json({ error: 'no purchase record' }, 403)

  const ttl = Number(c.env.PASS_TTL_SECONDS)
  const token = await issueToken(slug, c.env.ACCESS_TOKEN_SECRET, ttl)
  const secure = new URL(c.req.url).protocol === 'https:'
  c.header('Set-Cookie', passCookie(slug, token, ttl, secure))
  c.header('Cache-Control', 'no-store')
  return c.json({ ok: true })
})

app.get('/premium/:slug', (c) => {
  const slug = c.req.param('slug')
  c.header('Cache-Control', 'no-store')
  c.header('Vary', 'Cookie')
  return c.html(premiumArticles[slug].html)
})

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
