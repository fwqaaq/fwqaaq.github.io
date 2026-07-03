---
date: 2026-07-03 10:00:00
title: 付费文章演示：x402 是如何工作的
categories: Other
paid: true
price: "$1"
tags:
  - Chore
  - x402
summary: 这是一篇用于演示 x402 人类付费墙的付费文章，摘要免费可见，全文需解锁后阅读。
updateAt: 2026-07-03 10:00:00
---

传统网页靠广告和订阅变现。但当访问者从人变成 AI agent 与自动化程序时，它们既不看广告，也不一定适合办月度订阅。

x402 想解决的正是这个问题：让“按次付费”成为一次 HTTP 请求的原生环节。客户端请求资源，服务器用 HTTP 402 告诉客户端付款要求，客户端付款后重试同一个请求。整个过程可以由程序自动完成，也可以由浏览器付款页辅助完成。

本文会从协议角色、请求流程、浏览器和 agent 的差异讲起，再说明这个博客如何用 x402 实现付费文章、AI 爬虫付费门和付款后的通行证。

## 什么是 x402

x402 是 Coinbase 在 2025 年提出的开放支付协议。它复活了 HTTP 里一直没被正经用起来的状态码 `402 Payment Required`，把“付费”直接编进请求与响应。

HTTP 402 的价值在于位置很合适。它不是应用里的一个自定义错误，也不是跳转到外部收银台的临时约定。它直接出现在资源请求的边界上：客户端要一个资源，服务器说“这个资源需要付款”，并给出机器可读的付款要求。

它有三个关键特征：

- **机器原生**。面向程序与 agent，解决「按次调用一个接口或资源」的付费，不需要注册、办卡或包月。
- **稳定币结算**。默认用 USDC，主要跑在 Base 这类低 gas 的链上，单笔可低到几分之一美分。
- **无需自建收银台**。链上验证与结算交给第三方 facilitator，服务器本身不持有私钥，也不用跑节点。

## 协议里的几个角色

一次 x402 交互里，至少有 5 个角色：

- **客户端**：请求资源的一方。它可以是浏览器、脚本、AI agent 或爬虫。
- **资源服务器**：托管受保护内容的一方。本站的 Cloudflare Worker 就是资源服务器。
- **钱包**：持有付款私钥的一方。程序用私钥签名，浏览器用户用钱包插件确认。
- **facilitator**：负责验证和结算付款的服务。测试网用公开 HTTP facilitator，主网用 Coinbase CDP facilitator。
- **USDC 合约**：最终执行转账的链上合约。x402 的 `exact` 方案会围绕这笔转账生成授权。

资源服务器不需要保存用户银行卡，也不需要保管用户私钥。它只需要能判断：这次请求有没有带有效付款凭证；如果凭证有效，facilitator 是否已经完成结算。

## 一次付款如何发生

服务器从不相信客户端的口头声明，只认一份密码学签名的付款凭证。一次完整交互如下：

1. 客户端请求受保护资源，例如 `GET /api/content/iterator`。
2. 服务器发现没有付款，返回 `402`，并在 `PAYMENT-REQUIRED` 响应头里附上付款要求。
3. 付款要求里包含金额、网络、代币、收款地址、超时时间和资源描述。
4. 客户端据此构造一笔**签名的付款凭证**。凭证放进 `X-PAYMENT` 或 `PAYMENT-SIGNATURE` 请求头。
5. 客户端带着这个头**重发同一个请求**。
6. facilitator 先 verify（核对签名、金额、收款地址与余额），再 settle（把这笔授权提交到链上 USDC 合约执行转账）。两步都成功，服务器才返回内容，并在响应头带上 `X-PAYMENT-RESPONSE`。

伪造不了这份凭证：签名由付款人私钥签出，钱也真的从他钱包里被划走。

## exact 方案和 EIP-3009

本站使用的是 x402 v2 的 `exact` 方案。它的意思是：客户端必须按服务器声明的要求，精确支付指定金额、指定资产和指定收款地址。

在 EVM 网络上，`exact` 通常使用 USDC 的 EIP-3009 `transferWithAuthorization`。它不是先发起一笔普通转账，再告诉服务器“我已经付了”。它更像是一张有签名的授权书：

- 授权里写明付款人、收款人、金额、有效期和 nonce。
- nonce 防止同一份授权被重复使用。
- facilitator 验证签名后，把授权提交给 USDC 合约。
- USDC 合约执行成功后，付款才算 settle 完成。

这也是 x402 适合自动化请求的原因。客户端可以先收到付款要求，再即时签出一份只对这次资源请求有意义的授权。

## verify 和 settle 的区别

facilitator 做两件事：verify 和 settle。

verify 是“这张付款凭证看起来对不对”。它会检查签名、金额、网络、资产、收款地址、有效期和余额等条件。verify 通过只代表这笔付款有可能成功。

settle 是“把付款真正结算到链上”。这一步会把授权提交给 USDC 合约。只有 settle 成功，资源服务器才应该返回受保护内容。
·
把两步拆开很重要。服务器不能只看客户端传来的头，也不能只相信本地解析结果。否则，攻击者可能构造看似完整但无法结算的请求。

## Agent 如何使用

