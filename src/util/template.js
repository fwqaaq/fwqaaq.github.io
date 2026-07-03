const handleTemplate = (strings, ...keys) => {
  return (...values) => {
    const dict = values[values.length - 1] || {}
    const res = [strings[0]]
    keys.forEach((k, i) => {
      const v = Number.isInteger(k) ? values[k] : dict[k]
      res.push(v, strings[i + 1])
    })
    return res.join('')
  }
}

export const templateBox = handleTemplate`        
        <section class="box">
            <h3><a class="decoration-line" href="${'place'}">${'title'}</a></h3>
            <div class="post-meta">
              <a class="post-author" href="/./about/"><i class="fa-solid fa-user"></i> ${'author'} </a>发布于
              <div class="post-time"><i class="fa-solid fa-clock"></i> ${'time'}</div>
            </div>
            <p>${'summary'}</p>
            <div>
                ${'tags'}
            </div>
        </section>`

export const templateProcess = handleTemplate`
        <section class="pages box">
            <a class="router" href="${'before'}">ᐊ</a>
            <span>${'page'}</span>
            <a class="router" href='${'after'}'>ᐅ</a>
        </section>`

export const templateArticle = handleTemplate`
        <main class="blog-main">
          <article class="blog-article">
            <h1>${'title'}</h1>
          ${'postMeta'}
            <hr>
            ${'content'}
          </article>
        </main>${'giscus'}`

export const templateTeaser = handleTemplate`
        <main class="blog-main">
          <article class="blog-article">
            <h1>${'title'}</h1>
          ${'postMeta'}
            <hr>
            <p>${'summary'}</p>
            <div class="paywall-teaser">
              <p>🔒 这是一篇付费文章，解锁后可阅读全文。</p>
              <a class="paywall-unlock" href="/premium/${'slug'}">解锁全文${'price'}</a>
            </div>
          </article>
        </main>`

export const giscus = `<script src="https://giscus.app/client.js"
        data-repo="fwqaaq/fwqaaq.github.io"
        data-repo-id="R_kgDOHCFK2A"
        data-category="Show and tell"
        data-category-id="DIC_kwDOHCFK2M4CYOLh"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async></script>`

/**
 * @param {string} author
 * @param {string} website
 * @param {string} items
 * @returns
 */
export const getRss = (author, website, items) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${author}'s blog</title>
  <link>${website}</link>
  <description>这真的是一个废物的博客啦</description>
  ${items}
</channel>
</rss>
`
