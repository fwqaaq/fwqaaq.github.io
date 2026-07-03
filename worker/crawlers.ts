/**
 * Known automated AI crawler / scraper User-Agents. A request whose User-Agent
 * matches any of these (case-insensitive substring) is charged via x402 on
 * `/posts/*`; everything else — real browsers, unknown or missing UAs — is
 * served free. UA is spoofable, so this is best-effort pay-per-crawl; a crawler
 * faking a browser UA evades it (Web Bot Auth is the robust upgrade, deferred).
 */
export const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'meta-externalagent',
  'FacebookBot',
  'Diffbot',
  'Omgilibot',
  'YouBot',
  'cohere-ai',
  'DataForSeoBot',
]

const lowered = AI_CRAWLERS.map((c) => c.toLowerCase())

/** True if the User-Agent belongs to a known AI crawler. */
export function isAiCrawler(userAgent: string | undefined | null): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return lowered.some((c) => ua.includes(c))
}
