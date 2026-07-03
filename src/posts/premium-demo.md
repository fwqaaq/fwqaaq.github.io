---
date: 2026-07-03 10:00:00
title: 付费文章演示：x402 是如何工作的
categories: Other
paid: true
price: "$0.1"
tags:
  - Chore
  - x402
summary: 这是一篇用于演示 x402 人类付费墙的付费文章，摘要免费可见，全文需解锁后阅读。
updateAt: 2026-07-03 10:00:00
---

传统网页靠广告和订阅变现。但当访问者从人变成 AI agent
与自动化程序时，它们既不看广告，也不一定适合办月度订阅。

x402 想解决的正是这个问题：让“按次付费”成为一次 HTTP
请求的原生环节。客户端请求资源，服务器用 HTTP 402
告诉客户端付款要求，客户端付款后重试同一个请求。整个过程可以由程序自动完成，也可以由浏览器付款页辅助完成。

本文会从协议角色、请求流程、浏览器和 agent 的差异讲起，再说明这个博客如何用 x402
实现付费文章、AI 爬虫付费门和付款后的通行证。

## 什么是 x402

x402 是 Coinbase 在 2025 年提出的开放支付协议。它复活了 HTTP
里一直没被正经用起来的状态码
`402 Payment Required`，把“付费”直接编进请求与响应。

HTTP 402
的价值在于位置很合适。它不是应用里的一个自定义错误，也不是跳转到外部收银台的临时约定。它直接出现在资源请求的边界上：客户端要一个资源，服务器说“这个资源需要付款”，并给出机器可读的付款要求。

它有三个关键特征：

- **机器原生**。面向程序与
  agent，解决「按次调用一个接口或资源」的付费，不需要注册、办卡或包月。
- **稳定币结算**。默认用 USDC，主要跑在 Base 这类低 gas
  的链上，单笔可低到几分之一美分。
- **无需自建收银台**。链上验证与结算交给第三方
  facilitator，服务器本身不持有私钥，也不用跑节点。

## 协议里的几个角色

一次 x402 交互里，至少有 5 个角色：

- **客户端**：请求资源的一方。它可以是浏览器、脚本、AI agent 或爬虫。
- **资源服务器**：托管受保护内容的一方。本站的 Cloudflare Worker
  就是资源服务器。
- **钱包**：持有付款私钥的一方。程序用私钥签名，浏览器用户用钱包插件确认。
- **facilitator**：负责验证和结算付款的服务。测试网用公开 HTTP
  facilitator，主网用 Coinbase CDP facilitator。
- **USDC 合约**：最终执行转账的链上合约。x402 的 `exact`
  方案会围绕这笔转账生成授权。

资源服务器不需要保存用户银行卡，也不需要保管用户私钥。它只需要能判断：这次请求有没有带有效付款凭证；如果凭证有效，facilitator
是否已经完成结算。

## 一次付款如何发生

服务器从不相信客户端的口头声明，只认一份密码学签名的付款凭证。一次完整交互如下：

1. 客户端请求受保护资源，例如 `GET /api/content/iterator`。
2. 服务器发现没有付款，返回 `402`，并在 `PAYMENT-REQUIRED`
   响应头里附上付款要求。
3. 付款要求里包含金额、网络、代币、收款地址、超时时间和资源描述。
4. 客户端据此构造一笔**签名的付款凭证**。凭证放进 `X-PAYMENT` 或
   `PAYMENT-SIGNATURE` 请求头。
5. 客户端带着这个头**重发同一个请求**。
6. facilitator 先 verify（核对签名、金额、收款地址与余额），再
   settle（把这笔授权提交到链上 USDC
   合约执行转账）。两步都成功，服务器才返回内容，并在响应头带上
   `X-PAYMENT-RESPONSE`。

伪造不了这份凭证：签名由付款人私钥签出，钱也真的从他钱包里被划走。

## exact 方案和 EIP-3009

本站使用的是 x402 v2 的 `exact`
方案。它的意思是：客户端必须按服务器声明的要求，精确支付指定金额、指定资产和指定收款地址。

在 EVM 网络上，`exact` 通常使用 USDC 的 EIP-3009
`transferWithAuthorization`。它不是先发起一笔普通转账，再告诉服务器“我已经付了”。它更像是一张有签名的授权书：

- 授权里写明付款人、收款人、金额、有效期和 nonce。
- nonce 防止同一份授权被重复使用。
- facilitator 验证签名后，把授权提交给 USDC 合约。
- USDC 合约执行成功后，付款才算 settle 完成。

这也是 x402
适合自动化请求的原因。客户端可以先收到付款要求，再即时签出一份只对这次资源请求有意义的授权。

## verify 和 settle 的区别

facilitator 做两件事：verify 和 settle。

