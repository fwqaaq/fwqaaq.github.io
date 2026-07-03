/** @jsxImportSource hono/jsx */
import { execFile } from 'node:child_process'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { markdown } from '../util/remark/markdown.ts'
import { createGiscus } from '../util/site.tsx'
import { Article, PostMeta, renderJsx, Teaser } from './components.tsx'
import { format, handleUTC, parseYaml, replaceHead } from '../util/utils.ts'
import type { ApiContent, BlogData, BuildConfig, CollectedPost, MetaData, PremiumContent, RouteManifestEntry } from '../types.ts'
import type { Dirent } from 'node:fs'

const execFileAsync = promisify(execFile)
const updateRegex = /^(updateAt:\s*)(.+)$/m

const formatDate = (date: string | Date) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')

async function latestGitDate(filePath: string): Promise<string> {
  const { stdout } = await execFileAsync('git', [
    'log',
    '-1',
    '--format=%ad',
    '--date=iso-strict',
    '--',
    filePath,
  ])
  return stdout.trim()
}

async function readPostWithUpdatedFrontmatter(filePath: string): Promise<string> {
  let postContent = await readFile(filePath, 'utf8')
  const gitDate = await latestGitDate(filePath)
  const updated = gitDate ? formatDate(gitDate) : null
  const matches = postContent.match(updateRegex)
  const updateAt = matches ? matches[2].trim() : null
  const oneDay = 24 * 60 * 60 * 1000

  if (
    updated &&
    (!updateAt || +new Date(updateAt) + oneDay < +new Date(updated))
  ) {
    postContent = postContent.replace(updateRegex, `updateAt: ${updated}`)
    await writeFile(filePath, postContent)
  }

  return postContent
}

function postPageHead(config: BuildConfig, meta: MetaData, markdownBody: string): string {
  const { author, head, version, website } = config
  const dateSlug = handleUTC(meta.date)
  const description = meta.paid
    ? (meta.summary ?? '')
    : `${markdownBody.trim().slice(10, 100).replace(/\n/g, ' ')}...`

  return replaceHead({
    keywords: (meta.tags ?? []).join(', '),
    description,
    title: meta.title,
    version,
    url: `${website}/posts/${dateSlug}/`,
    author,
  }, head)
}

function postMetaHtml(config: BuildConfig, meta: MetaData): string {
  return renderJsx(<PostMeta
    author={config.author}
    date={formatDate(meta.date).slice(0, 10)}
    updateAt={String(meta.updateAt ?? meta.date).slice(0, 10)}
  />)
}

async function collectPost(config: BuildConfig, entry: Dirent, postsUrl: URL): Promise<CollectedPost> {
  const filePath = fileURLToPath(new URL(entry.name, postsUrl))
  const postContent = await readPostWithUpdatedFrontmatter(filePath)
  const [meta, md] = parseYaml(postContent)
  const slug = entry.name.replace(/\.md$/, '')
  const dateSlug = handleUTC(meta.date)
  const postMeta = postMetaHtml(config, meta)
  const newHead = postPageHead(config, meta, md)

  const content = renderJsx(<Article
    content={String(await markdown(md, {
      sponsorUrl: config.site?.sponsor?.url,
    }))}
    title={meta.title}
    giscus={createGiscus(config.site?.giscus)}
    postMeta={postMeta}
  />)
  const fullHtml = `${newHead}${config.header}${content}${config.footer}`

  let publicHtml = fullHtml
  let premiumPage: PremiumContent | null = null
  if (meta.paid) {
    premiumPage = {
      slug,
      title: meta.title,
      html: fullHtml,
      ...(meta.price ? { price: meta.price } : {}),
    }
    const teaser = renderJsx(<Teaser
      title={meta.title}
      postMeta={postMeta}
      summary={meta.summary ?? ''}
      slug={slug}
      price={meta.price ? `（${meta.price}）` : ''}
    />)
    publicHtml = `${newHead}${config.header}${teaser}${config.footer}`
  }

  return {
    slug,
    dateSlug,
    meta,
    markdown: md.trim(),
    publicHtml,
    premiumPage,
  }
}

