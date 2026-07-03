const COOKIE_PREFIX = 'premium_'
const encoder = new TextEncoder()

function base64url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function hmac(secret: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return new Uint8Array(sig)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

function parseCookie(header: string, name: string): string | undefined {
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return undefined
}

export function passName(slug: string): string {
  return `${COOKIE_PREFIX}${slug}`
}

export async function issueToken(
  slug: string,
  secret: string,
  ttlSeconds: number,
): Promise<string> {
  const payload = base64url(
    encoder.encode(JSON.stringify({ slug, exp: Date.now() + ttlSeconds * 1000 })),
  )
  const sig = base64url(await hmac(secret, payload))
  return `${payload}.${sig}`
}

export function passCookie(
  slug: string,
  token: string,
  ttlSeconds: number,
  secure: boolean,
): string {
  const attrs = `Path=/premium/${slug}; Max-Age=${ttlSeconds}; HttpOnly; SameSite=Lax`
  return `${passName(slug)}=${token}; ${attrs}${secure ? '; Secure' : ''}`
}

export async function hasValidPassToken(
  token: string | undefined,
  slug: string,
  secret: string,
): Promise<boolean> {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false

  const expected = base64url(await hmac(secret, payload))
  if (!timingSafeEqual(sig, expected)) return false

  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)))
    return data.slug === slug && typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

export async function hasValidPass(
  cookieHeader: string | undefined,
  slug: string,
  secret: string,
): Promise<boolean> {
  if (!cookieHeader) return false
  return hasValidPassToken(parseCookie(cookieHeader, passName(slug)), slug, secret)
}
