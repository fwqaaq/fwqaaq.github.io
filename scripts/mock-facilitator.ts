/**
 * Mock x402 facilitator for LOCAL paid-path testing with zero funds.
 * Approves every verify/settle so the Worker's payment-success code path
 * (settlement headers, pass cookie, KV purchase record) can be exercised
 * without a real wallet. NEVER point production at this.
 *
 * Usage: node scripts/mock-facilitator.ts   (listens on :4402)
 * Then in .dev.vars: FACILITATOR_URL=http://localhost:4402
 */
import { createServer } from 'node:http'

const NETWORK = 'eip155:84532'

async function readJson(req: import('node:http').IncomingMessage): Promise<any> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))
  if (chunks.length === 0) return undefined
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function sendJson(res: import('node:http').ServerResponse, body: unknown, status = 200) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost:4402')

  if (pathname === '/supported') {
    sendJson(res, {
      kinds: [{ x402Version: 2, scheme: 'exact', network: NETWORK }],
    })
    return
  }

  if (pathname === '/verify' || pathname === '/settle') {
    let payer = '0x0000000000000000000000000000000000000000'
    try {
      const body = await readJson(req)
      payer = body?.paymentPayload?.payload?.authorization?.from ?? payer
    } catch { /* keep default */ }

    if (pathname === '/verify') {
      console.log('[mock] verify ok, payer', payer)
      sendJson(res, { isValid: true, payer })
      return
    }
    console.log('[mock] settle ok, payer', payer)
    sendJson(res, {
      success: true,
      transaction: `0x${'11'.repeat(32)}`,
      network: NETWORK,
      payer,
    })
    return
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('not found')
}).listen(4402, () => {
  console.log('Mock x402 facilitator listening on http://localhost:4402')
})
