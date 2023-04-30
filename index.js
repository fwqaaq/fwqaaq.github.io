import { writeFileSync, readFileSync, readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs"
import path from 'path'
import { fileURLToPath } from "url"
import yaml from "js-yaml"
import md from './md.js'
import { htmlText, indexHtml } from "./template.js"

const root = new URL(".", import.meta.url)
process.env.NODE_DEST = "dist"
process.env.NODE_SOURCE = "posts"
process.env.NODE_STATIC = "public"

async function readNestedDir(dir, dest) {
  const files = readdirSync(dir, { encoding: "utf8" })
  files.forEach(file => {
    const source = path.join(dir, file)
    const target = path.join(dest, file)
    const state = statSync(source)
    if (state.isDirectory()) {
      if (!existsSync(target)) {
        mkdirSync(target, { recursive: true })
      }
      readNestedDir(source, target)
      return
    }
    if (state.isFile() && target.endsWith(".md")) {
      writeDestDir(target, contentMd(source))
      return
    }
    cpFile(source, target)
  })
}

const contentMd = (filePath) => {
  if (!filePath.endsWith(".md"))
    throw new Error("Not Markdown file")
  const [, yamlContent, mdContent] = /^---\n([\s\S]*?)\n---\n([\s\S]*)/.exec(readFileSync(filePath, { encoding: "utf-8" }))
  const { title, date, categories } = getYaml(yamlContent)
  return htmlText(title, categories, date, time(date), md.render(mdContent))
}

const getYaml = (yamlContent) => yaml.load(yamlContent)
const time = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })

const writeDestDir = (dest, content) => {
  const initPath = fileURLToPath(new URL(dest.replace(/\.md$/, ".html"), root))
  writeFileSync(initPath, content, { encoding: "utf-8" })
}

const copy = async (dir, dest) => {
  const file = readdirSync(dir, 'utf-8')
  file.forEach((item) => {
    const source = path.join(dir, item)
    const target = path.join(dest, item)
    const typeFile = cpFile(source, target)
    if (typeFile === "directory") {
      copy(source, target)
    }
  })
}

const cpFile = (source, target) => {
  const state = statSync(source)
  if (state.isFile()) {
    copyFileSync(source, target)
    return "file"
  }
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true })
    return "directory"
  }
}

async function collectATag(dir, dest) {
  const aTagArr = []
  const initDirLen = dir.length
  const a = (href, fileName) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${fileName}</a>`
  const recur = (dir) => {
    const files = readdirSync(dir, "utf-8")
    files.forEach((item) => {
      const source = path.join(dir, item)
      const state = statSync(source)

      if (state.isFile() && item.endsWith(".md")) {
        aTagArr.push(a(source.slice(initDirLen).replace(/\md$/, "html"), item.replace(/\.md$/, "")))
        return
      }

      if (state.isDirectory()) {
        recur(source)
        return
      }
    })
  }
  recur(dir)
  writeFileSync(path.join(dest, "index.html"), indexHtml(aTagArr.join("\n")), { encoding: "utf-8" })
}

Promise.all([readNestedDir(process.env.NODE_SOURCE, process.env.NODE_DEST), copy(process.env.NODE_STATIC, process.env.NODE_DEST), collectATag(process.env.NODE_SOURCE, process.env.NODE_DEST)]).catch(
  err => {
    console.log(err)
  }
)