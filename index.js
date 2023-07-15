
document.body.addEventListener('click', (e) => {
  if (e.target.matches('a') && e.target.classList.contains('router')) {
    useRoute(e)
  }
})

/**
 * 
 * @param {MouseEvent} e 
 */
const useRoute = (e) => {
  e.preventDefault()
  history.pushState({}, '', e.target.href)
  renderPage()
}

const renderPage = async () => {
  const path = location.pathname
  if (path === '/') return
  const res = await fetch(path)
  const html = await res.text()
  document.body.getElementsByTagName('main')[0].innerHTML = html
}

self.addEventListener('popstate', renderPage)

renderPage()
