///<reference lib="dom" />

declare global {
  var googleTranslateElementInit: () => void
  var google: any
  var __BLOG_CONFIG__: any
}


// Regex to capture the full <main>…</main> element including its class attribute
const regex = /(<main[\s\S]*<\/main>)/

let isDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches

// check if the browser supports view transition
const isViewTransition = Boolean(document.startViewTransition) &&
  !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const metaTheme = document.head.querySelector<HTMLMetaElement>("meta[name='theme-color']")

const themeTokens = {
  light: [
    ['--color-accent', '#007A78'],
    ['--color-accent-hover', '#005F5D'],
    ['--color-accent-soft', 'rgba(0,122,120,0.12)'],
    ['--color-accent-softer', 'rgba(0,122,120,0.07)'],
    ['--color-accent-strong', 'rgba(0,122,120,0.2)'],
    ['--color-text-primary', '#111817'],
    ['--color-text-secondary', 'rgba(60,60,67,0.68)'],
    ['--color-text-tertiary', 'rgba(60,60,67,0.36)'],
    ['--color-surface-page', '#F3F7F6'],
    ['--color-surface', '#FFFFFF'],
    ['--color-surface-subtle', '#F9FCFB'],
    ['--color-surface-elevated', 'rgba(255,255,255,0.86)'],
    ['--color-surface-code', '#172224'],
    ['--color-surface-header', 'rgba(250,253,252,0.76)'],
    ['--color-surface-chip', 'rgba(0,122,120,0.1)'],
    ['--theme-color', '#111817'],
    ['--color-label', '#000000'],
    ['--color-tint', '#007A78'],
    ['--color-tint-hover', '#005F5D'],
    ['--color-tint-soft', 'rgba(0,122,120,0.12)'],
    ['--color-tint-softer', 'rgba(0,122,120,0.07)'],
    ['--color-tint-strong', 'rgba(0,122,120,0.2)'],
    ['--color-focus-ring', 'rgba(0,122,120,0.28)'],
    ['--color-a-link', '#007A78'],
    ['--color-a-link-hover', '#005F5D'],
    ['--bg-color', '#F3F7F6'],
    ['--bg-primary', '#FFFFFF'],
    ['--bg-secondary', '#F3F7F6'],
    ['--bg-tertiary', '#F9FCFB'],
    ['--bg-elevated', 'rgba(255,255,255,0.86)'],
    ['--code-bg', '#172224'],
    ['--header-bg', 'rgba(250,253,252,0.76)'],
    ['--color-separator', 'rgba(60,67,67,0.24)'],
    ['--color-secondary-label', 'rgba(60,60,67,0.6)'],
    ['--color-tertiary-label', 'rgba(60,60,67,0.3)'],
    ['--chip-bg', 'rgba(0,122,120,0.1)'],
    ['--color-note', '#007A78'],
    ['--color-tip', '#34C759'],
    ['--color-warning', '#FF9500'],
    ['--color-severe', '#FF6B35'],
    ['--color-caution', '#FF3B30'],
    ['--color-important', '#AF52DE'],
  ],
  dark: [
    ['--color-accent', '#64D2CA'],
    ['--color-accent-hover', '#9BECE6'],
    ['--color-accent-soft', 'rgba(100,210,202,0.16)'],
    ['--color-accent-softer', 'rgba(100,210,202,0.08)'],
    ['--color-accent-strong', 'rgba(100,210,202,0.24)'],
    ['--color-text-primary', '#F5FBFA'],
    ['--color-text-secondary', 'rgba(235,235,245,0.64)'],
    ['--color-text-tertiary', 'rgba(235,235,245,0.34)'],
    ['--color-surface-page', '#0B1213'],
    ['--color-surface', '#172224'],
    ['--color-surface-subtle', '#1D2B2D'],
    ['--color-surface-elevated', 'rgba(23,34,36,0.88)'],
    ['--color-surface-code', '#0F1A1C'],
    ['--color-surface-header', 'rgba(17,26,28,0.76)'],
    ['--color-surface-chip', 'rgba(100,210,202,0.14)'],
    ['--theme-color', '#F5FBFA'],
    ['--color-label', '#FFFFFF'],
    ['--color-tint', '#64D2CA'],
    ['--color-tint-hover', '#9BECE6'],
    ['--color-tint-soft', 'rgba(100,210,202,0.16)'],
    ['--color-tint-softer', 'rgba(100,210,202,0.08)'],
    ['--color-tint-strong', 'rgba(100,210,202,0.24)'],
    ['--color-focus-ring', 'rgba(100,210,202,0.32)'],
    ['--color-a-link', '#64D2CA'],
    ['--color-a-link-hover', '#9BECE6'],
    ['--bg-color', '#0B1213'],
    ['--bg-primary', '#172224'],
    ['--bg-secondary', '#0B1213'],
    ['--bg-tertiary', '#1D2B2D'],
    ['--bg-elevated', 'rgba(23,34,36,0.88)'],
    ['--code-bg', '#0F1A1C'],
    ['--header-bg', 'rgba(17,26,28,0.76)'],
    ['--color-separator', 'rgba(84,96,98,0.65)'],
    ['--color-secondary-label', 'rgba(235,235,245,0.6)'],
    ['--color-tertiary-label', 'rgba(235,235,245,0.3)'],
    ['--chip-bg', 'rgba(100,210,202,0.14)'],
    ['--color-note', '#64D2CA'],
    ['--color-tip', '#30D158'],
    ['--color-warning', '#FF9F0A'],
    ['--color-severe', '#FF6B35'],
    ['--color-caution', '#FF453A'],
    ['--color-important', '#BF5AF2'],
  ],
}

