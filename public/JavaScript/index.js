
const regex = /\<head\>[\s\S]*\<\/head\>[\s\S]*?\<main\>([\s\S]*)\<\/main\>/

document.addEventListener('DOMContentLoaded', () => {

  // if (location.pathname.includes('/home') || location.pathname === '/') {
  //   return
  // }

  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = '/public/css/markdown.css'
  document.head.appendChild(stylesheet)

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a') && e.target.getAttribute('href').startsWith('/./')) useRoute(e)
  })

  self.addEventListener('popstate', renderPage)
})

const renderPage = async (e) => {
  // hash change, do nothing
  if (e && e.type === "popstate" && location.hash) return

  const path = location.pathname
  if (path.includes("posts")) {
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
        theme: 'preferred_color_scheme',
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

    document.body.appendChild(script)
  }

  if (!path.includes('posts')) {
    // document.querySelector('script[data-mapping]')?.remove()
    document.querySelector('div.giscus')?.remove()
  }

  const res = await fetch(path)
  const html = await res.text()

  const [, content] = html.match(regex)
  document.body.children[1].innerHTML = content
}

/**
 * 
 * @param {MouseEvent} e 
*/
const useRoute = (e) => {
  e.preventDefault()
  history.pushState({}, '', e.target.href)
  document.body.classList.add('loading')
  renderPage()
  setTimeout(() => document.body.classList.remove('loading'), 200)
}
