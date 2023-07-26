import { markdown } from "./util/markdown.js"
import {
  convertToUSA,
  generateSingleFile,
  handleUTC,
  parseYaml,
  replaceHead,
} from "./util/utils.js"
import {
  templateArticle,
  templateBox,
  templateProcess,
} from "./util/template.js"
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

async function generatePage(
  dist,
  keywrods,
  description,
  title,
  iterContent,
  isArticle = false,
) {
  if (!await exists(dist)) await ensureFile(dist)
  const head = await replaceHead(keywrods, description, title)

  const header = decoder.decode(
    await Deno.readFile(new URL("../util/header.html", src)),
  )
  let body = ""
  if (isArticle) {
    const content = Array.isArray(iterContent)
      ? iterContent.map((iter) =>
        `<a class="router tag" href="/./${title}/${iter}/">${iter}</a>`
      ).join("")
      : iterContent
    body += templateArticle({
      title,
      content,
    })
  }
  if (!isArticle) body += iterContent.map(({ title, summary, date, tags }) =>
    templateBox({
      place: `/./posts/${handleUTC(date)}/`,
      title,
      summary,
      time: convertToUSA(date),
      tags: tags.map((tag) =>
        `<a class="router tag" href="/./tags/${tag}/index.html">${tag}</a>`
      )
        .join(""),
    })
  ).join("")


  const index = `${head}${header}<main>${body}</main>`

  await Deno.writeFile(
    dist,
    encoder.encode(index),
  )
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
      await generatePage(
        timeDir,
        tags.join(", "),
        summary,
        title,
        await markdown(md),
        true,
      )
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
    const aTags = tags.map((tag) =>
      `<a class="router tag" href="/./tags/${tag}/index.html">${tag}</a>`
    ).join("")
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

  for (const k of map.keys()) {
    const archiveUrl = new URL(`./${k}/index.html`, archiveDest)
    await generatePage(archiveUrl, k, `fwqaaq ~ ${k}`, k, map.get(k))
  }

  await generatePage(
    new URL("./index.html", archiveDest),
    [...map.keys()].join(", "),
    "fwqaaq ~ Archive",
    "archive",
    [...map.keys()],
    true,
  )
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

  for (const k of map.keys()) {
    const tagsUrl = new URL(`./${k}/index.html`, tagsDest)
    await generatePage(tagsUrl, k, `fwqaaq ~ ${k}`, k, map.get(k))
  }

  await generatePage(
    new URL("./index.html", tagsDest),
    [...map.keys()].join(", "),
    "fwqaaq ~ Tags",
    "tags",
    [...map.keys()],
    true,
  )
}

Promise.all([Home(), Archive(), Tags(), Others()])
