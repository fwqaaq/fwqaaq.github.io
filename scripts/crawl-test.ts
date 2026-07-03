/**
 * End-to-end verification for the pay-per-crawl gate on /posts/*.
 *
 *   1. normal browser UA      -> 200 (free, human reader)
 *   2. AI crawler UA, no pay  -> 402
 *   3. AI crawler UA + x402   -> 200 (article HTML)  [needs PRIVATE_KEY]
 *
 * Usage:
 *   PRIVATE_KEY=0x<testnet-key> deno run -A scripts/crawl-test.ts [postUrl]
 *
 * With no postUrl, the first post under dist/posts/ is used.
 */
import { makePaidFetch, normalizeKey } from './x402-client.ts'

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const CRAWLER_UA = 'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)'
const BASE = (Deno.env.get('BASE_URL') ?? 'http://localhost:8787').replace(
  /\/$/,
  '',
)

let url = Deno.args[0]
if (!url) {
  for await (const entry of Deno.readDir('dist/posts')) {
    if (entry.isDirectory) {
      url = `${BASE}/posts/${entry.name}/`
      break
    }
  }
}
if (!url) {
  console.error('No post found under dist/posts — run `deno task build` first.')
  Deno.exit(1)
}
console.log('post url:', url)

// Step 1: a real browser reads the article for free.
const human = await fetch(url, { headers: { 'user-agent': BROWSER_UA } })
console.log(`[1] browser UA        -> ${human.status}`)
if (human.status !== 200) {
  console.error(`  FAIL: expected 200 (free), got ${human.status}`)
  Deno.exit(1)
}

// Step 2: a known crawler without payment is rejected with 402.
const bot = await fetch(url, { headers: { 'user-agent': CRAWLER_UA } })
console.log(`[2] crawler UA, unpaid -> ${bot.status}`)
if (bot.status !== 402) {
  console.error(`  FAIL: expected 402, got ${bot.status}`)
  Deno.exit(1)
}

// Step 3: a paying crawler gets the HTML.
const rawKey = Deno.env.get('PRIVATE_KEY')
const privateKey = normalizeKey(rawKey)
if (!privateKey) {
  if (rawKey?.trim()) {
    console.error(
      '  PRIVATE_KEY must be a 32-byte hex key (64 hex chars; 0x optional).',
    )
    Deno.exit(1)
  }
  console.log('[3] skipped (set PRIVATE_KEY to test the paid crawl leg)')
  console.log('PASS (steps 1-2)')
  Deno.exit(0)
}

const fetchWithPayment = makePaidFetch(privateKey, Deno.env.get('X402_NETWORK'))
const paid = await fetchWithPayment(url, {
  method: 'GET',
  headers: { 'user-agent': CRAWLER_UA },
})
console.log(`[3] crawler UA, paid   -> ${paid.status}`)
if (paid.status !== 200) {
  console.error(`  FAIL: expected 200, got ${paid.status}`)
  console.error('  body:', (await paid.text()).slice(0, 300))
  Deno.exit(1)
}
const html = await paid.text()
console.log(`  PASS. content-type: ${paid.headers.get('content-type')}, ${html.length} bytes`)
