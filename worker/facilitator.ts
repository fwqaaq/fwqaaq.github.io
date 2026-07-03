import { HTTPFacilitatorClient } from '@x402/core/server'
import { createFacilitatorConfig } from '@coinbase/x402'

interface FacilitatorEnv {
  NETWORK: string
  FACILITATOR_URL: string
  CDP_API_KEY_ID: string
  CDP_API_KEY_SECRET: string
}

/** CAIP-2 id for Base mainnet. */
const BASE_MAINNET = 'eip155:8453'

/**
 * Selects the x402 facilitator by network:
 *   - Base mainnet (eip155:8453) → Coinbase CDP facilitator, real USDC
 *     settlement, authenticated with CDP API keys passed explicitly.
 *   - testnet (eip155:84532)      → public x402.org facilitator, no keys.
 */
export function getFacilitator(env: FacilitatorEnv): HTTPFacilitatorClient {
  if (env.NETWORK === BASE_MAINNET) {
    return new HTTPFacilitatorClient(
      createFacilitatorConfig(env.CDP_API_KEY_ID, env.CDP_API_KEY_SECRET),
    )
  }
  return new HTTPFacilitatorClient({
    url: env.FACILITATOR_URL as `${string}://${string}`,
  })
}
