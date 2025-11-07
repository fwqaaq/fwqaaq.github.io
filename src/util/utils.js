import { ensureFile, exists } from 'fs'
import { parse } from 'yaml'
import { format } from 'datetime'
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
 * @param {{keywords: string, description: string, title: string, version: string, url: string}}
 * @param {string} [content]
 */
export const replaceHead = async (
  { keywords, description, title, version, url },
  content,
) => {
  const res = content ??
    await Deno.readTextFile(new URL('head.html', import.meta.url))

  return res
    .replace('<!-- keywords -->', keywords)
    .replace('<!-- author -->', 'fwqaaq') // replace with your name
    .replaceAll('<!-- description -->', description)
    .replaceAll('<!-- title -->', title)
    .replace('<!-- base.css -->', `/public/css/base.${version}.css`)
    .replace('<!-- index.css -->', `/public/css/index.${version}.css`)
    .replace('<!-- markdown.css -->', `/public/css/markdown.${version}.css`)
    .replace('<!-- index.js -->', `/public/JavaScript/index.${version}.js`)
    .replace('<!-- url -->', url)
}

/**
 * @param {string} header
 * @param {string} footer
 * @param {string} version
 * @param {string} src
 */
export const replaceBody = (header, footer, version, src) => {
  const body = Deno.readTextFileSync(new URL('../index.html', src))
  return body.replace('<!-- Header -->', header)
    .replace('<!-- Footer -->', footer)
    .replace('<!-- base.css -->', `/public/css/base.${version}.css`)
    .replace('<!-- index.css -->', `/public/css/index.${version}.css`)
    .replace('<!-- markdown.css -->', `/public/css/markdown.${version}.css`)
    .replace('<!-- index.js -->', `/public/JavaScript/index.${version}.js`)
}

/**
 * @param {string[]} tags
 * @param {string} basePath
 */
export const generateTags = (/**@type {string[]} */ tags, basePath = 'tags') =>
  tags.reduce(
    (acc, tag) =>
      acc +
      `<a class="tag" href="/./${basePath}/${tag}/"><i class="fa-solid fa-tag"></i> ${tag}</a>`,
    '',
  )

/**@param {import("./type.js").GeneratePageOptions}*/
export async function generatePage(
  { group, basePath, dist, header, footer, version, author },
) {
  const url = new URL(`./${basePath}/index.html`, dist)
  const keys = Object.keys(group)
  const head = await replaceHead({
    keywords: keys.join(', '),
    summary: `${author} ~ ${basePath}`,
    title: `${author} ~ ${basePath}`,
    version,
  })

  // a tags
  const body = templateArticle({
    title: basePath,
    content: generateTags(keys, basePath),
  })
  const article = `${head}${header}${body}${footer}`
  if (!await exists(url)) await ensureFile(url)
  await Deno.writeTextFile(url, article)

  for (const [key, items] of Object.entries(group)) {
    const itemUrl = new URL(`./${basePath}/${key}/index.html`, dist)
    const itemHead = await replaceHead({
      keywords: [...new Set(items.flatMap((item) => item.tags))],
      summary: `${author} ~ ${key}`,
      title: `${author} ~ ${key}`,
      version,
    })
    if (!await exists(itemUrl)) await ensureFile(itemUrl)

    // p tags
    const p = items.reduce(
      (acc, { date, summary }) => {
        const place = `/./posts/${handleUTC(date)}/index.html`
        return acc +
          `<p class="archive-p-line"><a class="archive-time-line" href=${place} target="_blank"> <span class="text">${summary}</span> <span class="date">${
            convertToUSA(date)
          }</span></a></p>`
      },
      '',
    )
    const itemBody = `${itemHead}${header}${
      templateArticle({ title: key, content: p })
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