verify
是“这张付款凭证看起来对不对”。它会检查签名、金额、网络、资产、收款地址、有效期和余额等条件。verify
通过只代表这笔付款有可能成功。

settle 是“把付款真正结算到链上”。这一步会把授权提交给 USDC 合约。只有 settle
成功，资源服务器才应该返回受保护内容。

把两步拆开很重要。服务器不能只看客户端传来的头，也不能只相信本地解析结果。否则，攻击者可能构造看似完整但无法结算的请求。

## Agent 如何发现需要付款

对 agent 来说，x402 的入口不是按钮，而是一次普通 HTTP 请求。agent
先像访问免费资源一样请求目标 URL。如果资源需要付款，服务器返回 `402`。

以本站本地开发环境为例，未付款请求如下：

```ts
const res = await fetch('http://localhost:8787/api/content/iterator')

console.log(res.status) // 402
console.log(await res.json())
```

返回体里会出现 `accepts`。它是机器可读的付款要求。agent 应重点读取这些字段：

- `scheme`：本站使用 `exact`，表示必须精确支付服务器声明的金额和资产。
- `network`：本地默认是 `eip155:84532`，也就是 Base Sepolia。
- `price`：本次请求价格，例如 `$0.1` 或 `$1`。
- `payTo`：收款地址，必须和 agent 准备付款的目标一致。
- `resource` 或 `description`：说明这笔钱买的是哪个资源。

agent
不应该盲目付款。它应先检查网络、价格、资产和收款地址，再判断是否在预算内。只有检查通过，才进入签名付款阶段。

## Agent 如何自动付款

对 agent 来说，付款过程可以完全自动。`@x402/fetch` 把标准 `fetch`
包一层：先正常请求，遇到 `402` 后读取付款要求，再用钱包签名、带 `X-PAYMENT`
重发，最后把 `200` 响应交回。

下面是一个可运行的 Deno 示例。它和本仓库 `scripts/x402-client.ts`
的思路一致，只保留最核心的路径：

```ts
import { wrapFetchWithPayment, x402Client } from '@x402/fetch'
import { ExactEvmScheme } from '@x402/evm/exact/client'
import { toClientEvmSigner } from '@x402/evm'
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

type SupportedNetwork = 'eip155:84532' | 'eip155:8453'

function normalizeNetwork(raw?: string): SupportedNetwork {
  const network = raw?.trim() || 'eip155:84532'
  if (network === 'eip155:84532' || network === 'eip155:8453') {
    return network
  }
  throw new Error(`Unsupported x402 network: ${network}`)
}

function normalizeKey(raw?: string): `0x${string}` {
  const key = raw?.trim()
  if (!key) throw new Error('Missing PRIVATE_KEY')
  const normalized = key.startsWith('0x') ? key : `0x${key}`
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error('PRIVATE_KEY must be a 32-byte hex key')
  }
  return normalized as `0x${string}`
}

export function paidFetch(privateKey: `0x${string}`, network?: string) {
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

const fetchWithPayment = paidFetch(
  normalizeKey(Deno.env.get('PRIVATE_KEY')),
  Deno.env.get('X402_NETWORK'),
)

const res = await fetchWithPayment(
  'http://localhost:8787/api/content/iterator',
)

console.log(res.status)
console.log(await res.json())
```

这段代码有两个安全默认值。第一，默认网络是
`eip155:84532`，也就是测试网。第二，它只允许 `eip155:84532` 和
`eip155:8453`。如果 agent 收到未知网络，就直接失败，而不是尝试付款。

生产环境可以把 URL 换成：

```txt
https://www.fwqaaq.com/api/content/iterator
```

但这时也要把 `X402_NETWORK` 切到 `eip155:8453`，并准备真实 Base mainnet
USDC。主网会花真钱，不适合静默测试。

## 用本站 API 举例

本站的 `/api/content/:slug` 是给 agent 用的结构化内容 API。它返回
JSON，而不是整页 HTML。agent 拿到后可以摘要、检索、引用或继续做知识处理。

例如，请求免费文章 `iterator` 的结构化内容：

```ts
const fetchWithPayment = paidFetch(
  normalizeKey(Deno.env.get('PRIVATE_KEY')),
  Deno.env.get('X402_NETWORK'),
)

const res = await fetchWithPayment(
  'http://localhost:8787/api/content/iterator',
)

if (!res.ok) {
  throw new Error(`request failed: ${res.status} ${await res.text()}`)
}

const article = await res.json()

console.log(article.title)
console.log(article.summary)
console.log(article.markdown.slice(0, 200))
```

这条路径对应仓库里的
`scripts/pay-test.ts`。测试脚本会先做一次未付款请求，确认服务器返回
`402`。然后它使用 payment-enabled fetch 重试，付款成功后应返回 `200` 和文章
JSON。

