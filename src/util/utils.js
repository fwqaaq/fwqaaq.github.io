import { ensureFile, exists } from '@std/fs'
import { parse } from '@std/yaml'
import { format } from '@std/datetime'
import { templateArticle } from './template.js'
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import postcssMinify from '@csstools/postcss-minify'

const regxYaml = /---(\n[\s\S]*?\n)---/

/**
 * @param {string} file
 * @returns {[import("./type.js").MetaData, string]}
 */
export const parseYaml = (file) => {
  const [yamlRaw, contentMd] = file.split(regxYaml).slice(1)

  return [parse(yamlRaw), contentMd]
}

/** @param {string} date*/
export const handleUTC = (date) => format(new Date(date), 'yyyyMMddHHmmss')

/**@param {string} date*/
export const convertToUSA = (date) => {
  // 转换为美国本地时间格式
  const utc = new Date(date)

  return utc.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * @param {{keywords: string, description: string, title: string, version: string, url: string, author: string}}
 * @param {string} head
 */
export const replaceHead = (
  { keywords, description, title, version, url, author },
  head,
) => {
  return head
    .replaceAll('<!-- keywords -->', keywords)
    .replaceAll('<!-- author -->', author)
    .replaceAll('<!-- description -->', description)
    .replaceAll('<!-- title -->', title)
    .replace('<!-- url -->', url)
    .replace('<!-- base.css -->', `/public/css/base.${version}.css`)
    .replace('<!-- index.css -->', `/public/css/index.${version}.css`)
    .replace('<!-- markdown.css -->', `/public/css/markdown.${version}.css`)
    .replace('<!-- index.js -->', `/public/JavaScript/index.${version}.js`)
}

/**
 * @param {string} head
 * @param {string} header
 * @param {string} footer
 * @param {URL} src the source of the body template
 */
export const replaceBody = (head, header, footer, src) => {
  const body = Deno.readTextFileSync(src)
  return body
    .replace('<!-- Head -->', head)
    .replace('<!-- Header -->', header)
    .replace('<!-- Footer -->', footer)
}

/**
 * @param {string[]} tags
 * @param {string} basePath
 */
/**
 * @param {string[]} tags
 * @param {string} basePath
 * @param {Record<string, number> | null} counts
 */
export const generateTags = (tags, basePath = 'tags', counts = null) =>
  tags.reduce(
    (acc, tag) =>
      acc +
      `<a class="tag" href="/./${basePath}/${tag}/"><i class="fa-solid fa-tag"></i> ${tag}${
        counts ? `<span class="tag-count">${counts[tag]}</span>` : ''
      }</a>`,
    '',
  )

const toMonthKey = (/** @type {string} */ date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${
    String(value.getMonth() + 1).padStart(2, '0')
  }`
}

const toMonthLabel = (/** @type {string} */ date) => {
  const value = new Date(date)
  return `${value.getFullYear()} 年 ${value.getMonth() + 1} 月`
}

const toDateKey = (/** @type {string} */ date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${
    String(value.getMonth() + 1).padStart(2, '0')
  }-${String(value.getDate()).padStart(2, '0')}`
}

const toDayLabel = (/** @type {string} */ date) => {
  const value = new Date(date)
  return `${String(value.getMonth() + 1).padStart(2, '0')}-${
    String(value.getDate()).padStart(2, '0')
  }`
}

const createArchiveTimeline = (
  /** @type {Array<import("./type.js").MetaData & { author?: string }>} */ meta,
) => {
  const sortedMeta = [...meta].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )
  const years = new Map()

  for (const item of sortedMeta) {
    const value = new Date(item.date)
    const year = String(value.getFullYear())
    const month = toMonthKey(item.date)

    if (!years.has(year)) {
      years.set(year, new Map())
    }

    const months = years.get(year)
    if (!months.has(month)) {
      months.set(month, [])
    }

    months.get(month).push(item)
  }

  return [...years.entries()].map(([year, months], index) => {
    const monthCount = months.size
    const postCount = [...months.values()].reduce(
      (total, items) => total + items.length,
      0,
    )
    const monthItems = [...months.entries()].map(([month, posts]) => {
      const date = new Date(posts[0].date)
      const postItems = posts.map(({ date, title }) => {
        const place = `/./posts/${handleUTC(date)}/index.html`
        const day = toDayLabel(date)

        return `<li class="archive-post">
              <a class="archive-post-link" href="${place}">
                <time class="archive-post-day" datetime="${
          toDateKey(date)
        }">${day}</time>
                <span class="archive-post-title">${title}</span>
              </a>
            </li>`
      }).join('')

      return `<li class="archive-month">
            <div class="archive-month-head">
              <time class="archive-month-title" datetime="${month}">${
        toMonthLabel(date)
      }</time>
              <span class="archive-month-count">${posts.length} 篇</span>
            </div>
            <ul class="archive-posts">
              ${postItems}
            </ul>
          </li>`
    }).join('')

    return `<details class="archive-year"${index === 0 ? ' open' : ''}>
          <summary class="archive-year-head" aria-label="${year}年归档">
            <span class="archive-year-node" aria-hidden="true"></span>
            <h2 class="archive-year-title">${year}</h2>
            <span class="archive-year-count">${monthCount} 个月 / ${postCount} 篇</span>
            <i class="archive-year-chevron fa-solid fa-chevron-right" aria-hidden="true"></i>
          </summary>
          <ol class="archive-months">
            ${monthItems}
          </ol>
        </details>`
  }).join('')
}

