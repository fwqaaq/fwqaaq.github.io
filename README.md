<div align="center">
  <h1>Blog 📖</h1>
</div>

一个用 Deno 编写的静态博客生成器，并通过 Cloudflare Workers 接入 x402 支付协议，让 AI agent、自动化程序和真人都能按次付费访问内容。

在线站点：<https://www.fwqaaq.com>

## 简介

项目由两部分组成：

- **静态站点生成器**：Markdown（带 YAML frontmatter）经 Deno 构建为 `dist/`，可托管在任意静态平台。
- **Cloudflare Worker**：托管 `dist/` 静态资源，并在边缘拦截付费路由，用 x402 协议完成基于 USDC 的按次结算。

它提供四种能力：普通静态博客、面向 agent 的付费 JSON API、面向 AI 爬虫的付费门，以及面向真人的付费文章。

## 特性

- **静态博客**。响应式页面，支持标签、归档、RSS。
- **agent 付费 API**（`/api/content/:slug`）。把免费文章以结构化 JSON 提供给 agent，按次付费调用。
- **爬虫付费门**（`/posts/*`）。已知 AI 爬虫按 User-Agent 识别后付费读全文，真人浏览免费。
- **人类付费文章**（`/premium/:slug`）。真人在浏览器里连钱包付款读全文，付款后签发通行证，有效期内免重付。

## 快速开始

前置条件：