注意一个细节：`/api/content/:slug`
只暴露免费文章的结构化内容。付费文章不会进入这个 API。这样可以避免 agent 绕过
`/premium/:slug` 直接拿到付费全文。

## 读取这篇付费文章

如果 agent 想读取本文全文，应访问付费文章路由：

```txt
GET http://localhost:8787/premium/premium-demo
```

这个路由对浏览器和 agent 使用同一套付款门。差别在于表现形式不同。浏览器会看到
paywall 页面，agent 会收到机器可读的 `402`。

agent 付款读取本文全文的代码如下：

```ts
const fetchWithPayment = paidFetch(
  normalizeKey(Deno.env.get('PRIVATE_KEY')),
  Deno.env.get('X402_NETWORK'),
)

const res = await fetchWithPayment(
  'http://localhost:8787/premium/premium-demo',
)

if (!res.ok) {
  throw new Error(`premium request failed: ${res.status}`)
}

const pass = res.headers.get('set-cookie')
const html = await res.text()

console.log('pass cookie:', pass)
console.log(html.slice(0, 500))
```

付款成功后，Worker 返回完整 HTML，并签发一张通行证 cookie。agent 可以保存这个
cookie。之后在有效期内访问同一篇文章时，带上 cookie 即可免重付：

```ts
const cookie = pass?.split(';')[0]
const reuse = await fetch('http://localhost:8787/premium/premium-demo', {
  headers: cookie ? { cookie } : {},
})

console.log(reuse.status) // 200
```

这条路径对应 `scripts/premium-test.ts`。脚本会验证浏览器未付款拿到 paywall、公开
teaser 不泄露全文、agent 付款拿到全文，以及 cookie 复用能免重付。

## 作为 AI 爬虫访问文章页

本站还有一个专门给 AI
爬虫的入口：`/posts/*`。真人浏览器访问普通文章页是免费的。已知 AI
爬虫访问同一路径时，会被要求通过 x402 付款。

这个设计解决的是另一类问题。很多爬虫不是为了读某一篇付费文章，而是大规模抓取公开
HTML。对这类流量，本站按 User-Agent 识别后收取爬取费用。

示例请求如下：

```ts
const crawlerUA =
  'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)'

const fetchWithPayment = paidFetch(
  normalizeKey(Deno.env.get('PRIVATE_KEY')),
  Deno.env.get('X402_NETWORK'),
)

const res = await fetchWithPayment(
  'http://localhost:8787/posts/20260703180000/',
  {
    headers: { 'user-agent': crawlerUA },
  },
)

console.log(res.status)
console.log(await res.text())
```

这条路径对应 `scripts/crawl-test.ts`。脚本会验证 3 件事：真人浏览器
`200`、爬虫未付款 `402`、爬虫付款后 `200`。

所以，本站对 agent 和爬虫做了区分：

- `/api/content/:slug`：结构化 JSON，适合 agent 读取知识。
- `/premium/:slug`：付费文章全文 HTML，适合 agent 解锁单篇内容。
- `/posts/*`：普通文章 HTML，只有 AI 爬虫 User-Agent 触发付费门。

## 接入到自己的 agent 工具

把 x402 接进 agent
工具时，我建议把付款封成一个显式工具，而不是让模型随便发请求。工具可以叫
`paidFetch`，输入是 URL、最大预算和目标网络。

一个最小工具流程如下：

1. 先发未付款请求，读取 `402` 和 `accepts`。
2. 检查 `network` 是否在允许列表中。
3. 检查 `price` 是否小于本次预算。
4. 检查 `payTo` 是否是预期收款地址，或至少展示给用户确认。
5. 通过检查后，用 `@x402/fetch` 自动付款重试。
6. 返回内容、付款响应头和可复用的通行证 cookie。

这种封装让 agent
有清晰边界。它可以自动处理低风险测试网请求，也可以在主网付款前暂停，让用户确认金额和收款地址。

本仓库的 3 个脚本可以直接作为参考：

- `scripts/pay-test.ts`：演示 agent 付费读取 `/api/content/:slug`。
- `scripts/premium-test.ts`：演示 agent 付费读取
  `/premium/:slug`，并复用通行证。
- `scripts/crawl-test.ts`：演示 AI crawler User-Agent 访问 `/posts/*`。

如果要迁到生产环境，只需要改 3 个输入：Base URL、`X402_NETWORK` 和钱包。Base URL
从 `http://localhost:8787` 换成生产域名。网络从 `eip155:84532` 换成
`eip155:8453`。钱包则必须有 Base mainnet USDC。

## 人类如何在浏览器里付款

