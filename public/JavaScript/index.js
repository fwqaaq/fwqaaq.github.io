///<reference lib="dom" />
const regex = /\<head\>[\s\S]*\<\/head\>[\s\S]*?\<main[\s\S]*?\>([\s\S]*)\<\/main\>/

let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

/**
 * @type {HTMLMetaElement}
 */
const metaTheme = document.head.querySelector("meta[name='theme-color']")

/**
 * @param {boolean} darkTheme 
 * @param {Element} e 
 */
function toggleColor(isDarkTheme, e) {
  e.classList.toggle("fa-sun")
  e.classList.toggle("fa-moon")
  window.localStorage.setItem("darkMode", isDarkTheme ? "dark" : "light")
  const headerBg = document.documentElement.style.getPropertyValue("--header-bg")
  if (isDarkTheme) {
    document.documentElement.style.setProperty("--theme-color", "rgb(240, 238, 233)")
    document.documentElement.style.setProperty("--header-bg", "rgba(46, 44, 79, 0.8)")
    document.documentElement.style.setProperty("--color-a-link", "rgba(1, 202, 159, 0.8)")
    document.documentElement.style.setProperty("--color-a-link-hover", "#00d4a1")
    metaTheme.content = "rgb(46, 44, 79)"
    return
  }
  if (headerBg === "rgb(200, 200, 200)") return
  document.documentElement.style.setProperty("--theme-color", "rgb(0, 0, 0)")
  document.documentElement.style.setProperty("--header-bg", "rgba(200,200,200, 0.8)")
  document.documentElement.style.setProperty("--color-a-link", " rgba(0, 93, 73, 0.8)")
  document.documentElement.style.setProperty("--color-a-link-hover", "#005845")
  metaTheme.content = "rgb(200,200,200)"
}

document.addEventListener("DOMContentLoaded", () => {
  // Set toy-nav height
  const toyNavs = document.querySelectorAll("nav.toy-nav a")
  const toyNavHeight = toyNavs[0].clientHeight * toyNavs.length
  document.documentElement.style.setProperty("--toy-nav-height", toyNavHeight + "px")


  const localDarkMode = window.localStorage.getItem("darkMode")
  isDark = localDarkMode === "undefined" ? isDark : localDarkMode === "dark"

  const model = document.querySelector("a.model")
  const darkIcon = model.querySelector("i")

  toggleColor(isDark, darkIcon)

  model.addEventListener("click", (e) => {
    e.preventDefault()
    const darkMode = window.localStorage.getItem("darkMode") === "dark" ? "light" : "dark"
    toggleColor(darkMode === "dark", darkIcon)
  })

  const stylesheet = document.createElement("link")
  stylesheet.rel = "stylesheet"
  stylesheet.href = "/public/css/markdown.css"
  document.head.appendChild(stylesheet)

  const header = document.querySelector("header")
  const nav = header.querySelector("nav")

  // nav toggle
  document.addEventListener("click", (e) => {
    if (!window.matchMedia("(max-width: 480px").matches) return
    if (e.target === header) {
      nav.classList.toggle("show")
      return
    }
    nav.classList.remove("show")
  })


  document.body.addEventListener("click", (e) => {
    if (
      e.target.matches("a") && e.target.getAttribute("href").startsWith("/./")
    ) { useRoute(e) }
  })

  let lastScrollTop = 0
  document.addEventListener("scroll", (_) => {
    const current = window.scrollX || document.documentElement.scrollTop
    const headerHeight = '-' + getComputedStyle(document.documentElement).getPropertyValue("--header-height")
    if (current <= lastScrollTop) {
      header.style.top = "0"
    } else {
      header.style.top = headerHeight
      if (!window.matchMedia("(max-width: 480px").matches) return
      nav.classList.remove("show")
    }
    lastScrollTop = current <= 0 ? 0 : current
  })

  self.addEventListener("popstate", renderPage)
})

const renderPage = async (e) => {
  // hash change, do nothing
  if (e && e.type === "popstate" && location.hash) return

  const path = location.pathname
  if (path.includes("posts")) {
    const script = document.createElement("script")
    const { src, crossOrigin, async, dataset } = {
      src: "https://giscus.app/client.js",
      dataset: {
        repo: "fwqaaq/fwqaaq.github.io",
        repoId: "R_kgDOHCFK2A",
        category: "Show and tell",
        categoryId: "DIC_kwDOHCFK2M4CYOLh",
        mapping: "pathname",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "1",
        inputPosition: "bottom",
        theme: "preferred_color_scheme",
        lang: "zh-CN",
      },
      crossOrigin: "anonymous",
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

    document.body.appendChild(script)
  }

  if (!path.includes("posts")) document.querySelector("div.giscus")?.remove()

  const res = await fetch(path)
  const html = await res.text()

  const [, content] = html.match(regex)
  document.body.querySelector("main").innerHTML = content
}

/**
 * @param {MouseEvent} e
 */
const useRoute = async (e) => {
  e.preventDefault()
  history.pushState({}, "", e.target.href)
  document.body.classList.add("loading")
  await renderPage()
  document.body.classList.remove("loading")
}