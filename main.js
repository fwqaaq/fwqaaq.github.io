import { markdown } from './src/util/remark/markdown.js'
import {
  compileCss,
  convertToUSA,
  generateSingleFile,
  handleUTC,
  parseYaml,
  replaceBody,
  replaceHead,
  startServer,
} from './src/util/utils.js'
import {
  getRss,
  giscus,
  templateArticle,
  templateBox,
  templateProcess,
} from './src/util/template.js'
import { copy, ensureDir, ensureFile, exists, existsSync } from 'fs'
import 'https://deno.land/std@0.201.0/dotenv/load.ts'

/**
 * @typedef {Object} MetaData
 * @property {string} MetaData.date
 * @property {string} MetaData.title
 * @property {string} MetaData.summary
 * @property {string[]} MetaData.tags
 */

/**@type {MetaData[]}*/
const metaData = []
const dist = import.meta.resolve('./dist/')
const src = import.meta.resolve('./src/')
const randomNumber = Math.floor(Math.random() * 1000000)

// global config
const WEBSITE = Deno.env.get('WEBSITE')
const author = Deno.env.get('AUTHOR')
const port = Deno.env.get('PORT')
const header = await Deno.readTextFile(new URL('./util/header.html', src))
const footer = await Deno.readTextFile(new URL('./util/footer.html', src))

const getPosts = (title, content, isPosts = false) =>
  `${templateArticle({ title, content, giscus: isPosts ? giscus : '' })}`

const getTags = (title, tags) =>
  tags.reduce(
    (acc, tag) =>
      acc + `<a class="tag" href="/./${title}/${tag}/">
      <i class="fa-solid fa-tag"></i> ${tag}
      </a>`,
    '',
  )

/**
 * @param {string} title
 * @param {MetaData[]} iters
 */
function getArchive(title, iters) {
  const content = iters.reduce(
    (acc, { date, summary }) => {
      const place = `/./posts/${handleUTC(date)}/`
      return acc +
        `<p><a class="decoration-line" href=${place} target="_blank"> ${summary} ··· ${convertToUSA(date)
        }</a></p>`
    },
    '',
  )

  return templateArticle({ title, content })
}
/**
 * @param {Map<string,MetaData[]>} map
 * @param {string} url
 * @param {string} dest
 */
async function completeTask(map, url, dest) {
  for (const k of map.keys()) {
    const tagsUrl = new URL(`./${k}/index.html`, url)
    const task = await generatePage(tagsUrl, k, `${author} ~ ${k}`, k)
    await task(getArchive, map.get(k))
  }

  const task = await generatePage(
    new URL('./index.html', url),
    [...map.keys()].join(', '),
    `${author} ~ ${dest}`,
    dest,
  )
  await task(getPosts, getTags(dest, [...map.keys()]))
}

async function generatePage(
  /**@type {string}*/ dist,
  /**@type {string}*/ keywords,
  /**@type {string}*/ description,
  /**@type {string}*/ title,
) {
  if (!await exists(dist)) await ensureFile(dist)
  const head = await replaceHead(keywords, description, title, randomNumber)

  return async (fn, ...params) => {
    const content = fn(title, ...params)
    const index = `${head}${header}${content}${footer}`

    await Deno.writeTextFile(dist, index)
  }
}