/**
 * @param {{meta: Array<import("./type.js").MetaData & { author?: string }>, dist: string, header: string, head: string, footer: string, version: string, author: string, website: string}}
 */
export async function generateArchiveTimelinePage(
  { meta, dist, header, head, footer, version, author, website },
) {
  const url = new URL('./archive/index.html', dist)
  const years = [
    ...new Set(meta.map((item) => new Date(item.date).getFullYear())),
  ]
    .sort((a, b) => b - a)
  const timeline = createArchiveTimeline(meta)
  const archiveHead = replaceHead({
    keywords: years.join(', '),
    description: `${author} 的文章归档`,
    title: `${author} ~ archive`,
    version,
    url: `${website}archive/`,
    author,
  }, head)
  const body = templateArticle({
    title: 'archive',
    content: `<section class="archive-timeline" aria-label="文章归档时间线">
            ${timeline}
          </section>`,
  })

  if (!await exists(url)) await ensureFile(url)
  await Deno.writeTextFile(url, `${archiveHead}${header}${body}${footer}`)
}

/**@param {import("./type.js").GeneratePageOptions}*/
export async function generatePage(
  { group, basePath, dist, header, head, footer, version, author },
) {
  const url = new URL(`./${basePath}/index.html`, dist)

  // Sort tags by post count descending
  const sortedEntries = Object.entries(group).sort(([, a], [, b]) => b.length - a.length)
  const keys = sortedEntries.map(([k]) => k)
  const counts = Object.fromEntries(sortedEntries.map(([k, v]) => [k, v.length]))

  const mainHead = replaceHead({
    keywords: keys.join(', '),
    summary: `${author} ~ ${basePath}`,
    title: `${author} ~ ${basePath}`,
    version,
    author,
  }, head)

  const body = templateArticle({
    title: basePath,
    content: generateTags(keys, basePath, counts),
  })
  const article = `${mainHead}${header}${body}${footer}`
  if (!await exists(url)) await ensureFile(url)
  await Deno.writeTextFile(url, article)

  for (const [key, items] of Object.entries(group)) {
    const itemUrl = new URL(`./${basePath}/${key}/index.html`, dist)
    const itemHead = replaceHead({
      keywords: [...new Set(items.flatMap((item) => item.tags))],
      summary: `${author} ~ ${key}`,
      title: `${author} ~ ${key}`,
      version,
      author,
    }, head)
    if (!await exists(itemUrl)) await ensureFile(itemUrl)

    const postList = items.reduce(
      (acc, { date, title }) => {
        const place = `/./posts/${handleUTC(date)}/index.html`
        return acc +
          `<a class="tag-post-item" href="${place}">
            <span class="tag-post-title">${title}</span>
            <span class="tag-post-date">${convertToUSA(date)}</span>
          </a>`
      },
      '',
    )
    const itemBody = `${itemHead}${header}${
      templateArticle({ title: key, content: `<div class="tag-post-list">${postList}</div>` })
    }${footer}`
    await Deno.writeTextFile(itemUrl, itemBody)
  }
}

export function createProcessor() {
  const postcssor = postcss([
    postcssMinify(),
    postcssPresetEnv({
      stage: 3,
      browsers: 'last 2 versions, > 1%, not dead',
      features: {
        'nesting-rules': true,
        'has-pseudo-class': true,
        'nested-calc': true,
      },
    }),
  ])

  return postcssor
}

export function startServer(
  /**@type {number} */ port,
  /**@type {number}*/ version,
) {
  try {
    Deno.serve({
      port,
      hostname: '127.0.0.1',
      onListen({ hostname, port }) {
        console.log(`Server started at http://${hostname}:${port}`)
      },
    }, (request) => handler(request, version))
  } catch (e) {
    if (e instanceof Deno.errors.AddrInUse) {
      console.log(`Port ${port} in use, try another port`)
      setTimeout(startServer, 1000)
    } else {
      throw e
    }
  }
}

/**
 * @param {Request} request
 * @param {string} version
 * @returns {Response}
 */
const handler = async (request, version) => {
  let reqUrl = new URL(request.url).pathname
  let ext = reqUrl.split('.').pop()
  if (ext === 'css') ext = 'text/css'
  else if (ext === 'js') ext = 'text/javascript'
  else if (ext === 'html' || ext === '/') ext = 'text/html'
  else ext = '*'
  if (reqUrl.endsWith('/')) reqUrl += 'index.html'

  const headers = new Headers({ 'Content-Type': ext })

  if (reqUrl.includes(version)) {
    reqUrl = reqUrl.replace(`.${version}`, '')
  }

  let file, status = 200

  try {
    file = await Deno.open(`./dist${reqUrl}`)
  } catch {
    status = 404
    file = await Deno.open(`./dist/404.html`)
  }

  const contentEncoding = request.headers.get('Accept-Encoding')

  // browser doesn't support gzip
  if (!contentEncoding || !contentEncoding.includes('gzip')) {
    return new Response(file.readable, { headers })
  }

  headers.set('Content-Encoding', 'gzip')

  // encode with gzip
  const compress = new CompressionStream('gzip')
  file.readable.pipeThrough(compress)

  return new Response(compress.readable, { headers, status })
}
