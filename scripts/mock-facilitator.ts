/**
 * Mock x402 facilitator for LOCAL paid-path testing with zero funds.
 * Approves every verify/settle so the Worker's payment-success code path
 * (settlement headers, pass cookie, KV purchase record) can be exercised
 * without a real wallet. NEVER point production at this.
 *
 * Usage: deno run -A scripts/mock-facilitator.ts   (listens on :4402)
 * Then in .dev.vars: FACILITATOR_URL=http://localhost:4402
 */
const NETWORK = 'eip155:84532'

Deno.serve({ port: 4402 }, async (req) => {
  const { pathname } = new URL(req.url)

  if (pathname === '/supported') {
    return Response.json({
      kinds: [{ x402Version: 2, scheme: 'exact', network: NETWORK }],
    })
  }

  if (pathname === '/verify' || pathname === '/settle') {
    let payer = '0x0000000000000000000000000000000000000000'
    try {
      const body = await req.json()
      payer = body?.paymentPayload?.payload?.authorization?.from ?? payer
    } catch { /* keep default */ }

    if (pathname === '/verify') {
      console.log('[mock] verify ok, payer', payer)
      return Response.json({ isValid: true, payer })
    }
    console.log('[mock] settle ok, payer', payer)
    return Response.json({
      success: true,
      transaction: `0x${'11'.repeat(32)}`,
      network: NETWORK,
      payer,
    })
  }

  return new Response('not found', { status: 404 })
})
