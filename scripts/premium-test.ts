/**
 * End-to-end verification for human paid articles (/premium/:slug).
 *
 *   1. browser UA, no pay   -> 402 + Coinbase paywall HTML
 *   2. teaser page          -> 200, summary only (no full body leak)
 *   3. agent x402 pay       -> 200 HTML + Set-Cookie pass   [needs PRIVATE_KEY]
 *   4. re-request w/ cookie -> 200, no payment (pass works) [needs PRIVATE_KEY]
 *
 * The real browser paywall UI is verified manually; steps 3-4 exercise the same
 * route/middleware via the agent path.
 *
 * Usage:
 *   PRIVATE_KEY=0x<testnet-key> node scripts/premium-test.ts
 */
import { readFile, readdir } from 'node:fs/promises'
import { makePaidFetch, normalizeKey } from './x402-client.ts'

const BASE = (process.env.BASE_URL ?? 'http://localhost:8787').replace(
  /\/$/,
  '',
)
const SLUG = 'premium-demo'
const url = `${BASE}/premium/${SLUG}`
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
// A heading that exists only in the full article body, never in the teaser.
const BODY_ONLY_MARKER = '通行证机制'

// Step 1: a browser without payment gets the paywall page.
const paywall = await fetch(url, {
  headers: { 'user-agent': BROWSER_UA, accept: 'text/html' },
})
const paywallBody = await paywall.text()
console.log(`[1] browser, unpaid    -> ${paywall.status}`)
if (paywall.status !== 402 || !paywallBody.includes('Payment Required')) {
  console.error('  FAIL: expected 402 with paywall HTML')
  process.exit(1)
}

// Step 2: the public teaser page is free and shows summary only.
let teaserUrl: string | undefined
for (const entry of await readdir('dist/posts', { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const html = await readFile(`dist/posts/${entry.name}/index.html`, 'utf8')
  if (html.includes(`/premium/${SLUG}`)) {
    teaserUrl = `${BASE}/posts/${entry.name}/`
    break
  }
}
if (!teaserUrl) {
  console.error('  FAIL: teaser page for', SLUG, 'not found in dist')
  process.exit(1)
}
const teaser = await fetch(teaserUrl)
const teaserBody = await teaser.text()
console.log(`[2] teaser ${teaserUrl} -> ${teaser.status}`)
if (teaser.status !== 200 || teaserBody.includes(BODY_ONLY_MARKER)) {
  console.error('  FAIL: teaser missing or leaks full body')
  process.exit(1)
}

// Steps 3-4 need a funded testnet wallet.
const privateKey = normalizeKey(process.env.PRIVATE_KEY)
if (!privateKey) {
  console.log('[3-4] skipped (set PRIVATE_KEY to test the paid + pass legs)')
  console.log('PASS (steps 1-2)')
  process.exit(0)
}

const fetchWithPayment = makePaidFetch(privateKey, process.env.X402_NETWORK)
const paid = await fetchWithPayment(url, { method: 'GET' })
const setCookie = paid.headers.getSetCookie?.()[0] ?? paid.headers.get('set-cookie')
console.log(`[3] agent paid         -> ${paid.status}, set-cookie: ${!!setCookie}`)
if (paid.status !== 200 || !setCookie) {
  console.error('  FAIL: expected 200 + Set-Cookie pass')
  console.error('  body:', (await paid.text()).slice(0, 200))
  process.exit(1)
}

// Step 4: the pass cookie unlocks without paying again.
const cookie = setCookie.split(';')[0]
const reuse = await fetch(url, { headers: { cookie } })
console.log(`[4] with pass cookie   -> ${reuse.status} (no payment)`)
if (reuse.status !== 200) {
  console.error('  FAIL: pass cookie did not unlock without payment')
  process.exit(1)
}
console.log('PASS (steps 1-4)')
