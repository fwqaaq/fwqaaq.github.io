
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

  const res = await fetch(path)
  const html = await res.text()
  console.log(html)

  const [, body] = html.match(regex)
  const [, main] = document.body.children
  main.innerHTML = body
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
