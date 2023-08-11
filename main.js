import { markdown } from "./src/util/markdown.js"
import {
  convertToUSA,
  generateSingleFile,
  handleUTC,
  parseYaml,
  replaceHead,
} from "./src/util/utils.js"
import {
  giscus,
  templateArticle,
  templateBox,
  templateProcess,
} from "./src/util/template.js"
import {
  copy,
  ensureDir,
  ensureFile,
  exists,
  existsSync,
} from "https://deno.land/std@0.194.0/fs/mod.ts"

const metaData = []
const decoder = new TextDecoder("utf-8"), encoder = new TextEncoder()

const dist = import.meta.resolve("./dist/"),
  src = import.meta.resolve("./src/")

if (existsSync(new URL(dist))) {
  Deno.removeSync(new URL(dist), { recursive: true })
}

function getPosts(title, content, isPosts = false) {
  const article = templateArticle({ title, content })
  return `<main>${article}</main>${isPosts ? giscus : ""}`
}

function getTags(title, tags) {
  return tags.map((tag) =>
    `<a class="router tag" href="/./${title}/${tag}/">${tag}</a>`
  ).join("")
}

function getHomePage(_title, iters) {
  const sections = iters.map(({ title, summary, date, tags }) =>
    templateBox({
      place: `/./posts/${handleUTC(date)}/`,
      title,
      summary,
      time: convertToUSA(date),
      tags: getTags("tags", tags),
    })
  ).join("")
  return `<main>${sections}</main>`
}

async function completeTask(map, url, dest) {
  for (const k of map.keys()) {
    const tagsUrl = new URL(`./${k}/index.html`, url)
    const task = await generatePage(tagsUrl, k, `fwqaaq ~ ${k}`, k)
    await task(getHomePage, map.get(k))
  }

  const task = await generatePage(
    new URL("./index.html", url),
    [...map.keys()].join(", "),
    `fwqaaq ~${dest}`,
    dest,
  )
  await task(getPosts, getTags(dest, [...map.keys()]))
}

async function generatePage(
  dist,
  keywrods,
  description,
  title,
) {
  if (!await exists(dist)) await ensureFile(dist)
  const head = await replaceHead(keywrods, description, title)

  const header = decoder.decode(
    await Deno.readFile(new URL("./util/header.html", src)),
  )

  return async (fn, ...params) => {
    const content = fn(title, ...params)
    const index = `${head}${header}${content}`

    await Deno.writeFile(
      dist,
      encoder.encode(index),
    )
  }
}

// Handle the meta data
{
  const posts = import.meta.resolve("./src/posts/")
  const iter = Deno.readDir(new URL(posts))[Symbol.asyncIterator]()
  while (true) {
    const { value, done } = await iter.next()
    if (done) break
    const file = decoder.decode(
      await Deno.readFile(new URL(value.name, posts)),
    )
    const [{ date, title, summary, tags }, md] = parseYaml(file)

    // Handle the posts
    {
      const timeDir = new URL(`./posts/${handleUTC(date)}/index.html`, dist)
      const task = await generatePage(timeDir, tags.join(", "), summary, title)
      await task(getPosts, await markdown(md), true)
    }

    metaData.push({
      date,
      title,
      summary,
      tags,
    })
  }
  metaData.sort((a, b) => b.date - a.date)
}

// Handle the others source
async function Others() {
  // Copy the public dir
  await copy(new URL("../public/", src), new URL("./public/", dist), {
    overwrite: true,
  })

  // Handle the CNAME
  const cname = new URL("./CNAME", dist)
  generateSingleFile(cname, "www.fwqaq.us")
}

// Home page
async function Home() {
  const homeDest = new URL("./home/", dist)
  const indexpage = decoder.decode(
    await Deno.readFile(new URL("../index.html", src)),
  ),
    metasLength = metaData.length,
    lastPage = Math.ceil(metasLength / 8)
  let content = ""

  metaData.forEach(async ({ date, title, summary, tags }, index) => {
    const aTags = getTags("tags", tags)
    content += templateBox({
      place: `/./posts/${handleUTC(date)}/`,
      title,
      summary,
      time: convertToUSA(date),
      tags: aTags,
    })

    if ((index + 1) % 8 === 0 || index + 1 === metasLength) {
      const cur = index + 1 === metasLength
        ? lastPage
        : Math.floor((index + 1) / 8)
      const process = templateProcess({
        before: cur > 2 ? `/./home/${cur - 1}/` : "/",
        page: `${cur} / ${lastPage}`,
        after: index === metasLength ? "#" : `/./home/${cur + 1}/`,
      })
      const indexPage = indexpage.replace(
        "<!-- Template -->",
        content + process,
      )

      // Reset the content
      content = ""

      // Generate the home dir
      if (cur !== 1) await ensureDir(new URL(`${cur}/`, homeDest))
      const url = cur === 1
        ? new URL("./index.html", dist)
        : new URL(`${cur}/index.html`, homeDest)

      await Deno.writeFile(url, encoder.encode(indexPage))
    }
  })
}

// Archive page
async function Archive() {
  const archiveDest = new URL("./archive/", dist)
  const map = new Map()
  for (const meta of metaData) {
    const year = new Date(meta.date).getFullYear()
    map.has(year) ? map.get(year).push(meta) : map.set(year, [meta])
  }
  await completeTask(map, archiveDest, "archive")
}

// Tags page
async function Tags() {
  const tagsDest = new URL("./tags/", dist)
  const map = new Map()
  for (const meta of metaData) {
    meta.tags.forEach((tag) => {
      map.has(tag) ? map.get(tag).push(meta) : map.set(tag, [meta])
    })
  }
  await completeTask(map, tagsDest, "tags")
}

async function About() {
  const aboutDest = new URL("./about/index.html", dist)
  if (!await exists(aboutDest)) await ensureFile(aboutDest)
  const aboutSrc = new URL("./About/about.md", src)

  const about = decoder.decode(await Deno.readFile(aboutSrc))
  const head = decoder.decode(
    await Deno.readFile(new URL("./util/head.html", src)),
  )
  const header = decoder.decode(
    await Deno.readFile(new URL("./util/header.html", src)),
  )
  const [, md] = parseYaml(about)
  const content = await markdown(md)
  const generated = `${head}${header}<main>${templateArticle({ title: "关于我", content })
    }</main>`
  await Deno.writeFile(aboutDest, encoder.encode(generated))
}

Promise.all([Home(), Archive(), Tags(), Others(), About()])
