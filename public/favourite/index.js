const MS_IN_A_SECOND = 1000
const MS_IN_A_MINUTE = MS_IN_A_SECOND * 60
const MS_IN_AN_HOUR = MS_IN_A_MINUTE * 60
const MS_IN_A_DAY = MS_IN_AN_HOUR * 24
const MS_IN_A_YEAR = MS_IN_A_DAY * 365

const meettingTime = Date.parse("2024-06-22T23:39:00.000Z")
const birthdayTime = +new Date("2024-11-20")
const userAgent = navigator.userAgent.toLowerCase()

function getDiffTime({ start, end }) {
  const diff = end - start
  let rest = diff % MS_IN_A_YEAR

  const years = Math.floor(diff / MS_IN_A_YEAR)
  const days = Math.floor(rest / MS_IN_A_DAY)
  rest %= MS_IN_A_DAY
  const hours = Math.floor(rest / MS_IN_AN_HOUR)
  rest %= MS_IN_AN_HOUR
  const minutes = Math.floor(rest / MS_IN_A_MINUTE)
  rest %= MS_IN_A_MINUTE
  const seconds = Math.floor(rest / MS_IN_A_SECOND)

  return { years, days, hours, minutes, seconds }
}

function updateTimerElements(elements, { years, days, hours, minutes, seconds }) {
  elements.forEach(e => {
    const parentId = e.parentNode.id
    switch (parentId) {
      case 'year':
        if (e.textContent !== years.toString()) e.textContent = years
        break
      case 'day':
        if (e.textContent !== days.toString()) e.textContent = days
        break
      case 'hour':
        if (e.textContent !== hours.toString()) e.textContent = hours
        break
      case 'minute':
        if (e.textContent !== minutes.toString()) e.textContent = minutes
        break
      case 'second':
        if (e.textContent !== seconds.toString()) e.textContent = seconds
        break
    }
  })
}

function handleTimeElement(element) {
  const timeElements = Array.from(element.querySelectorAll('.item-number'))

  return (start, end) => {
    const { years, days, hours, minutes, seconds } = getDiffTime({ start, end })
    updateTimerElements(timeElements, { years, days, hours, minutes, seconds })
  }
}


document.addEventListener('DOMContentLoaded', () => {

  if (userAgent.includes('micromessenger')) {
    document.body.innerHTML = `
    <div class="wechat text">
      <span>请使用浏览器打开该网页</span>
      <span class="decoration-line">https://www.fwqaq.us/public/favourite/index.html</span>
    </div>
    `
  }

  const meettingFunction = handleTimeElement(document.getElementById('meetting'))
  const birthdayFunction = handleTimeElement(document.getElementById('birthday'))

  setInterval(() => {
    meettingFunction(meettingTime, +new Date())
    birthdayFunction(+new Date(), birthdayTime)
  }, 1000)

  const hiddenButton = document.getElementById('hidden-button')
  const dialog = document.getElementById('x-dialog')
  hiddenButton.addEventListener('click', () => {
    dialog.showModal()
  })

  const no = document.getElementById('dialog-No')
  no.addEventListener('click', (e) => {
    e.preventDefault()
    alert('再给你一次机会')
  })

  const ok = document.getElementById('dialog-Ok')
  ok.addEventListener('click', () => {
    dialog.close()
    alert('这还差不多，哼')
  })
})
