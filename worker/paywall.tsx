/** @jsxImportSource hono/jsx */
/**
 * Lightweight browser paywall (<30KB vs the official 2.3MB bundle). Vanilla JS
 * talking to injected wallets (window.ethereum: MetaMask/Rabby/OKX...) only —
 * no WalletConnect. Flow: sign EIP-3009 → retry with PAYMENT-SIGNATURE
 * (credentials included) → on 200 location.reload(), the server then serves
 * the article via pass cookie / KV purchase record. Also hosts the
 * "restore access" flow (personal_sign challenge, free, off-chain).
 */

export interface PaywallRequirements {
  scheme: 'exact'
  network: string
  amount: string
  asset: string
  payTo: string
  maxTimeoutSeconds: number
  extra: { name: string; version: string }
}

export interface PaywallData {
  x402Version: 2
  slug: string
  title: string
  priceLabel: string
  resource: { url: string; description: string; mimeType: string }
  accepts: PaywallRequirements[]
}

const renderJsx = (node: unknown): string => String(node)

const paywallCss = `
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
         display: flex; min-height: 100vh; margin: 0; align-items: center;
         justify-content: center; background: #f5f5f7; color: #1d1d1f; }
  @media (prefers-color-scheme: dark) { body { background: #1c1c1e; color: #f5f5f7; } }
  .card { max-width: 420px; width: calc(100% - 48px); padding: 32px;
          border-radius: 16px; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  @media (prefers-color-scheme: dark) { .card { background: #2c2c2e; } }
  h1 { font-size: 20px; margin: 0 0 8px; }
  p  { font-size: 14px; line-height: 1.6; opacity: .8; margin: 8px 0; }
  .price { font-size: 28px; font-weight: 700; margin: 16px 0; }
  button { width: 100%; padding: 12px; margin-top: 8px; border: 0; border-radius: 10px;
           font-size: 15px; cursor: pointer; }
  #pay { background: #0071e3; color: #fff; }
  #restore { background: transparent; color: #0071e3; }
  #status { font-size: 13px; min-height: 20px; margin-top: 12px; white-space: pre-wrap; }
  .err { color: #d70015; }
`