对 agent 来说，付款过程可以完全自动。`@x402/fetch` 把标准 `fetch` 包一层：正常请求，遇到 `402` 就自动读取付款要求、用钱包签名、带 `X-PAYMENT` 重发，最后把 `200` 的结果交回。

下面是最小示例（对应本仓库的 `scripts/pay-test.ts`）：

```ts
import { wrapFetchWithPayment, x402Client } from '@x402/fetch'
import { ExactEvmScheme } from '@x402/evm/exact/client'
import { toClientEvmSigner } from '@x402/evm'
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

// 一个持有 Base 测试网 USDC 的钱包
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})
const signer = toClientEvmSigner(account, publicClient)
const client = new x402Client().register(
  'eip155:84532',
  new ExactEvmScheme(signer),
)

// 包装后的 fetch 会在遇到 402 时自动完成付款并重试
const fetchWithPayment = wrapFetchWithPayment(fetch, client)

const res = await fetchWithPayment('https://example.com/api/content/iterator', {
  method: 'GET',
})
const article = await res.json() // 付款成功后拿到结构化内容
```

对 agent 而言，「付费访问」和「普通 HTTP 调用」在代码上几乎没有区别。这正是 x402 的价值：把支付变成一次可编程的请求。

## 人类如何在浏览器里付款

普通浏览器没有 x402 客户端，但服务端框架 `@x402/hono` 可以返回付款页。当请求来自真浏览器（`Accept: text/html`）且尚未付款时，本站返回由 `@x402/paywall` 生成的页面。这个页面内置连钱包、切网络和付款按钮。

- **支持的钱包**：Coinbase Wallet，以及任意注入 `window.ethereum` 的 EVM 钱包，例如 MetaMask、Rabby、OKX Wallet。付款前需把钱包切到对应网络。
- **付款后**：paywall 带着 `X-PAYMENT` 重新取一次资源，若返回的是 HTML，就把全文原地渲染到当前页面。读者付完即见全文，无需自建前端。

同一个路由对两类访问者都友好：浏览器看到付款页，agent 拿到 JSON 格式的 `402`。

## 这个博客如何接入

本站把 x402 放在 3 个地方：

- **`/api/content/:slug`**：面向 agent 的 JSON API。它只暴露免费文章的结构化内容，调用前需要付款。
- **`/posts/*`**：面向 AI 爬虫的付费门。真人浏览器免费读，已知 AI 爬虫按 User-Agent 识别后需要付款。
- **`/premium/:slug`**：面向真人和 agent 的付费文章。公开页面只放摘要，全文只在付款后由 Worker 返回。

写文章时，frontmatter 里的 `paid: true` 会把文章变成付费文章。构建阶段会把公开静态页替换成摘要和“解锁全文”入口。全文 HTML 不写入公开静态文件，而是进入 Worker 的 `premium` 数据表。

如果文章 frontmatter 里写了 `price: "$1"`，这篇文章就使用这个价格。没有写 `price` 时，Worker 使用部署环境里的 `PREMIUM_PRICE`。这样可以统一设置默认价，也可以给少数文章单独定价。

## 通行证：避免重复付款

每次访问都上链结算既慢又费。所以付款成功后，服务端会用自己的密钥做 HMAC-SHA256 签发一张**通行证**，写进带期限的 cookie。之后同一篇文章的请求带上它，服务端只需在本地验签，即可跳过付款直接返回全文。

两个阶段的判断依据不同：

- **首次访问**：靠 `X-PAYMENT` 里的钱包签名，经 facilitator 在链上真正转账。
- **后续访问**：靠服务端签发的通行证 cookie，本地验签、检查未过期且文章匹配即可。

你现在能读到这段文字，正是因为你已经付款、拿到了一张仍在有效期内的通行证。

## 测试网和主网

本地开发默认跑 Base Sepolia（`eip155:84532`）。这是测试网，可以用测试 USDC 验证流程，不会动真实资金。

生产部署使用 Base mainnet（`eip155:8453`）。主网付款会结算真实 USDC，需要真实收款地址和 Coinbase CDP API keys。本站在代码里把本地和生产分开：`wrangler dev` 会读取 `.dev.vars`，而部署后的 Worker 使用 `wrangler.jsonc` 和 Cloudflare secrets。

这也是为什么本地还能用测试网付款。它不是“没有切主网”，而是刻意保留的安全护栏。真正需要确认主网时，应部署 Worker，并用极小金额做一次真实 USDC 冒烟测试。

## 风险和边界

x402 让按次付费更容易，但它不是完整的商业系统。真正上线时，还需要考虑几类问题：

- **缓存**：付费内容必须 `no-store`，不能被 CDN 或浏览器缓存后免费重放。
- **密钥**：`ACCESS_TOKEN_SECRET` 和 CDP keys 必须放在 Worker secrets 里，不应提交到仓库。
- **价格**：公开显示的价格和 Worker 实收价格必须来自同一份配置。
- **失败处理**：verify 失败、settle 失败、钱包网络错误和余额不足都要能给出清晰反馈。
- **主网测试**：主网 smoke test 会花真实 USDC，应使用极小金额和受控收款地址。

这篇文章本身就是一个端到端演示：摘要公开，全文付费；浏览器看到 paywall，agent 可以用 `@x402/fetch` 自动付款；付款成功后，通行证让同一篇文章在有效期内免重付。
