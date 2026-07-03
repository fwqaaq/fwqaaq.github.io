/**
 * Shared x402 v2 payment client for the test scripts. Wraps `fetch` so a 402
 * response is paid automatically (EIP-3009 `exact` scheme) with the given
 * testnet wallet. Defaults to Base Sepolia (eip155:84532).
 */
import { wrapFetchWithPayment, x402Client } from '@x402/fetch'
import { ExactEvmScheme } from '@x402/evm/exact/client'
import { toClientEvmSigner } from '@x402/evm'
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

type SupportedNetwork = 'eip155:84532' | 'eip155:8453'

/** Normalize and validate a supported CAIP-2 x402 network. */
export function normalizeNetwork(raw?: string): SupportedNetwork {
  const network = raw?.trim() || 'eip155:84532'
  if (network === 'eip155:84532' || network === 'eip155:8453') {
    return network
  }
  throw new Error(
    `Unsupported X402_NETWORK "${network}". Use eip155:84532 or eip155:8453.`,
  )
}

/** Build a payment-enabled fetch for the given key and CAIP-2 network. */
export function makePaidFetch(
  privateKey: `0x${string}`,
  network?: string,
) {
  const caip2Network = normalizeNetwork(network)
  const account = privateKeyToAccount(privateKey)
  const chain = caip2Network === 'eip155:8453' ? base : baseSepolia
  const publicClient = createPublicClient({ chain, transport: http() })
  const signer = toClientEvmSigner(account, publicClient)
  const client = new x402Client().register(
    caip2Network,
    new ExactEvmScheme(signer),
  )
  return wrapFetchWithPayment(fetch, client)
}

/** Normalize a PRIVATE_KEY env value to a 0x-prefixed 32-byte hex key. */
export function normalizeKey(raw: string | undefined): `0x${string}` | null {
  const k = raw?.trim()
  if (!k) return null
  const key = (k.startsWith('0x') ? k : `0x${k}`) as `0x${string}`
  return /^0x[0-9a-fA-F]{64}$/.test(key) ? key : null
}
