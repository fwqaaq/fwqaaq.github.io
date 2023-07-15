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