// Inline client script — plain browser JS, kept as a string on purpose (JSX
// can only wrap the <script> tag, not its code).
const paywallScript = (json: string) => `
const DATA = ${json};
const REQ = DATA.accepts[0];
const CHAIN_ID = parseInt(REQ.network.split(':')[1], 10);
const statusEl = document.getElementById('status');
const say = (msg, err) => { statusEl.textContent = msg; statusEl.className = err ? 'err' : ''; };

function eth() {
  if (!window.ethereum) throw new Error('未检测到浏览器钱包。请安装 MetaMask、Rabby 或 OKX 钱包插件。');
  return window.ethereum;
}

// Chain params for wallet_addEthereumChain (EIP-3085), for wallets that
// don't have the target network yet.
const CHAINS = {
  '0x14a34': {
    chainId: '0x14a34',
    chainName: 'Base Sepolia',
    rpcUrls: ['https://sepolia.base.org'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.basescan.org'],
  },
  '0x2105': {
    chainId: '0x2105',
    chainName: 'Base',
    rpcUrls: ['https://mainnet.base.org'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://basescan.org'],
  },
};

async function switchChain(hexChain) {
  try {
    await eth().request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChain }] });
  } catch (e) {
    const unknownChain = e && (e.code === 4902 ||
      /unrecognized chain|wallet_addEthereumChain/i.test(e.message || ''));
    if (!unknownChain || !CHAINS[hexChain]) throw e;
    say('正在向钱包添加 ' + CHAINS[hexChain].chainName + ' 网络，请在钱包中确认…');
    await eth().request({ method: 'wallet_addEthereumChain', params: [CHAINS[hexChain]] });
    // MetaMask switches after adding; other wallets may not — retry is a
    // no-op when already on the target chain.
    const now = await eth().request({ method: 'eth_chainId' });
    if (now !== hexChain) {
      await eth().request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hexChain }] });
    }
  }
}

async function connect() {
  const [account] = await eth().request({ method: 'eth_requestAccounts' });
  const hexChain = '0x' + CHAIN_ID.toString(16);
  const current = await eth().request({ method: 'eth_chainId' });
  if (current !== hexChain) await switchChain(hexChain);
  return account;
}

function randomNonce() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return '0x' + Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

document.getElementById('pay').onclick = async () => {
  try {
    say('连接钱包中…');
    const from = await connect();

    say('请在钱包中确认签名（USDC 转账授权，不消耗 gas）…');
    const authorization = {
      from,
      to: REQ.payTo,
      value: REQ.amount,
      validAfter: '0',
      validBefore: String(Math.floor(Date.now() / 1000) + REQ.maxTimeoutSeconds),
      nonce: randomNonce(),
    };
    const typedData = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        TransferWithAuthorization: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'validAfter', type: 'uint256' },
          { name: 'validBefore', type: 'uint256' },
          { name: 'nonce', type: 'bytes32' },
        ],
      },
      domain: {
        name: REQ.extra.name,
        version: REQ.extra.version,
        chainId: CHAIN_ID,
        verifyingContract: REQ.asset,
      },
      primaryType: 'TransferWithAuthorization',
      message: authorization,
    };
    const signature = await eth().request({
      method: 'eth_signTypedData_v4',
      params: [from, JSON.stringify(typedData)],
    });

    say('提交付款，等待链上结算…');
    const paymentPayload = {
      x402Version: DATA.x402Version,
      payload: { authorization, signature },
      resource: DATA.resource,
      accepted: REQ,
    };
    const res = await fetch(location.href, {
      headers: { 'PAYMENT-SIGNATURE': btoa(JSON.stringify(paymentPayload)) },
      credentials: 'include',
    });
    if (res.ok) { say('付款成功，正在打开全文…'); location.reload(); }
    else {
      const body = await res.text();
      say('付款未完成（' + res.status + '）：' + body.slice(0, 300), true);
    }
  } catch (e) { say(e && e.message ? e.message : String(e), true); }
};

document.getElementById('restore').onclick = async () => {
  try {
    say('连接钱包中…');
    const address = await connect();

    const cres = await fetch(location.pathname + '/challenge?address=' + address, { credentials: 'include' });
    if (!cres.ok) throw new Error('获取挑战失败：' + cres.status);
    const { challenge } = await cres.json();

    say('请在钱包中签名以证明地址所有权（免费，不上链）…');
    const signature = await eth().request({ method: 'personal_sign', params: [challenge, address] });

    const rres = await fetch(location.pathname + '/restore', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ address, challenge, signature }),
    });
    if (rres.ok) { say('已恢复访问，正在打开全文…'); location.reload(); }
    else if (rres.status === 403) say('该钱包地址没有本文的购买记录。', true);
    else say('恢复失败（' + rres.status + '）：' + (await rres.text()).slice(0, 200), true);
  } catch (e) { say(e && e.message ? e.message : String(e), true); }
};
`

export function paywallHtml(data: PaywallData): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return '<!DOCTYPE html>\n' + renderJsx(
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>解锁付费文章 · {data.title}</title>
        <style dangerouslySetInnerHTML={{ __html: paywallCss }} />
      </head>
      <body>
        <div class="card">
          <h1>🔒 {data.title}</h1>
          <p>这是一篇付费文章。使用浏览器插件钱包（MetaMask、Rabby、OKX 等）以 USDC 支付即可阅读全文。付款记录永久有效。</p>
          <div class="price">
            {data.priceLabel} <span style="font-size:14px;font-weight:400">USDC</span>
          </div>
          <button id="pay">连接钱包并付款</button>
          <button id="restore">已购买过？用钱包恢复访问</button>
          <div id="status"></div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: paywallScript(json) }} />
      </body>
    </html>,
  )
}

export function recoveryNoteHtml(link: string): string {
  return renderJsx(
    <div
      class="paywall-recovery"
      style="margin:1rem 0;padding:1rem;border:1px solid currentColor"
    >
      <p>如果浏览器没有保存 cookie，请保存下面的恢复链接，之后可用它恢复本文访问，不需要再次付款。</p>
      <p><a href={link}>恢复访问链接</a></p>
    </div>,
  )
}
