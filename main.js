import { markdown } from "./src/util/markdown.js"
import {
  convertToUSA,
  generateSingleFile,
  handleUTC,
  parseYaml,
  replaceHead,
} from "./src/util/utils.js"
import {
  getRss,
  giscus,
  templateArticle,
  templateBox,
  templateProcess,
} from "./src/util/template.js"
import { handler } from "./src/util/utils.js"
import { copy, ensureDir, ensureFile, exists, existsSync } from "fs"
import "https://deno.land/std@0.201.0/dotenv/load.ts"

/**
 * @typedef {Object} MetaData
 * @property {string} MetaData.date
 * @property {string} MetaData.title
 * @property {string} MetaData.summary
 * @property {string[]} MetaData.tags
 */

/**
 * @type {MetaData[]}
 */
const metaData = []
const dist = import.meta.resolve("./dist/"),
  src = import.meta.resolve("./src/")

// global config
/**
 * @type {{website: string, author: string}}
 */
const website = Deno.env.get("WEBSITE"), author = Deno.env.get("AUTHOR")

const header = await Deno.readTextFile(new URL("./util/header.html", src))

if (existsSync(new URL(dist))) {
  Deno.removeSync(new URL(dist), { recursive: true })
}

const getPosts = (title, content, isPosts = false) =>
  `<main class="blog-main">${templateArticle({ title, content })}</main>${isPosts ? giscus : ""}`

const getTags = (title, tags) =>
  tags.reduce(
    (acc, tag) =>
      acc + `<a class="tag" href="/./${title}/${tag}/">
      <i class="fa-solid fa-tag"></i> ${tag}
      </a>`,
    "",
  )

function getHomePage(_title, iters) {
  const sections = iters.reduce((acc, { title, summary, date, tags }) => {
    const place = `/./posts/${handleUTC(date)}/`, time = convertToUSA(date)
    return acc +
      templateBox({ place, title, summary, time, tags: getTags("tags", tags) })
  }, "")
  return `<main class="blog-main">${sections}</main>`
}

async function completeTask(map, url, dest) {
  for (const k of map.keys()) {
    const tagsUrl = new URL(`./${k}/index.html`, url)
    const task = await generatePage(tagsUrl, k, `${author} ~ ${k}`, k)
    await task(getHomePage, map.get(k))
  }

  const task = await generatePage(
    new URL("./index.html", url),
    [...map.keys()].join(", "),
    `${author} ~ ${dest}`,
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

  return async (fn, ...params) => {
    const content = fn(title, ...params)
    const index = `${head}${header}${content}`

    await Deno.writeTextFile(dist, index)
  }
}

// Handle the meta data
{
  const posts = import.meta.resolve("./src/posts/")
  const iter = Deno.readDir(new URL(posts))[Symbol.asyncIterator]()
  while (true) {
    const { value, done } = await iter.next()
    if (done) break
    const file = await Deno.readTextFile(new URL(value.name, posts))
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

  // Handle the RSS
  const rss = new URL("./feed.xml", dist)
  const itemsRss = metaData.reduce((acc, { date, title, summary }) => {
    const url = `${website}posts/${handleUTC(date)}/`
    return acc + `<item>
    <title>${title}</title>
    <link>${url}</link>
    <description>${summary}</description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    </item>`
  }, "")

  // sitemap
  const sitemap = new URL("./sitemap.xml", dist)
  const itemsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${metaData.reduce((acc, { date }) =>
    `${acc}<url><loc>${website}posts/${handleUTC(date)}/</loc></url>`, "")
    }
</urlset>`

  // robots
  const robots = new URL("./robots.txt", dist)
  const robotsContent = `User-agent: *
Allow: /
Sitemap: ${website}sitemap.xml`

  generateSingleFile(cname, "www.fwqaq.us")
    .generateSingleFile(rss, getRss(author, website, itemsRss))
    .generateSingleFile(sitemap, itemsSitemap)
    .generateSingleFile(robots, robotsContent)
    .end()
}

// Home page
async function Home() {
  const homeDest = new URL("./home/", dist)
  const indexpage = (await Deno.readTextFile(new URL("../index.html", src)))
    .replace(
      "<!-- Header -->",
      header,
    ),
    metasLength = metaData.length,
    lastPage = Math.ceil(metasLength / 8)
  let content = ""

  for (let index = 0; index < metasLength; index++) {
    const { date, title, summary, tags } = metaData[index]
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

      await Deno.writeTextFile(url, indexPage)
    }
  }
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

  const about = await Deno.readTextFile(aboutSrc)
  const head = await replaceHead(
    "fwqaaq, GitHub fwqaaq, study, about",
    "关于我",
    "关于我",
  )

  const [, md] = parseYaml(about)
  const content = await markdown(md)
  const generated = `${head}${header}<main class="blog-main">${templateArticle({ title: "关于我", content })
    }</main>`
  await Deno.writeTextFile(aboutDest, generated)
}

Promise.all([Home(), Archive(), Tags(), Others(), About()])

// Handle the http server
const port = 3000
if (Deno.env.get("DEV") === "true") {
  startServer()
}

function startServer() {
  try {
    Deno.serve({
      port: 3000,
      onListen({ hostname, port }) {
        console.log(`Server started at http://${hostname}:${port}`)
      }
    }, handler)
  } catch (e) {
    if (e instanceof Deno.errors.AddrInUse) {
      console.log(`Port ${port} in use, try another port`)
      setTimeout(startServer, 1000)
    } else {
      throw e
    }
  }
}