普通浏览器没有 x402 客户端，但服务端框架 `@x402/hono`
可以返回付款页。当请求来自真浏览器（`Accept: text/html`）且尚未付款时，本站返回由
`@x402/paywall` 生成的页面。这个页面内置连钱包、切网络和付款按钮。

- **支持的钱包**：Coinbase Wallet，以及任意注入 `window.ethereum` 的 EVM
  钱包，例如 MetaMask、Rabby、OKX Wallet。付款前需把钱包切到对应网络。
- **付款后**：paywall 带着 `X-PAYMENT` 重新取一次资源，若返回的是
  HTML，就把全文原地渲染到当前页面。读者付完即见全文，无需自建前端。

同一个路由对两类访问者都友好：浏览器看到付款页，agent 拿到 JSON 格式的 `402`。

## 这个博客如何接入

本站把 x402 放在 3 个地方：

- **`/api/content/:slug`**：面向 agent 的 JSON
  API。它只暴露免费文章的结构化内容，调用前需要付款。
- **`/posts/*`**：面向 AI 爬虫的付费门。真人浏览器免费读，已知 AI 爬虫按
  User-Agent 识别后需要付款。
- **`/premium/:slug`**：面向真人和 agent
  的付费文章。公开页面只放摘要，全文只在付款后由 Worker 返回。

写文章时，frontmatter 里的 `paid: true`
会把文章变成付费文章。构建阶段会把公开静态页替换成摘要和“解锁全文”入口。全文
HTML 不写入公开静态文件，而是进入 Worker 的 `premium` 数据表。

如果文章 frontmatter 里写了 `price: "$1"`，这篇文章就使用这个价格。没有写
`price` 时，Worker 使用部署环境里的
`PREMIUM_PRICE`。这样可以统一设置默认价，也可以给少数文章单独定价。

## 通行证：避免重复付款

每次访问都上链结算既慢又费。所以付款成功后，服务端会用自己的密钥做 HMAC-SHA256
签发一张**通行证**，写进带期限的
cookie。之后同一篇文章的请求带上它，服务端只需在本地验签，即可跳过付款直接返回全文。

两个阶段的判断依据不同：

- **首次访问**：靠 `X-PAYMENT` 里的钱包签名，经 facilitator 在链上真正转账。
- **后续访问**：靠服务端签发的通行证
  cookie，本地验签、检查未过期且文章匹配即可。

你现在能读到这段文字，正是因为你已经付款、拿到了一张仍在有效期内的通行证。

## 测试网和主网

本地开发默认跑 Base Sepolia（`eip155:84532`）。这是测试网，可以用测试 USDC
验证流程，不会动真实资金。

生产部署使用 Base mainnet（`eip155:8453`）。主网付款会结算真实
USDC，需要真实收款地址和 Coinbase CDP API
keys。本站在代码里把本地和生产分开：`wrangler dev` 会读取
`.dev.vars`，而部署后的 Worker 使用 `wrangler.jsonc` 和 Cloudflare secrets。

这也是为什么本地还能用测试网付款。它不是“没有切主网”，而是刻意保留的安全护栏。真正需要确认主网时，应部署
Worker，并用极小金额做一次真实 USDC 冒烟测试。

## 失败处理和安全边界

x402 让按次付费更容易，但 agent
不能把付款当成普通网络重试。失败时要停下来，给出明确原因。

常见失败可以按这几类处理：

- **私钥缺失**：直接报错，要求配置 `PRIVATE_KEY`。不要把私钥写进
  prompt、日志、仓库或前端代码。
- **网络不匹配**：如果服务器要求 `eip155:8453`，但 agent
  只允许测试网，应拒绝付款。
- **价格超预算**：agent 应比较 `accepts`
  里的价格和本次预算。超过预算时，让用户确认。
- **余额不足**：提示钱包需要对应网络的 USDC。测试网和主网余额不能互相使用。
- **verify 失败**：通常是签名、金额、资产或收款地址不匹配。agent
  应停止重试，避免重复签名。
- **settle 失败**：付款授权没有成功上链。agent
  应把错误返回给用户，不应假装已经拿到内容。
- **通行证过期**：重新走 x402 付款流程，或让用户确认是否再次付款。

服务端也要守住几条边界：

- **缓存**：付费内容必须 `no-store`，不能被 CDN 或浏览器缓存后免费重放。
- **密钥**：`ACCESS_TOKEN_SECRET` 和 CDP keys 必须放在 Worker secrets
  里，不应提交到仓库。
- **价格**：公开显示的价格和 Worker 实收价格必须来自同一份配置。
- **主网测试**：主网 smoke test 会花真实 USDC，应使用极小金额和受控收款地址。

这篇文章本身就是一个端到端演示：摘要公开，全文付费；浏览器看到 paywall，agent
可以用 `@x402/fetch` 自动付款；付款成功后，通行证让同一篇文章在有效期内免重付。