// Handle the meta data
async function handlePosts() {
  const posts = import.meta.resolve('./src/posts/')
  const iter = Deno.readDir(new URL(posts))[Symbol.asyncIterator]()
  while (true) {
    const { value, done } = await iter.next()
    if (done) break
    const file = await Deno.readTextFile(new URL(value.name, posts))
    const [{ date, title, summary, tags }, md] = parseYaml(file)

    // Handle the posts
    {
      const timeDir = new URL(`./posts/${handleUTC(date)}/index.html`, dist)
      const task = await generatePage(timeDir, tags.join(', '), summary, title)
      await task(getPosts, await markdown(md), true)
    }

    metaData.push({ date, title, summary, tags })
  }
  metaData.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Handle the others source
async function Others() {
  await ensureDir(new URL('./public/', dist))
  for await (const entry of Deno.readDir(new URL('../public/', src))) {
    if (entry.name === 'css') continue
    const __src_p = new URL(`../public/${entry.name}`, src)
    const __dist_p = new URL(`./public/${entry.name}`, dist)
    if (entry.name === 'JavaScript') {
      await ensureFile(
        new URL(`./${entry.name}/index.${randomNumber}.js`, __dist_p),
      )
      await copy(
        new URL(`./${entry.name}/index.js`, __src_p),
        new URL(`./${entry.name}/index.${randomNumber}.js`, __dist_p),
        { overwrite: true },
      )
      continue
    }
    await copy(__src_p, __dist_p, { overwrite: true })
  }

  // compile the css
  const __css_d = new URL('./public/css/', dist)
  await ensureDir(__css_d)
  for await (const entry of Deno.readDir(new URL('../public/css/', src))) {
    const path = new URL(`../public/css/${entry.name}`, src)
    const code = await compileCss(path)
    const fileName = entry.name.split('.').join(`.${randomNumber}.`)
    await Deno.writeFile(new URL(fileName, __css_d), code)
  }

  // Handle the CNAME
  const cname = new URL('./CNAME', dist)

  // Handle the RSS
  const rss = new URL('./feed.xml', dist)
  const itemsRss = metaData.reduce((acc, { date, title, summary }) => {
    const url = `${WEBSITE}posts/${handleUTC(date)}/`
    return acc + `<item>
    <title>${title}</title>
    <link>${url}</link>
    <description>${summary}</description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    </item>`
  }, '')

  // sitemap
  const sitemap = new URL('./sitemap.xml', dist)
  const itemsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${metaData.reduce((acc, { date }) =>
    `${acc}<url><loc>${WEBSITE}posts/${handleUTC(date)}/</loc></url>`, '')
    }
</urlset>`

  // robots
  const robots = new URL('./robots.txt', dist)
  const robotsContent = `User-agent: *
Allow: /
Sitemap: ${WEBSITE}sitemap.xml`

  const files = [
    [rss, getRss(author, WEBSITE, itemsRss)],
    [sitemap, itemsSitemap],
    [robots, robotsContent],
  ]
  const g = generateSingleFile(cname, WEBSITE.slice(8, -1))
  g.next()
  files.forEach((file) => g.next(file))
}

// Home page
async function Home() {
  const homeDest = new URL('./home/', dist)
  let indexPage = await Deno.readTextFile(new URL('../index.html', src))
  indexPage = replaceBody(indexPage, header, footer, randomNumber)

  const mLength = metaData.length
  const lastPage = Math.ceil(mLength / 8)
  let content = ''

  for (let index = 0; index < mLength; index++) {
    const { date, title, summary, tags } = metaData[index]
    const aTags = getTags('tags', tags)
    content += templateBox({
      place: `/./posts/${handleUTC(date)}/`,
      title,
      summary,
      time: convertToUSA(date),
      tags: aTags,
    })

    if ((index + 1) % 8 === 0 || index + 1 === mLength) {
      const cur = index + 1 === mLength
        ? lastPage
        : Math.floor((index + 1) / 8)
      const process = templateProcess({
        before: cur > 2 ? `/./home/${cur - 1}/` : '/',
        page: `${cur} / ${lastPage}`,
        after: index === mLength ? '#' : `/./home/${cur + 1}/`,
      })
      const home = indexPage.replace('<!-- Template -->', content + process)

      // Reset the content
      content = ''

      // Generate the home dir
      if (cur !== 1) await ensureDir(new URL(`${cur}/`, homeDest))
      const url = cur === 1
        ? new URL('./index.html', dist)
        : new URL(`${cur}/index.html`, homeDest)

      await Deno.writeTextFile(url, home)
    }
  }
}

// Archive page
async function Archive() {
  const archiveDest = new URL('./archive/', dist)
  const map = new Map()
  for (const meta of metaData) {
    const year = new Date(meta.date).getFullYear()
    map.has(year) ? map.get(year).push(meta) : map.set(year, [meta])
  }
  await completeTask(map, archiveDest, 'archive')
}

// Tags page
async function Tags() {
  const tagsDest = new URL('./tags/', dist)
  const map = new Map()
  for (const meta of metaData) {
    meta.tags.forEach((tag) => {
      map.has(tag) ? map.get(tag).push(meta) : map.set(tag, [meta])
    })
  }
  await completeTask(map, tagsDest, 'tags')
}

async function About() {
  const __dist_about = new URL('./about/index.html', dist)
  if (!await exists(__dist_about)) await ensureFile(__dist_about)
  const __src_about = new URL('./about/about.md', src)

  const about = await Deno.readTextFile(__src_about)
  const head = await replaceHead(
    'fwqaaq, GitHub fwqaaq, study, about',
    '关于我',
    '关于我',
    randomNumber,
  )

  const [, md] = parseYaml(about)
  const content = await markdown(md)
  const generated = `${head}${header}${templateArticle({ title: '关于我', content })
    }${footer}`
  await Deno.writeTextFile(__dist_about, generated)
}

async function main() {
  if (existsSync(new URL(dist))) {
    Deno.removeSync(new URL(dist), { recursive: true })
  }
  await handlePosts()
  Promise.all([Home(), Archive(), Tags(), Others(), About()])
}

// Handle the http server
const mode = Deno.env.get('MODE')
if (mode === 'DEV' || mode === 'PRO') {
  main()
}

if (mode === 'DEV' || mode === 'PRE') {
  startServer(port)
}
