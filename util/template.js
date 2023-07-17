const handleTemplate = (strings, ...keys) => {
  return (...values) => {
    const dict = values[values.length - 1] || {}
    const res = [strings[0]]
    keys.forEach((k, i) => {
      const v = Number.isInteger(k) ? values[k] : dict[k]
      res.push(v, strings[i + 1])
    })
    return res.join("")
  }
}

export const templateBox = handleTemplate`        
        <section class="box">
            <h3><a class="router" href="${"place"}">${"title"}</a></h3>
            <p>${"summary"}<span class="time">···········${"time"}</span></p>
            <div>
                ${"tags"}
            </div>
        </section>`

export const templateProcess = handleTemplate`
        <section class="pages box">
            <a class="router" href="${"before"}">ᐊ</a>
            <span>${"page"}</span>
            <a class="router" href='${"after"}'>ᐅ</a>
        </section>`

export const templateArticle = handleTemplate`
          <article>
            <h1>${"title"}</h1>
            <hr>
            ${"content"}
        </article>`
