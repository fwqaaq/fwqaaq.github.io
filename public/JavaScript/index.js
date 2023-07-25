
const regex = /([\s\S]*\<\/head\>)[\s\S]*?([\s\S]*)/

document.addEventListener('DOMContentLoaded', () => {

  if (location.pathname.includes('/home') || location.pathname === '/') {
    return
  }

  document.body.insertAdjacentHTML("afterbegin", `<header>
        <a href="https://github.com/fwqaaq" target="_blank">
            <img src="https://avatars.githubusercontent.com/u/82551626?v=4" loading="lazy" alt="me" srcset="">
        </a>
        <nav class="header-nav">
            <a href="/">Home</a>
            <a class="router" href="">About</a>
            <a class="router" href="/./archive/index.html">Archive</a>
            <a class="router" href="/./tags/index.html">Tag</a>
        </nav>
    </header>`)
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a') && e.target.href.includes('/./')) {
      useRoute(e)
    }
  })

  self.addEventListener('popstate', renderPage)

  renderPage()
})

const renderPage = (e) => {
  // hash change, do nothing
  if (e && e.type === "popstate" && location.hash) return

  document.body.classList.add('loading')

  // const path = location.pathname
  // const res = await fetch(path)
  // const html = await res.text()

  // const [, , body] = html.match(regex)

  const [, ...sections] = document.body.children
  const fragment = document.createDocumentFragment()
  const main = document.createElement('main')
  const footer = document.createElement('footer')
  footer.innerHTML = `© 2020 ~ 2023 ❤️ fwqaaq`
  main.append(...sections)
  fragment.append(main, footer)
  document.body.appendChild(fragment)

  setTimeout(() => { document.body.classList.remove('loading') }, 300)
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
