

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a') && e.target.href.includes('/./')) {
      useRoute(e)
    }
  })

  self.addEventListener('popstate', renderPage)

  renderPage()
})

const renderPage = async () => {
  const path = location.pathname
  if (path === '/') return
  const res = await fetch(path)
  const html = await res.text()

  const regex = /([\s\S]*\<\/head\>)[\s\S]*?([\s\S]*)/
  const [, , body] = html.match(regex)

  document.body.innerHTML = `
      <header>
        <a href="https://github.com/fwqaaq" target="_blank">
            <img src="https://avatars.githubusercontent.com/u/82551626?v=4" loading="lazy" alt="me" srcset="">
        </a>
        <nav class="header-nav">
            <a href="/">Home</a>
            <a class="router" href="">About</a>
            <a class="router" href="/./archive/index.html">Archive</a>
            <a class="router" href="/./tags/index.html">Tag</a>
        </nav>
    </header>
    <main>
        ${body}
    </main>
    <footer>© 2020 ~ 2023 ❤️ fwqaaq</footer>`
}

/**
 * 
 * @param {MouseEvent} e 
 */
const useRoute = (e) => {
  e.preventDefault()
  history.pushState({}, '', e.target.href)
  renderPage()
}
