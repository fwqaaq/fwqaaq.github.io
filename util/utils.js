import { existsSync } from "https://deno.land/std@0.194.0/fs/exists.ts"
import { parse } from "https://deno.land/std@0.194.0/yaml/mod.ts"

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

export const handleUTC = (date) => {
  const utc = new Date(date)
  const year = utc.getUTCFullYear()
  const month = (utc.getUTCMonth() + 1).toString().padStart(2, "0")
  const day = utc.getUTCDate().toString().padStart(2, "0")
  const hours = utc.getUTCHours().toString().padStart(2, "0")
  const minutes = utc.getUTCMinutes().toString().padStart(2, "0")
  const seconds = utc.getUTCSeconds().toString().padStart(2, "0")

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export const convertToUSA = (date) => {
  // 转换为美国本地时间格式
  const utc = new Date(date)

  return utc.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

export const replaceHead = async (keywords, description, title) => {
  const res = new TextDecoder().decode(
    await Deno.readFile(new URL("head.html", import.meta.url)),
  )

  return res
    .replace("<!-- keywords -->", keywords)
    .replace("<!-- description -->", description)
    .replace("<!-- title -->", title)
}

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