function groupTags(posts: CollectedPost[], author: string): BlogData['tags'] {
  const tags: BlogData['tags'] = {}
  for (const post of posts) {
    for (const tag of post.meta.tags ?? []) {
      ;(tags[tag] ??= []).push({ tag, author, ...post.meta })
    }
  }
  return tags
}

function routeManifestForPosts(posts: CollectedPost[], tags: BlogData['tags'], totalHomePages: number): RouteManifestEntry[] {
  const routes: RouteManifestEntry[] = [
    { path: '/', file: 'index.html' },
    { path: '/index.html', file: 'index.html' },
    { path: '/about/', file: 'about/index.html' },
    { path: '/about/index.html', file: 'about/index.html' },
    { path: '/archive/', file: 'archive/index.html' },
    { path: '/archive/index.html', file: 'archive/index.html' },
    { path: '/tags/', file: 'tags/index.html' },
    { path: '/tags/index.html', file: 'tags/index.html' },
    { path: '/404.html', file: '404.html', allowStatus: 404 },
    { path: '/feed.xml', file: 'feed.xml' },
    { path: '/sitemap.xml', file: 'sitemap.xml' },
    { path: '/robots.txt', file: 'robots.txt' },
  ]

  for (let page = 2; page <= totalHomePages; page++) {
    routes.push(
      { path: `/home/${page}/`, file: `home/${page}/index.html` },
      { path: `/home/${page}/index.html`, file: `home/${page}/index.html` },
    )
  }

  for (const tag of Object.keys(tags)) {
    const encoded = encodeURIComponent(tag)
    routes.push(
      { path: `/tags/${encoded}/`, file: `tags/${tag}/index.html` },
      { path: `/tags/${encoded}/index.html`, file: `tags/${tag}/index.html` },
    )
  }

  for (const post of posts) {
    routes.push(
      { path: `/posts/${post.dateSlug}/`, file: `posts/${post.dateSlug}/index.html` },
      { path: `/posts/${post.dateSlug}/index.html`, file: `posts/${post.dateSlug}/index.html` },
    )
  }

  return routes
}

export async function collectBlogData(config: BuildConfig): Promise<BlogData> {
  const postsUrl = new URL('./posts/', config.src)
  const entries = (await readdir(postsUrl, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name))

  const posts: CollectedPost[] = []
  for (const entry of entries) posts.push(await collectPost(config, entry, postsUrl))

  posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  const content: Record<string, ApiContent> = {}
  const premium: Record<string, PremiumContent> = {}
  for (const post of posts) {
    if (post.meta.paid) {
      if (post.premiumPage) premium[post.slug] = post.premiumPage
      continue
    }
    const { title, date, tags, summary } = post.meta
    content[post.slug] = {
      slug: post.slug,
      title,
      date,
      tags,
      summary,
      markdown: post.markdown,
    }
  }

  const tags = groupTags(posts, config.author)
  const totalHomePages = Math.max(1, Math.ceil(posts.length / 8))

  return {
    posts,
    meta: posts.map((post) => post.meta),
    tags,
    content,
    premium,
    routeManifest: routeManifestForPosts(posts, tags, totalHomePages),
  }
}

export async function emitWorkerContentModule(config: BuildConfig, data: BlogData): Promise<void> {
  const module = `// Generated by Hono SSG blog build. Do not edit.\n` +
    `export const content = ${JSON.stringify(data.content, null, 2)}\n` +
    `export const premium = ${JSON.stringify(data.premium, null, 2)}\n`

  const workerDir = new URL('../worker/', config.src)
  await mkdir(workerDir, { recursive: true })
  await writeFile(new URL('content.generated.js', workerDir), module)
}
