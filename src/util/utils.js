import { existsSync } from 'fs'
import { parse } from 'yaml'
import { format } from 'datetime'
import init, { Features, transform } from 'lightningcss'

const regxYaml = /---(\n[\s\S]*?\n)---/

/**
 * @typedef {Object} yaml
 * @property {string} [Yaml.name]
 * @property {string} Yaml.title
 * @property {string} [Yaml.summary]
 * @property {string[]} [Yaml.tags]
 * @property {string} [Yaml.date]
 *
 * @param {string} file
 * @returns {[yaml, string]}
 */
export const parseYaml = (file) => {
  const [yamlRaw, contentMd] = file.split(regxYaml).slice(1)

  return [parse(yamlRaw), contentMd]
}

/**
 * @param {string} date
 * @returns {string}
 */

export const handleUTC = (date) => format(new Date(date), 'yyyyMMddHHmmss')

/**
 * @param {string} date
 * @returns {string}
 */
export const convertToUSA = (date) => {
  // 转换为美国本地时间格式
  const utc = new Date(date)

  return utc.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * @param {string} keywords
 * @param {string} description
 * @param {string} title
 * @param {string} version
 * @returns {Promise<string>}
 */
export const replaceHead = async (keywords, description, title, version) => {
  const res = await Deno.readTextFile(new URL('head.html', import.meta.url))

  return res
    .replace('<!-- keywords -->', keywords)
    .replace('<!-- description -->', description)
    .replace('<!-- title -->', title)
    .replace('<!-- base.css -->', `/public/css/base.${version}.css`)
    .replace('<!-- index.css -->', `/public/css/index.${version}.css`)
    .replace('<!-- markdown.css -->', `/public/css/markdown.${version}.css`)
    .replace('<!-- index.js -->', `/public/JavaScript/index.${version}.js`)
}

/**
 * @param {string} body
 * @param {string} header
 * @param {string} footer
 * @param {string} version
 */
export const replaceBody = (body, header, footer, version) => {
  return body.replace('<!-- Header -->', header)
    .replace('<!-- Footer -->', footer)
    .replace('<!-- base.css -->', `/public/css/base.${version}.css`)
    .replace('<!-- index.css -->', `/public/css/index.${version}.css`)
    .replace('<!-- markdown.css -->', `/public/css/markdown.${version}.css`)
    .replace('<!-- index.js -->', `/public/JavaScript/index.${version}.js`)
}

/**
 * @param {URL} url
 * @param {string} content
 * @param {boolean} append - default false
 */
export function* generateSingleFile(url, content, append = false) {
  // if exists, remove it
  while (true) {
    if (existsSync(url)) Deno.removeSync(url, { recursive: true })
    Deno.writeFileSync(url, new TextEncoder().encode(content), {
      createNew: true,
      append,
    })
    const result = yield
    if (result) {
      ;[url, content] = result // 解构赋值
    }
  }
}

/**
 * @param {URL} path
 * @returns {Promise<Uint8Array>}
 */
export async function compileCss(path) {
  await init()
  const text = await Deno.readFile(path)
  const { code } = transform({
    code: text,
    include: Features.Colors | Features.Nesting,
    minify: true,
  })
  return code
}

export function startServer(
  /**@type {number} */ port,
  /**@type {number}*/ version,
) {
  try {
    Deno.serve({
      port,
      hostname: 'localhost',
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

  const file = await Deno.open(`./dist${reqUrl}`)
  const contentEncoding = request.headers.get('Accept-Encoding')

  // browser doesn't support gzip
  if (!contentEncoding || !contentEncoding.includes('gzip')) {
    return new Response(file.readable, { headers })
  }

  headers.set('Content-Encoding', 'gzip')

  // encode with gzip
  const compress = new CompressionStream('gzip')
  file.readable.pipeThrough(compress)

  return new Response(compress.readable, { headers })
}
