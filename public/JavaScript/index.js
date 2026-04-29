///<reference lib="dom" />

// Regex to match the content of the main tag
const regex =
  /\<head\>[\s\S]*\<\/head\>[\s\S]*?\<main[\s\S]*?\>([\s\S]*)\<\/main\>/

let isDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches

// check if the browser supports view transition
const isViewTransition = document.startViewTransition &&
  !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

/** @type {HTMLMetaElement}*/
const metaTheme = document.head.querySelector("meta[name='theme-color']")

/**
 * @param {boolean} isDarkTheme
 * @param {Element} e
 * @param {Array<[string, string]>} colors
 */
function toggleColor(isDarkTheme, e) {
  e.classList.toggle('fa-sun')
  e.classList.toggle('fa-moon')
  globalThis.localStorage.setItem('darkMode', isDarkTheme ? 'dark' : 'light')

  const colors = [
    ['--theme-color', isDarkTheme ? '#ffffff' : 'rgb(0, 0, 0)'],
    [
      '--color-a-link',
      isDarkTheme ? 'rgba(1, 202, 159, 0.8)' : 'rgba(0, 93, 73, 0.8)',
    ],
    ['--color-a-link-hover', isDarkTheme ? '#00d4a1' : '#014637'],
    ['--bg-color', isDarkTheme ? 'rgb(26, 26, 26)' : '#ffffff'],
    [
      '--background-image',
      `url("/public/background-${isDarkTheme ? 'dark' : 'light'}.jpg")`,
    ],
  ]
  colors.forEach(([v, c]) => document.documentElement.style.setProperty(v, c))
  metaTheme.content = isDarkTheme
    ? 'rgb(26, 26, 26)'
    : 'rgba(255, 255, 255, 0.8)'
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
  const isWidthMatchMedia = !globalThis.matchMedia('(max-width: 480px').matches
  if (!isWidthMatchMedia) switchIcon.hidden = true

  /**@param {HTMLElement | null} target*/
  const isRouterTag = (target) => {
    if (!target) return false
    return target.matches('a') && target.getAttribute('href').startsWith('/./')
  }

  document.body.addEventListener('click', (e) => {
    if (isRouterTag(e.target) || isRouterTag(e.target.parentElement)) {
      useRoute(e)
    }

    // Not matched, return
    if (isWidthMatchMedia) return
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
    const current = globalThis.scrollX || document.documentElement.scrollTop
    const headerHeight = '-' +
      getComputedStyle(document.documentElement).getPropertyValue(
        '--header-height',
      )
    if (current <= lastScrollTop) {
      header.style.top = '0'
    } else {
      header.style.top = headerHeight
      if (!globalThis.matchMedia('(max-width: 480px').matches) return
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
  globalThis.location.href = `https://personal-website-sponsorship-stripes.fwqaaq.com?amount=${amount}`
}

const renderPage = async (e) => {
  // hash change, do nothing
  if (e && e.type === 'popstate' && location.hash) return

  const path = location.pathname
  if (path.includes('posts')) {
    const script = document.createElement('script')
    const { src, crossOrigin, async, dataset } = {
      src: 'https://giscus.app/client.js',
      dataset: {
        repo: 'fwqaaq/fwqaaq.github.io',
        repoId: 'R_kgDOHCFK2A',
        category: 'Show and tell',
        categoryId: 'DIC_kwDOHCFK2M4CYOLh',
        mapping: 'pathname',
        strict: '0',
        reactionsEnabled: '1',
        emitMetadata: '1',
        inputPosition: 'bottom',
        theme: globalThis.localStorage.getItem('darkMode') ??
          'preferred_color_scheme',
        lang: 'zh-CN',
      },
      crossOrigin: 'anonymous',
      async: true,
    }
    Object.assign(script, {
      src,
      crossOrigin,
      async,
    })
    // dataset only-read
    for (const [key, value] of Object.entries(dataset)) {
      script.dataset[key] = value
    }

    const giscus = document.createElement('div')
    giscus.className = 'giscus'
    const main = document.body.querySelector('main.blog-main')
    main.insertAdjacentElement('afterend', giscus)

    document.body.appendChild(script)
  }

  if (!path.includes('posts')) document.querySelector('div.giscus')?.remove()

  const res = await fetch(path)
  const html = await res.text()

  const [, content] = html.match(regex)
  document.body.querySelector('main').innerHTML = content
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