const blogConfig = globalThis.__BLOG_CONFIG__ ?? {}

const languageCodes = new Set([
  '',
  'en',
  'ja',
  'ko',
  'fr',
  'de',
  'es',
  'ru',
  'zh-TW',
])

let preferredLanguage = ''

globalThis.googleTranslateElementInit = () => {
  if (!globalThis.google?.translate?.TranslateElement) return

  new globalThis.google.translate.TranslateElement({
    pageLanguage: 'zh-CN',
    includedLanguages: 'en,ja,ko,fr,de,es,ru,zh-TW',
    autoDisplay: false,
    layout: globalThis.google.translate.TranslateElement.InlineLayout.SIMPLE,
  }, 'google_translate_element')

  globalThis.dispatchEvent(new Event('google-translate-ready'))
}

/**
 * @param {boolean} isDarkTheme
 * @param {Element} e
 */
function toggleColor(isDarkTheme: boolean, e: Element) {
  e.classList.toggle('fa-sun', !isDarkTheme)
  e.classList.toggle('fa-moon', isDarkTheme)
  globalThis.localStorage.setItem('darkMode', isDarkTheme ? 'dark' : 'light')
  themeTokens[isDarkTheme ? 'dark' : 'light'].forEach(([v, c]) =>
    document.documentElement.style.setProperty(v, c)
  )
  if (metaTheme) metaTheme.content = isDarkTheme ? '#0B1213' : '#F3F7F6'
}

function getGoogleCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('.goog-te-combo')
}

function setTranslateCookie(value: string) {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toUTCString()
  const cookie = `googtrans=${value}; expires=${expires}; path=/`
  document.cookie = cookie

  const parts = location.hostname.split('.')
  if (parts.length > 1) {
    document.cookie = `${cookie}; domain=.${parts.slice(-2).join('.')}`
  }
}

// Pre-set googtrans cookie BEFORE Google Translate's defer script runs.
// This block executes synchronously while the parser is blocked in <head>,
// so the cookie exists when googleTranslateElementInit() fires.
{
  const saved = globalThis.localStorage.getItem('preferredLanguage')
  if (saved !== null) {
    preferredLanguage = saved
    // Empty string = original language — use /zh-CN/zh-CN to prevent
    // Google from auto-detecting the browser language as target.
    setTranslateCookie(saved ? '/zh-CN/' + saved : '/zh-CN/zh-CN')
  }
}

function updateLanguageOptions(language: string) {
  document.querySelectorAll<HTMLElement>('.language-option').forEach((option) => {
    option.setAttribute(
      'aria-checked',
      option.dataset.lang === language ? 'true' : 'false',
    )
  })
}