- [Deno](https://deno.com/)（构建静态站点）。
- Node.js 与 npm（运行 Cloudflare Wrangler，仅在需要 Worker 时使用）。
- Cloudflare 账号（可选，部署 Worker 时使用）。

启动本地开发站点：

```bash
deno task dev
```

其他常用任务：

```bash
deno task build     # 构建到 dist/
deno task preview   # 预览构建产物
```

### 为什么还有 package.json

这个仓库保留两份清单文件，是因为它们服务不同工具链：

- `deno.jsonc` 管 Deno 任务、静态站点构建和测试脚本的 import map。
- `package.json` 管 Cloudflare Worker 的 npm 依赖，以及 Wrangler 打包所需的 `node_modules`。

Worker 源码使用 `@x402/hono`、`@x402/paywall`、`hono` 等 bare imports。Wrangler 打包 Worker 时会从 npm `node_modules` 解析它们，不会读取 `deno.jsonc` 的 import map。因此 `package.json` 不是重复配置，而是 Worker/Wrangler 的 manifest。

## 写文章

用脚本生成一篇新文章：

```bash
deno task new-post --title "标题" --categories "Tech" --tags "Deno,x402" --summary "一句话摘要"
```

生成的文件位于 `src/posts/`，frontmatter 字段如下：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布时间，`YYYY-MM-DD HH:mm:ss` |
| `categories` | 是 | 分类 |
| `tags` | 否 | 标签列表 |
| `summary` | 是 | 摘要，用于列表页与付费墙预览 |
| `updateAt` | 是 | 更新时间，构建时按 Git 记录自动维护 |
| `paid` | 否 | 设为 `true` 则成为付费文章 |
| `price` | 否 | 付费文章的单篇价格，例如 `$1`；仅在 `paid: true` 时生效 |

**付费文章**：在 frontmatter 加 `paid: true`。构建时，公开页面只输出摘要与解锁入口，全文改由 Worker 在付款后返回，不会落进任何免费文件。

### 付费文章配置

免费文章不需要额外配置。只要不写 `paid`，或显式写 `paid: false`，文章就会按普通静态页面构建，并进入 `/api/content/:slug` 的付费 JSON API。

```yaml
---
title: 免费文章
summary: 这篇文章公开可读。
paid: false
---
```

付费文章需要写 `paid: true`。构建时，公开页面只保留 `summary` 和解锁入口；完整 HTML 会写进 Worker 的 `premium` 数据表，并只通过 `/premium/:slug` 在付款后返回。

```yaml
---
title: 付费文章
summary: 摘要免费可见，全文需解锁。
paid: true
---
```

如需单篇定价，继续添加 `price`。这个价格会同时用于公开 teaser 的显示和 Worker 的实际收费。

```yaml
---
title: 深度文章
summary: 这篇文章单独定价。
paid: true
price: "$1"
---
```

未设置 `price` 的付费文章使用 Worker 环境变量 `PREMIUM_PRICE`。为了避免显示价和实收价不一致，未设置 `price` 时，公开 teaser 不写死具体金额。

付费文章不会进入 `/api/content/:slug` 的免费文章 map，也不会把全文落到公开静态文件。这样可以避免 agent API 或静态回源绕过 `/premium/:slug` 的付款门。

## 本地运行 Worker（x402）

1. 安装 Worker 依赖：

   ```bash
   npm install
   ```

2. 新建 `.dev.vars`（已在 `.gitignore` 中），放入本地密钥与测试网覆盖：

   ```txt
   ACCESS_TOKEN_SECRET=你的随机长字符串
   NETWORK=eip155:84532
   FACILITATOR_URL=https://x402.org/facilitator
   ```

3. 构建站点并启动 Worker：

   ```bash
   deno task build
   deno task worker:dev
   ```

三个端到端测试脚本用于验证付款链路（付款腿需一个持有 Base Sepolia 测试网 USDC 的钱包）。默认网络是 `eip155:84532`，需要覆盖时可设置 `X402_NETWORK`。

```bash
# agent 付费 API：未付款 402，付款后 200
PRIVATE_KEY=<测试钱包私钥> deno run -A scripts/pay-test.ts

# 爬虫付费门：真人 200、爬虫未付款 402、爬虫付款 200
PRIVATE_KEY=<测试钱包私钥> deno run -A scripts/crawl-test.ts

# 人类付费文章：付款页、摘要页、付款、通行证免重付
PRIVATE_KEY=<测试钱包私钥> deno run -A scripts/premium-test.ts
```

## 配置

`wrangler.jsonc` 的 `vars` 为非机密配置：

| 变量 | 含义 | 示例 |
| --- | --- | --- |
| `NETWORK` | CAIP-2 结算网络；本地测试网用 `eip155:84532`，生产主网用 `eip155:8453` | `eip155:84532` |
| `FACILITATOR_URL` | 测试网 HTTP facilitator 地址；主网分支会改用 Coinbase CDP facilitator | `https://x402.org/facilitator` |
| `PRICE` | agent API 单次价格 | `$0.001` |
| `CRAWL_PRICE` | 爬虫单页价格 | `$0.001` |
| `PREMIUM_PRICE` | 人类付费文章价格 | `$0.01` |
| `PASS_TTL_SECONDS` | 通行证有效期（秒） | `2592000`（30 天） |
| `PAY_TO_ADDRESS` | 收款地址 | `0x...` |

机密项不写进 `wrangler.jsonc`：

- `ACCESS_TOKEN_SECRET`：通行证的 HMAC 签名密钥。本地放 `.dev.vars`，生产用 `npx wrangler secret put ACCESS_TOKEN_SECRET`。
- `CDP_API_KEY_ID`、`CDP_API_KEY_SECRET`：生产主网用 Coinbase CDP facilitator 验证与结算真实 USDC，本地测试网不需要。

站点公开信息配置在 `site.config.json`：

- `author`、`website`、`title`、`description`、`keywords`：站点基础元信息。
- `profile`：头像、主页链接、about 页签名、标签、技术栈、项目和社交链接。
- `footer`：版权年份、协议链接和 Powered by 文案。
- `sponsor.url`：导航栏赞助按钮和文章赞助按钮跳转地址；留空则文章页不插入赞助按钮。
- `giscus`：评论区配置；`enabled: false` 可关闭评论。

`.env` 只保留本地运行相关的小型覆盖项：

```txt
WEBSITE=https://www.example.com/
AUTHOR=your-name
PORT=3000
```

`WEBSITE` 和 `AUTHOR` 会覆盖 `site.config.json` 的同名字段，方便本地和部署环境用不同域名。构建器不再生成 `dist/CNAME`；如果你仍使用 GitHub Pages 自定义域名，请在部署平台或仓库设置里维护 CNAME。

## 测试网 vs 主网

本地运行 `npx wrangler dev` 时，Wrangler 会读取 `.dev.vars`。因此本地默认覆盖为 `NETWORK=eip155:84532`，也就是 Base Sepolia 测试网。你在本地依旧可以用测试网 USDC 付款，这是设计如此，用来避免开发时误花真实资金。

部署到 Cloudflare Workers 时，`.dev.vars` 不会上传。生产 Worker 使用 `wrangler.jsonc` 里的 vars，所以当前默认是 `NETWORK=eip155:8453`，也就是 Base mainnet。

主网付款会结算真实 USDC。部署前需要确认这些生产配置：

- `PAY_TO_ADDRESS` 是你控制的 Base mainnet 收款地址。
- `CDP_API_KEY_ID` 和 `CDP_API_KEY_SECRET` 已用 `npx wrangler secret put` 写入 Worker secrets。
- `ACCESS_TOKEN_SECRET` 已用 `npx wrangler secret put` 写入 Worker secrets。
- `PRICE`、`CRAWL_PRICE`、`PREMIUM_PRICE` 或文章 frontmatter `price` 已设置为真实想收取的价格。

本地看到 `eip155:84532` 不代表生产没有切主网。判断生产网络应以部署后的 Worker 响应为准：解码 `PAYMENT-REQUIRED` 响应头，确认 `accepts[0].network` 是否为 `eip155:8453`。

## 部署

构建产物与 Worker 内容模块由同一条命令生成：

```bash
deno task build   # 生成 dist/ 与 worker/content.generated.js
```

部署到 Cloudflare Workers：

```bash
deno task worker:deploy
```

只想验证 Worker 能否被 Wrangler 打包时，可以运行：

```bash
deno task worker:dry-run
```

也可以走 GitHub Actions 的 `deploy-worker` 任务：在仓库配置 `CLOUDFLARE_API_TOKEN` secret 后，推送即触发；未配置时该任务自动跳过，不影响其他流程。

本地开发默认通过公开 `https://x402.org/facilitator` 在 Base Sepolia（`eip155:84532`）测试，不需要 CDP keys，也不会动真实资金。生产配置使用 Base mainnet（`eip155:8453`）和 Coinbase CDP facilitator，需要设置 `CDP_API_KEY_ID`、`CDP_API_KEY_SECRET`、真实收款地址，并把域名 DNS 迁到 Cloudflare。

## x402 端点一览

| 端点 | 受众 | 价格变量 | 返回 |
| --- | --- | --- | --- |
| `/api/content/:slug` | agent | `PRICE` | 免费文章的结构化 JSON |
| `/posts/*` | AI 爬虫（按 UA 识别） | `CRAWL_PRICE` | 文章 HTML（真人免费） |
| `/premium/:slug` | 人类浏览器 / agent | 文章 `price` 或 `PREMIUM_PRICE` | 付费文章全文 HTML |

## 项目结构

`main.js` 位于根目录，是构建入口（无需改动，配置请改 `.env`）。

```bash
.
├── main.js              # 构建入口
├── site.config.json     # 站点公开 profile、社交链接、评论与赞助配置
├── wrangler.jsonc       # Cloudflare Worker 配置
├── worker               # Worker 源码（Cloudflare 运行时）
│   ├── index.ts         # 路由与 x402 付款门
│   ├── access.ts        # 通行证签发与校验
│   └── crawlers.ts      # AI 爬虫 UA 列表
├── scripts              # 建帖与端到端测试脚本
├── src
│   ├── about            # 关于页
│   ├── picture          # 图片
│   ├── plugins          # 构建插件
│   │   ├── core.js
│   │   ├── posts.js
│   │   ├── api-content.js
│   │   ├── asserts.js
│   │   ├── feed.js
│   │   └── pages.js
│   ├── posts            # 博客文章
│   └── util             # 模板与工具
│       ├── template.js
│       ├── utils.js
│       ├── type.js
│       └── remark       # remark 插件
└── dist                 # 构建产物
```
