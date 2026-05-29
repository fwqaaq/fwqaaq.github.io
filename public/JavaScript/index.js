///<reference lib="dom" />

// Regex to capture the full <main>…</main> element including its class attribute
const regex = /(<main[\s\S]*<\/main>)/

let isDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches

// check if the browser supports view transition
const isViewTransition = document.startViewTransition &&
  !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

/** @type {HTMLMetaElement}*/
const metaTheme = document.head.querySelector("meta[name='theme-color']")

/**
 * @param {boolean} isDarkTheme
 * @param {Element} e
 */
function toggleColor(isDarkTheme, e) {
  e.classList.toggle('fa-sun')
  e.classList.toggle('fa-moon')
  globalThis.localStorage.setItem('darkMode', isDarkTheme ? 'dark' : 'light')

  const colors = [
    ['--theme-color', isDarkTheme ? '#FFFFFF' : '#000000'],
    ['--color-label', isDarkTheme ? '#FFFFFF' : '#000000'],
    ['--h-color', isDarkTheme ? '#FFFFFF' : '#000000'],
    ['--color-tint', isDarkTheme ? '#0A84FF' : '#007AFF'],
    ['--color-a-link', isDarkTheme ? '#0A84FF' : '#007AFF'],
    ['--color-a-link-hover', isDarkTheme ? '#409CFF' : '#0051D5'],
    ['--bg-color', isDarkTheme ? '#000000' : '#F2F2F7'],
    ['--bg-primary', isDarkTheme ? '#1C1C1E' : '#FFFFFF'],
    ['--bg-secondary', isDarkTheme ? '#000000' : '#F2F2F7'],
    ['--bg-tertiary', isDarkTheme ? '#2C2C2E' : '#FFFFFF'],
    ['--header-bg', isDarkTheme ? 'rgba(28,28,30,0.72)' : 'rgba(255,255,255,0.72)'],
    ['--color-separator', isDarkTheme ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)'],
    ['--color-secondary-label', isDarkTheme ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)'],
    ['--color-tertiary-label', isDarkTheme ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)'],
  ]
  colors.forEach(([v, c]) => document.documentElement.style.setProperty(v, c))
  metaTheme.content = isDarkTheme ? '#000000' : '#F2F2F7'
}

document.addEventListener('DOMContentLoaded', () => {
  const localDarkMode = globalThis.localStorage.getItem('darkMode')
  isDark = localDarkMode === 'undefined' ? isDark : localDarkMode === 'dark'

  const model = document.querySelector('a.model')
  const darkIcon = model.querySelector('i')

  toggleColor(isDark, darkIcon)

  model.addEventListener('click', (e) => {
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

    document.startViewTransition(
      () => toggleColor(darkMode === 'dark', darkIcon),
    )
      ;[
        ['--click-x', `${x}px`],
        ['--click-y', `${y}px`],
        ['--end-radius', `${endRadius}px`],
      ].forEach(([v, c]) => document.documentElement.style.setProperty(v, c))
  })

  const header = document.querySelector('header')
  const nav = header.querySelector('nav')
  const switchIcon = document.getElementById('switch-icon')
  const isMobile = globalThis.matchMedia('(max-width: 480px)').matches
  if (!isMobile) switchIcon.hidden = true

  /**@param {HTMLElement | null} target*/
  const isRouterTag = (target) => {
    if (!target) return false
    return target.matches('a') && target.getAttribute('href').startsWith('/./')
  }

  document.body.addEventListener('click', (e) => {
    if (isRouterTag(e.target) || isRouterTag(e.target.parentElement)) {
      useRoute(e)
    }

    if (!isMobile) return
    if (e.target === switchIcon) {
      switchIcon.classList.toggle('fa-bars')
      switchIcon.classList.toggle('fa-xmark')
      nav.parentElement.classList.toggle('show')
      return
    }
    nav.parentElement.classList.remove('show')
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
      nav.parentElement.classList.remove('show')
      switchIcon.classList.remove('fa-xmark')
      switchIcon.classList.add('fa-bars')
    }
    lastScrollTop = current <= 0 ? 0 : current
  })

  self.addEventListener('popstate', renderPage)
})

/**
 * @param {number} amount
 */
// deno-lint-ignore no-unused-vars
function sponsor(amount) {
  globalThis.location.href = `https://stripe.fwqaaq.workers.dev/Personal-Website-Sponsor/checkout?mode=once`
}

function loadGiscus() {
  if (document.querySelector('.giscus')) return

  const script = document.createElement('script')
  const dataset = {
    repo: 'fwqaaq/fwqaaq.github.io',
    repoId: 'R_kgDOHCFK2A',
    category: 'Show and tell',
    categoryId: 'DIC_kwDOHCFK2M4CYOLh',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '1',
    inputPosition: 'bottom',
    theme: globalThis.localStorage.getItem('darkMode') ?? 'preferred_color_scheme',
    lang: 'zh-CN',
  }
  script.src = 'https://giscus.app/client.js'
  script.crossOrigin = 'anonymous'
  script.async = true
  for (const [key, value] of Object.entries(dataset)) {
    script.dataset[key] = value
  }

  const giscus = document.createElement('div')
  giscus.className = 'giscus'
  document.body.querySelector('main.blog-main').insertAdjacentElement('afterend', giscus)
  document.body.appendChild(script)
}

function unloadGiscus() {
  document.querySelector('div.giscus')?.remove()
  document.querySelector('script[src*="giscus"]')?.remove()
}

const renderPage = async (e) => {
  // hash change, do nothing
  if (e && e.type === 'popstate' && location.hash) return

  const path = location.pathname

  const res = await fetch(path)
  const html = await res.text()

  const [, mainHtml] = html.match(regex)
  const temp = document.createElement('div')
  temp.innerHTML = mainHtml
  document.body.querySelector('main').replaceWith(temp.firstElementChild)

  if (path.includes('posts')) {
    loadGiscus()
  } else {
    unloadGiscus()
  }
}

/**@param {MouseEvent} e*/
const useRoute = async (e) => {
  e.preventDefault()
  /**@type {HTMLAnchorElement} */
  const target = e.target.closest('a')
  history.pushState({}, '', target.href)
  document.body.classList.add('loading')
  await renderPage()
  document.body.classList.remove('loading')
}
