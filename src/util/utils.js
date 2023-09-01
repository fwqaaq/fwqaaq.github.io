import { existsSync } from "fs"
import { parse } from "yaml"
import { format } from "datetime"

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

export const handleUTC = (date) => format(new Date(date), "yyyyMMddHHmmss")

/**
 * @param {string} date
 * @returns {string}
 */
export const convertToUSA = (date) => {
  // 转换为美国本地时间格式
  const utc = new Date(date)

  return utc.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

/**
 * @param {string} keywords
 * @param {string} description
 * @param {string} title
 * @returns {Promise<string>}
 */
export const replaceHead = async (keywords, description, title) => {
  const res = new TextDecoder().decode(
    await Deno.readFile(new URL("head.html", import.meta.url)),
  )

  return res
    .replace("<!-- keywords -->", keywords)
    .replace("<!-- description -->", description)
    .replace("<!-- title -->", title)
}

/**
 * @param {URL} url
 * @param {string} content
 * @param {boolean} append - default false
 */
export const generateSingleFile = (url, content, append = false) => {
  // if exists, remove it
  if (existsSync(url)) Deno.removeSync(url, { recursive: true })
  Deno.writeFileSync(url, new TextEncoder().encode(content), {
    createNew: true,
    append,
  })
  return {
    generateSingleFile,
    end: () => "end",
  }
}

/**
 * @param {Request} request
 * @returns {Response}
 */
export const handler = async (request) => {
  let reqUrl = new URL(request.url).pathname
  let ext = reqUrl.split(".").pop()
  if (ext === "css") ext = "text/css"
  else if (ext === "js") ext = "text/javascript"
  else if (ext === "html" || ext === "/") ext = "text/html"
  else ext = "*"
  if (reqUrl.endsWith("/")) reqUrl += "index.html"

  const headers = new Headers({ "Content-Type": ext })

  const file = await Deno.open(`./dist${reqUrl}`)
  const contentEncoding = request.headers.get("Accept-Encoding")

  // browser doesn't support gzip
  if (!contentEncoding || !contentEncoding.includes("gzip")) {
    return new Response(file.readable, { headers })
  }

  headers.set("Content-Encoding", "gzip")

  // encode with gzip
  const compress = new CompressionStream("gzip")
  file.readable.pipeThrough(compress)

  return new Response(compress.readable, { headers })
}
