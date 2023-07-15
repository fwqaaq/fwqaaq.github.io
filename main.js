import { markdown } from "./util/markdown.js"
import {
  convertToUSA,
  handleUTC,
  parseYaml,
  replaceHead,
} from "./util/utils.js"
import {
  templateArticle,
  templateBox,
  templateProcess,
} from "./util/template.js"
import { copy, ensureDir } from "https://deno.land/std@0.194.0/fs/mod.ts"

const metaData = []
const src = new URL(import.meta.resolve("./src/"))
const dist = new URL(import.meta.resolve("./dist/"))

// Handle the public
{
  await copy(new URL("../public/", src), new URL("./public/", dist), {
    overwrite: true,
  })
  await copy(new URL("../index.js", src), new URL("./index.js", dist), {
    overwrite: true,
  })
}

// Handle the posts
{
  const postsSrc = new URL("./posts/", src)
  const postsDist = new URL("./posts/", dist)

  for await (const dir of Deno.readDir(postsSrc)) {
    const fileURL = new URL(`./${dir.name}`, postsSrc)
    const file = new TextDecoder().decode(await Deno.readFile(fileURL))
    const [yaml, md] = parseYaml(file)
    const { date, title, tags, summary } = yaml
    const pkgUrl = handleUTC(date) + "/"
    const childrenPost = new URL(pkgUrl, postsDist)
    await ensureDir(childrenPost)
    metaData.push({
      ...yaml,
      place: `/./posts/${pkgUrl}index.html`,
      time: convertToUSA(yaml.date),
    })

    const head = await replaceHead(tags.join(", "), summary, title)
    const html = head + templateArticle({
      title,
      content: (await markdown(md)).toString(),
    })
    await Deno.writeFile(
      new URL("index.html", childrenPost),
      new TextEncoder().encode(html),
    )
  }
}

// Home page
{
  const homeDest = new URL("./home/", dist)
  const indexUrl = new URL("../index.html", src)
  const collection = []
  const indexPage = new TextDecoder().decode(await Deno.readFile(indexUrl))
  await ensureDir(homeDest)
  metaData.sort((a, b) => b.date - a.date)
  let counter = 0, currentPage = 0
  const sum = metaData.length

  for (const meta of metaData) {
    counter++
    const { place, title, summary, time, tags } = meta
    collection.push(templateBox({
      place,
      title,
      summary,
      time,
      tags: tags.map((tag) =>
        `<a class="router" href="/./tags/${tag}/index.html">${tag}</a>`
      )
        .join(""),
    }))

    if (counter % 8 === 0 || counter === sum) {
      currentPage = Math.ceil(counter / 8)
      const dest = currentPage === 1
        ? dist
        : new URL(`${currentPage}/`, homeDest)
      await ensureDir(dest)
      const index = await replaceHead(
        "HTML, CSS, JavaScript, TypeScript, Vue, Git...",
        "这是一个可能讨论一切的 Blog",
        "fwqaaq ~ Blog",
      ) + collection
        .slice(counter - 8, counter)
        .join("")
        .concat(
          templateProcess({
            page: `${currentPage} / ${(Math.ceil(sum / 8))}`,
            before: currentPage === 1
              ? "#"
              : currentPage === 2
                ? "/"
                : `/./home/${currentPage - 1}/`,
            after: counter === sum ? "#" : `/./home/${currentPage + 1}/`,
          }),
        )

      await Deno.writeFile(
        new URL("./index.html", dest),
        new TextEncoder().encode(
          currentPage === 1
            ? indexPage.replace("<!-- Template -->", index)
            : index,
        ),
      )
    }
  }
}

// Archive page

{
  const archiveDest = new URL("./archive/", dist)
  // for (const meta of metaData) {
  //   const { place, title, summary, date, tags } = meta
  // }
  await ensureDir(archiveDest)
  const map = new Map()
  metaData.forEach((item) => {
    const year = new Date(item.date).getFullYear()
    map.has(year) ? map.get(year).push(item) : map.set(year, [item])
  })
  const yearsTags = []
  for (const k of map.keys()) {
    const yearUrl = new URL(`./${k}/`, archiveDest)
    await ensureDir(yearUrl)
    const index = await replaceHead(k, "fwqaaq's archive", "Archive") +
      map.get(k).map(({ place, title, summary, time, tags }) =>
        templateBox({
          place,
          title,
          summary,
          time,
          tags: tags.map((tag) =>
            `<a class="router" href="/./tags/${tag}/index.html">${tag}</a>`
          )
            .join(""),
        })
      ).join("")

    await Deno.writeFile(
      new URL("./index.html", yearUrl),
      new TextEncoder().encode(index),
    )
    yearsTags.push(`<a class="router year" href="/./archive/${k}/">${k}</a>`)
  }
  const index = await replaceHead("Archive", "fwqaaq's Archive", "Archive") +
    templateArticle({
      title: "Archive",
      content: yearsTags.join(""),
    })
  await Deno.writeFile(
    new URL("./index.html", archiveDest),
    new TextEncoder().encode(index),
  )
}

// Tags page
{
  const tagsDest = new URL("./tags/", dist)
  const map = new Map()
  metaData.forEach((item) => {
    item.tags.forEach((tag) => {
      map.has(tag) ? map.get(tag).push(item) : map.set(tag, [item])
    })
  })

  const tagsCollection = []
  for (const k of map.keys()) {
    const tagUrl = new URL(`./${k}/`, tagsDest)
    await ensureDir(tagUrl)
    const index = await replaceHead(k, "fwqaaq ~ tags", "Tags") +
      map.get(k).map(({ place, title, summary, time, tags }) =>
        templateBox({
          place,
          title,
          summary,
          time,
          tags: tags.map((tag) =>
            `<a class="router" href="/./tags/${tag}/index.html">${tag}</a>`
          )
            .join(""),
        })
      ).join("")

    await Deno.writeFile(
      new URL("./index.html", tagUrl),
      new TextEncoder().encode(index),
    )
    tagsCollection.push(`<a class="router tag" href="/./tags/${k}/">${k}</a>`)
  }
  const index = await replaceHead("Tags", "fwqaaq ~ tags", "Tags") + templateArticle({
    title: "Tags",
    content: tagsCollection.join(""),
  })
  await Deno.writeFile(
    new URL("./index.html", tagsDest),
    new TextEncoder().encode(index),
  )
}