function applyLanguage(language: string, shouldReload = false) {
  if (!languageCodes.has(language)) return

  preferredLanguage = language
  updateLanguageOptions(language)

  if (!language) {
    globalThis.localStorage.setItem('preferredLanguage', '')
    // Set cookie to /zh-CN/zh-CN (same source = target) to prevent
    // Google from auto-detecting the browser language as target.
    setTranslateCookie('/zh-CN/zh-CN')
    if (shouldReload) {
      location.reload()
      return
    }
    // SPA path: try combo reset to stop translation
    const combo = getGoogleCombo()
    if (combo && combo.value !== '') {
      combo.value = ''
      combo.dispatchEvent(new Event('change'))
    }
    return
  }

  globalThis.localStorage.setItem('preferredLanguage', language)
  setTranslateCookie(`/zh-CN/${language}`)

  if (shouldReload) {
    location.reload()
    return
  }

  // SPA path: retrigger translation on new content
  const combo = getGoogleCombo()
  if (combo && combo.value !== language) {
    combo.value = language
    combo.dispatchEvent(new Event('change'))
  }
}

function detectPreferredLanguage(): string {
  const saved = globalThis.localStorage.getItem('preferredLanguage')
  if (languageCodes.has(saved)) return saved

  const browserLanguage = (navigator.languages?.[0] || navigator.language || '')
    .toLowerCase()

  if (!browserLanguage || browserLanguage.startsWith('zh-cn')) return ''
  if (
    browserLanguage.startsWith('zh-tw') ||
    browserLanguage.startsWith('zh-hk') ||
    browserLanguage.startsWith('zh-mo')
  ) return 'zh-TW'

  const baseLanguage = browserLanguage.split('-')[0]
  return languageCodes.has(baseLanguage) ? baseLanguage : ''
}

function closeLanguageMenu() {
  const languageToggle = document.querySelector('.language-toggle')
  const languageMenu = document.getElementById('language-menu')
  if (!languageToggle || !languageMenu) return

  languageToggle.setAttribute('aria-expanded', 'false')
  languageMenu.hidden = true
}

function closestElement<T extends Element = Element>(target: EventTarget | null, selector: string): T | null {
  return target instanceof Element ? target.closest<T>(selector) : null
}

function initTranslationControls() {
  const languageToggle = document.querySelector('.language-toggle')
  const languageMenu = document.getElementById('language-menu')
  if (!languageToggle || !languageMenu) return

  languageToggle.addEventListener('click', (e) => {
    e.preventDefault()
    const expanded = languageToggle.getAttribute('aria-expanded') === 'true'
    languageToggle.setAttribute('aria-expanded', String(!expanded))
    languageMenu.hidden = expanded
  })

  languageMenu.addEventListener('click', (e) => {
    const option = closestElement<HTMLElement>(e.target, '.language-option')
    if (!option) return

    applyLanguage(option.dataset.lang, true)
    closeLanguageMenu()
  })

  document.addEventListener('click', (e) => {
    if (!closestElement(e.target, '.language-switcher')) closeLanguageMenu()
  })

  const initialLanguage = detectPreferredLanguage()
  updateLanguageOptions(initialLanguage)
  // Cookie was already set by the synchronous block before Google Translate inited —
  // the page is already in the correct language. Just track the preference.
  if (initialLanguage) {
    preferredLanguage = initialLanguage
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const localDarkMode = globalThis.localStorage.getItem('darkMode')
  isDark = localDarkMode === null ? isDark : localDarkMode === 'dark'

  const model = document.querySelector<HTMLAnchorElement>('a.model')
  const darkIcon = model?.querySelector<HTMLElement>('i')
  if (!model || !darkIcon) return

  toggleColor(isDark, darkIcon)
  initTranslationControls()

  model.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
    const darkMode = globalThis.localStorage.getItem('darkMode') === 'dark'
      ? 'light'
      : 'dark'

    if (!isViewTransition) {
      return toggleColor(darkMode === 'dark', darkIcon)
    }

    // 存储点击坐标
    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    document.startViewTransition?.(
      () => toggleColor(darkMode === 'dark', darkIcon),
    )
    ;[
      ['--click-x', `${x}px`],
      ['--click-y', `${y}px`],
      ['--end-radius', `${endRadius}px`],
    ].forEach(([v, c]) => document.documentElement.style.setProperty(v, c))
  })

  const header = document.querySelector<HTMLElement>('header')
  const nav = header?.querySelector<HTMLElement>('nav')
  const switchIcon = document.getElementById('switch-icon')
  if (!header || !nav || !switchIcon || !nav.parentElement) return
  const isMobile = globalThis.matchMedia('(max-width: 480px)').matches
  if (!isMobile) switchIcon.hidden = true

    const isRouterTag = (target: HTMLElement | null | undefined): boolean => {
    if (!target) return false
    return target.matches('a') &&
      (target.getAttribute('href') ?? '').startsWith('/./')
  }

  document.body.addEventListener('click', (e) => {
    const target = e.target instanceof HTMLElement ? e.target : null
    if (isRouterTag(target) || isRouterTag(target?.parentElement)) {
      useRoute(e)
    }

    if (!isMobile) return
    if (e.target === switchIcon) {
      switchIcon.classList.toggle('fa-bars')
      switchIcon.classList.toggle('fa-xmark')
      nav.parentElement?.classList.toggle('show')
      return
    }
    if (closestElement(e.target, '.language-switcher')) return
    nav.parentElement?.classList.remove('show')
    switchIcon.classList.remove('fa-xmark')
    switchIcon.classList.add('fa-bars')
  })

  let lastScrollTop = 0
  document.addEventListener('scroll', (_) => {
    const current = globalThis.scrollY || document.documentElement.scrollTop
    if (current <= lastScrollTop) {
      header.style.transform = 'translateY(0)'
    } else {
      header.style.transform = 'translateY(-100%)'
      if (!globalThis.matchMedia('(max-width: 480px)').matches) return
      nav.parentElement?.classList.remove('show')
      switchIcon.classList.remove('fa-xmark')
      switchIcon.classList.add('fa-bars')
    }
    lastScrollTop = current <= 0 ? 0 : current
  })

  self.addEventListener('popstate', renderPage)
})

