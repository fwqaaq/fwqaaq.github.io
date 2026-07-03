/** @jsxImportSource hono/jsx */
import { Icon, renderJsx } from './components.tsx'
import type { BuildConfig, SiteConfig } from '../types.ts'

export interface PageMeta {
  title?: string
  description?: string
  keywords?: string
  url?: string
}

const normalizeUrl = (value: unknown) => String(value ?? '').trim()

const withUrlProtocol = (value: unknown): string => {
  const url = normalizeUrl(value)
  if (!url) return ''
  return /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`
}

const getUrlHost = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function SiteConfigScript({ site }: { site: SiteConfig }) {
  const json = JSON.stringify({
    sponsor: site.sponsor,
    giscus: site.giscus,
  }).replaceAll('</', '<\\/')

  return <script
    dangerouslySetInnerHTML={{ __html: `globalThis.__BLOG_CONFIG__=${json}` }}
  />
}

function Head({ config, title, description, keywords, url }: { config: BuildConfig } & Required<PageMeta>) {
  const { author, version, site } = config
  const siteName = `${author} 的博客`

  return <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#F3F7F6" />
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={siteName} />
    <meta name="application-name" content={siteName} />
    <meta name="apple-mobile-web-app-title" content={siteName} />
    <title>{title}</title>
    <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href={`/public/css/base.${version}.css`} />
    <link rel="stylesheet" href={`/public/css/index.${version}.css`} />
    <link rel="stylesheet" href={`/public/css/markdown.${version}.css`} />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <SiteConfigScript site={site} />
    <script src={`/public/JavaScript/index.${version}.js`}></script>
    <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" defer></script>
  </head>
}

const LANGUAGES = [
  ['', '原文'],
  ['en', 'English'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['ru', 'Русский'],
  ['zh-TW', '繁體中文'],
] as const

function Header({ site }: { site: SiteConfig }) {
  const profile = site.profile ?? {}

  return <header class="blog-header">
    <i id="switch-icon" class="fa-solid fa-bars" />
    <a href={profile.homepage} target="_blank">
      <img src={profile.avatar} loading="lazy" alt={profile.name} srcset="" />
    </a>
    <div class="wrap-background">
      <nav class="header-nav">
        <a class="decoration-line" href="/">
          <i class="fa-solid fa-house-chimney fa-xs" /> <span class="disappear">首页</span>
        </a>
        <a class="decoration-line" href="/./about/index.html">
          <i class="fa-solid fa-address-card fa-xs" /> <span class="disappear">关于</span>
        </a>
        <a class="decoration-line" href="/./archive/index.html">
          <i class="fa-solid fa-box-archive fa-xs" /> <span class="disappear">归档</span>
        </a>
        <a class="decoration-line" href="/./tags/index.html">
          <i class="fa-solid fa-tag fa-xs" /> <span class="disappear">标签</span>
        </a>
        <a class="decoration-line" onclick="sponsor(199)">
          <i class="fa-solid fa-circle-dollar-to-slot fa-xs" /> <span class="disappear">赞助</span>
        </a>
        <div class="language-switcher notranslate">
          <button
            class="language-toggle"
            type="button"
            aria-label="切换语言"
            aria-expanded="false"
            aria-controls="language-menu"
          >
            <i class="fa-solid fa-globe fa-xs" aria-hidden="true" />
            <span class="disappear" translate="yes">语言</span>
          </button>
          <div class="language-menu" id="language-menu" role="menu" hidden>
            {LANGUAGES.map(([lang, label]) =>
              <button
                class="language-option"
                type="button"
                role="menuitemradio"
                data-lang={lang}
                aria-checked={lang === '' ? 'true' : 'false'}
              >
                {label}
              </button>)}
          </div>
        </div>
        <div id="google_translate_element" class="google-translate-element notranslate" aria-hidden="true" />
        <a class="decoration-line model" href="#" aria-label="切换深浅色主题">
          <i class="fa-solid fa-sun fa-xs" />
        </a>
      </nav>
    </div>
  </header>
}

function Ads({ ads = {} }: { ads?: SiteConfig['ads'] }) {
  if (!ads.enabled || !Array.isArray(ads.items) || ads.items.length === 0) return null

  const items = ads.items
    .map(({ title, url, description }) => {
      const href = withUrlProtocol(url)
      if (!href) return null

      const displayUrl = getUrlHost(href)
      return <a class="site-ad-card" href={href} target="_blank" rel="noopener noreferrer sponsored">
        <span class="site-ad-label">AD</span>
        <span class="site-ad-title">{title || displayUrl}</span>
        {description ? <p class="site-ad-desc">{description}</p> : null}
        <span class="site-ad-url">{displayUrl}</span>
      </a>
    })
    .filter(Boolean)
  if (items.length === 0) return null

  return <aside class="site-ads" aria-label={ads.title}>
    <div class="site-ads-inner">
      <h2 class="site-ads-title">{ads.title}</h2>
      <div class="site-ads-grid">{items}</div>
    </div>
  </aside>
}

function Footer({ site }: { site: SiteConfig }) {
  const profile = site.profile ?? {}
  const footer = site.footer ?? {}

  return <footer class="blog-footer">
    <div class="footer-container">
      <p class="text-center">
        <a class="decoration-line" href={footer.licenseUrl}>{footer.licenseText}</a>{' '}
        {footer.startYear} - {new Date().getFullYear()}{' '}
        <a class="decoration-line" href={profile.homepage}>{profile.name}</a>.
        Powered by <a class="decoration-line" href={footer.poweredByUrl}>{footer.poweredByText}</a>
      </p>
    </div>
    <div class="footer-icons-container">
      {(profile.socials ?? []).map(({ href, icon, label }) =>
        <a class="icon" href={normalizeUrl(href)} aria-label={label}>
          <Icon icon={icon} />
        </a>)}
    </div>
  </footer>
}

/** Renders a complete HTML document: head + header + page content + ads + footer. */
export function renderPage(config: BuildConfig, page: PageMeta, children: unknown): string {
  const meta = {
    title: page.title ?? config.site.title ?? `${config.author} 的博客`,
    description: page.description ?? config.site.description ?? `${config.author} 的个人博客`,
    keywords: page.keywords ?? config.site.keywords?.join(', ') ??
      `${config.author}, blog, ${config.author} blog`,
    url: page.url ?? config.website,
  }

  return '<!DOCTYPE html>\n' + renderJsx(
    <html lang="zh-CN">
      <Head config={config} {...meta} />
      <body>
        <Header site={config.site} />
        {children}
        <Ads ads={config.site.ads} />
        <Footer site={config.site} />
      </body>
    </html>,
  )
}
