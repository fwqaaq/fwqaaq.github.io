/**
 * End-to-end verification for the x402 content API.
 *
 * Simulates an AI agent paying per call on Base Sepolia testnet:
 *   1. plain fetch  -> expect HTTP 402 with `accepts` payment requirements
 *   2. paid fetch   -> expect HTTP 200 with the article JSON
 *
 * Usage:
 *   PRIVATE_KEY=0x<testnet-key> node scripts/pay-test.ts [url]
 *
 * The key must control a Base Sepolia wallet funded with test USDC
 * (faucet: https://faucet.circle.com, network "Base Sepolia").
 */
import { makePaidFetch, normalizeKey } from './x402-client.ts'

const BASE = (process.env.BASE_URL ?? 'http://localhost:8787').replace(
  /\/$/,
  '',
)
const url = process.argv[2] ??
  `${BASE}/api/content/iterator`

const rawKey = process.env.PRIVATE_KEY
const privateKey = normalizeKey(rawKey)
if (!privateKey) {
  console.error(
    rawKey
      ? 'PRIVATE_KEY must be a 32-byte hex key (64 hex chars; 0x optional).'
      : 'Missing PRIVATE_KEY env var (Base Sepolia testnet key).',
  )
  process.exit(1)
}

// Step 1: unpaid request must be rejected with 402.
const unpaid = await fetch(url)
console.log(`[1] unpaid GET ${url} -> ${unpaid.status}`)
if (unpaid.status !== 402) {
  console.error(`  FAIL: expected 402, got ${unpaid.status}`)
  process.exit(1)
}
console.log('  accepts:', JSON.stringify((await unpaid.json()).accepts))

// Step 2: paid request must succeed and return the article.
const fetchWithPayment = makePaidFetch(privateKey, process.env.X402_NETWORK)

const paid = await fetchWithPayment(url, { method: 'GET' })
console.log(`[2] paid GET ${url} -> ${paid.status}`)
if (paid.status !== 200) {
  console.error(`  FAIL: expected 200, got ${paid.status}`)
  console.error('  body:', await paid.text())
  process.exit(1)
}

const article = await paid.json()
console.log('  PASS. article keys:', Object.keys(article).join(', '))
console.log('  title:', article.title)