function sponsor(amount: number) {
  const url = blogConfig.sponsor?.url
  if (!url) return
  globalThis.location.href = url
}

function loadGiscus() {
  if (document.querySelector('.giscus')) return
  const giscusConfig = blogConfig.giscus
  if (!giscusConfig?.enabled) return

  const script = document.createElement('script')
  const dataset: Record<string, unknown> = {
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '1',
    inputPosition: 'bottom',
    lang: 'zh-CN',
    ...giscusConfig,
    theme: globalThis.localStorage.getItem('darkMode') ??
      giscusConfig.theme ?? 'preferred_color_scheme',
  }
  delete dataset.enabled
  script.src = 'https://giscus.app/client.js'
  script.crossOrigin = 'anonymous'
  script.async = true
  for (const [key, value] of Object.entries(dataset)) {
    if (value === undefined || value === null || value === '') continue
    script.dataset[key] = String(value)
  }

  const giscus = document.createElement('div')
  giscus.className = 'giscus'
  document.body.querySelector<HTMLElement>('main.blog-main')?.insertAdjacentElement(
    'afterend',
    giscus,
  )
  document.body.appendChild(script)
}

function unloadGiscus() {
  document.querySelector('div.giscus')?.remove()
  document.querySelector('script[src*="giscus"]')?.remove()
}

const renderPage = async (e?: Event): Promise<void> => {
  // hash change, do nothing
  if (e && e.type === 'popstate' && location.hash) return

  const path = location.pathname

  const res = await fetch(path)
  const html = await res.text()

  const [, mainHtml] = html.match(regex) ?? []
  if (!mainHtml) return
  const temp = document.createElement('div')
  temp.innerHTML = mainHtml
  const main = document.body.querySelector('main')
  if (main && temp.firstElementChild) main.replaceWith(temp.firstElementChild)

  if (path.includes('posts')) {
    loadGiscus()
  } else {
    unloadGiscus()
  }

  if (preferredLanguage) {
    setTimeout(() => applyLanguage(preferredLanguage), 0)
  }
}

const useRoute = async (e: MouseEvent): Promise<void> => {
  e.preventDefault()
    const target = closestElement<HTMLAnchorElement>(e.target, 'a')
  if (!target) return
  history.pushState({}, '', target.href)
  document.body.classList.add('loading')
  await renderPage()
  document.body.classList.remove('loading')
}

export {}
