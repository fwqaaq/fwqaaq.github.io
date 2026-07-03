/**
 * End-to-end verification of wallet-signature access recovery — zero funds.
 *
 *   1. seed a purchase record into local KV (simulating a settled payment)
 *   2. GET challenge, sign it with a local key (personal_sign semantics)
 *   3. POST restore → expect 200 + pass cookie
 *   4. GET the article with the cookie → 200, full body
 *   5. an address with NO purchase record → restore rejected with 403
 *
 * Requires `npx wrangler dev --port 8787` running (local KV is shared via
 * .wrangler/state). Usage: deno run -A scripts/restore-test.ts
 */
import { privateKeyToAccount } from 'viem/accounts'

const BASE = 'http://localhost:8787'
const SLUG = 'premium-demo'
const NETWORK = 'eip155:84532'
// Well-known hardhat dev keys — never funded, never used on real networks.
const BUYER_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const
const STRANGER_KEY =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as const
const BODY_MARKER = '什么是 x402'

const buyer = privateKeyToAccount(BUYER_KEY)
const stranger = privateKeyToAccount(STRANGER_KEY)

// Step 1: seed the buyer's purchase record into the local KV store.
const key = `purchase:${NETWORK}:${buyer.address.toLowerCase()}:${SLUG}`
const seed = new Deno.Command('npx', {
  args: [
    'wrangler', 'kv', 'key', 'put', '--binding', 'PURCHASES', '--local',
    key, JSON.stringify({ paidAt: Date.now(), seededByTest: true }),
  ],
  stdout: 'null',
  stderr: 'piped',
})
const seeded = await seed.output()
if (seeded.code !== 0) {
  console.error('[1] FAIL seeding KV:', new TextDecoder().decode(seeded.stderr))
  Deno.exit(1)
}
console.log(`[1] seeded KV purchase record for ${buyer.address}`)

async function restoreAs(account: typeof buyer): Promise<Response> {
  const cres = await fetch(
    `${BASE}/premium/${SLUG}/challenge?address=${account.address}`,
  )
  if (!cres.ok) throw new Error(`challenge failed: ${cres.status}`)
  const { challenge } = await cres.json()
  const signature = await account.signMessage({ message: challenge })
  return fetch(`${BASE}/premium/${SLUG}/restore`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address: account.address, challenge, signature }),
  })
}

// Steps 2-3: buyer restores access.
const restored = await restoreAs(buyer)
const setCookie = restored.headers.get('set-cookie')
console.log(`[2] buyer restore       -> ${restored.status}, cookie: ${!!setCookie}`)
if (restored.status !== 200 || !setCookie) {
  console.error('  FAIL:', await restored.text())
  Deno.exit(1)
}

// Step 4: the pass cookie unlocks the full article.
const cookie = setCookie.split(';')[0]
const article = await fetch(`${BASE}/premium/${SLUG}`, { headers: { cookie } })
const html = await article.text()
console.log(`[3] article with cookie -> ${article.status}, full body: ${html.includes(BODY_MARKER)}`)
if (article.status !== 200 || !html.includes(BODY_MARKER)) {
  console.error('  FAIL: expected 200 with full article body')
  Deno.exit(1)
}

// Step 5: a wallet with no purchase record is rejected.
const denied = await restoreAs(stranger)
console.log(`[4] stranger restore    -> ${denied.status} (expect 403)`)
if (denied.status !== 403) {
  console.error('  FAIL:', await denied.text())
  Deno.exit(1)
}

console.log('PASS (all steps)')
