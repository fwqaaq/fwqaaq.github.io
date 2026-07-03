/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import {
  convertToUSA,
  handleUTC,
  replaceBody,
  replaceHead,
} from '../util/utils.ts'
import { getRss } from '../util/template.ts'
import { renderSiteTemplate } from '../util/site.ts'
import type { BuildConfig, BlogData, MetaData } from '../types.ts'
import {
  ArchiveTimeline,
  Article,
  HomePostBox,
  NotFound,
  Pagination,
  renderJsx,
  TagLinks,
  TagPostList,
} from './components.tsx'

const POST_PER_PAGE = 8

function html(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

function xml(body: string) {
  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  })
}

function text(body: string) {
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

function siteHead(config: BuildConfig, { keywords, description, title, url }: { keywords?: string; description?: string; title?: string; url?: string }) {
  return replaceHead({
    keywords,
    description,
    title,
    version: config.version,
    url,
    author: config.author,
  }, config.head)
}

function homeShell(config: BuildConfig) {
  const head = siteHead(config, {
    keywords: config.site?.keywords?.join(', ') ??
      `${config.author}, blog, ${config.author} blog`,
    description: config.site?.description ?? `${config.author} 的个人博客`,
    title: config.site?.title ?? `${config.author} 的博客`,
    url: config.website,
  })
  return replaceBody(
    head,
    config.header,
    config.footer,
    new URL('../index.html', config.src),
  )
}

function pagedPosts(posts: BlogData['posts']) {
  return Array.from(
    { length: Math.max(1, Math.ceil(posts.length / POST_PER_PAGE)) },
    (_, index) => posts.slice(index * POST_PER_PAGE, (index + 1) * POST_PER_PAGE),
  )
}

function renderHomePage(config: BuildConfig, data: BlogData, pageNumber = 1) {
  const shell = homeShell(config)
  const groups = pagedPosts(data.posts)
  const totalPage = groups.length
  const index = Math.min(Math.max(pageNumber, 1), totalPage) - 1
  const metaData = groups[index] ?? []
  const content = renderJsx(<>
    {metaData.map(({ meta }) =>
      <HomePostBox
        author={config.author}
        place={`/./posts/${handleUTC(meta.date)}/`}
        time={convertToUSA(meta.date)}
        tags={meta.tags ?? []}
        title={meta.title}
        summary={meta.summary}
      />
    )}
    <Pagination
      before={index <= 1 ? '/' : `/./home/${index}/`}
      page={`${index + 1} / ${totalPage}`}
      after={index === totalPage - 1 ? '#' : `/./home/${index + 2}/`}
    />
  </>)
  return shell.replace('<!-- Template -->', content)
}

function renderAboutPage(config: BuildConfig) {
  const head = siteHead(config, {
    keywords: config.site?.keywords?.join(', ') ??
      `${config.author}, blog, ${config.author} blog`,
    description: config.site?.description ?? `${config.author} 的个人博客`,
    title: config.site?.title ?? `${config.author} 的博客`,
    url: config.website,
  })
  return renderSiteTemplate(
    replaceBody(head, config.header, config.footer, new URL('./about/index.html', config.src)),
    config.site,
  )
}

const toMonthKey = (date: string) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`
}

const toMonthLabel = (date: string) => {
  const value = new Date(date)
  return `${value.getFullYear()} 年 ${value.getMonth() + 1} 月`
}

const toDateKey = (date: string) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

const toDayLabel = (date: string) => {
  const value = new Date(date)
  return `${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function createArchiveYears(meta: MetaData[]) {
  const sortedMeta = [...meta].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const years = new Map<string, Map<string, MetaData[]>>()

  for (const item of sortedMeta) {
    const year = String(new Date(item.date).getFullYear())
    const month = toMonthKey(item.date)
    if (!years.has(year)) years.set(year, new Map())
    const months = years.get(year)!
    if (!months.has(month)) months.set(month, [])
    months.get(month).push(item)
  }

  return [...years.entries()].map(([year, months]) => {
    const monthCount = months.size
    const postCount = [...months.values()].reduce((total, items) => total + items.length, 0)
    return {
      year,
      monthCount,
      postCount,
      months: [...months.entries()].map(([month, posts]) => ({
        month,
        label: toMonthLabel(posts[0].date),
        posts: posts.map(({ date, title }) => ({
          href: `/./posts/${handleUTC(date)}/index.html`,
          dateKey: toDateKey(date),
          day: toDayLabel(date),
          title,
        })),
      })),
    }
  })
}

function renderArchivePage(config: BuildConfig, data: BlogData) {
  const years = [...new Set(data.meta.map((item) => new Date(item.date).getFullYear()))]
    .sort((a, b) => Number(b) - Number(a))
  const archiveHead = siteHead(config, {
    keywords: years.join(', '),
    description: `${config.author} 的文章归档`,
    title: `${config.author} ~ archive`,
    url: `${config.website}archive/`,
  })
  const body = renderJsx(<Article
    title="archive"
    postMeta=""
    content={renderJsx(<ArchiveTimeline years={createArchiveYears(data.meta)} />)}
    giscus=""
  />)
  return `${archiveHead}${config.header}${body}${config.footer}`
}

function sortedTagEntries(tags: BlogData['tags']) {
  return Object.entries(tags).sort(([, a], [, b]) => b.length - a.length)
}

function renderTagsIndexPage(config: BuildConfig, data: BlogData) {
  const entries = sortedTagEntries(data.tags)
  const keys = entries.map(([key]) => key)
  const counts = Object.fromEntries(entries.map(([key, value]) => [key, value.length]))
  const head = siteHead(config, {
    keywords: keys.join(', '),
    description: `${config.author} ~ tags`,
    title: `${config.author} ~ tags`,
    url: `${config.website}tags/`,
  })
  const body = renderJsx(<Article
    title="tags"
    postMeta=""
    content={renderJsx(<TagLinks tags={keys} basePath="tags" counts={counts} />)}
    giscus=""
  />)
  return `${head}${config.header}${body}${config.footer}`
}

function renderTagPage(config: BuildConfig, data: BlogData, tag: string) {
  const items = data.tags[tag]
  if (!items) return null
  const itemHead = siteHead(config, {
    keywords: [...new Set(items.flatMap((item) => item.tags ?? []))].join(', '),
    description: `${config.author} ~ ${tag}`,
    title: `${config.author} ~ ${tag}`,
    url: `${config.website}tags/${encodeURIComponent(tag)}/`,
  })
  const posts = items.map(({ date, title }) => ({
    href: `/./posts/${handleUTC(date)}/index.html`,
    title,
    date: convertToUSA(date),
  }))
  const body = renderJsx(<Article
    title={tag}
    postMeta=""
    content={renderJsx(<TagPostList posts={posts} />)}
    giscus=""
  />)
  return `${itemHead}${config.header}${body}${config.footer}`
}

function renderNotFoundPage(config: BuildConfig) {
  const shell = homeShell(config)
  return shell.replace('<!-- Template -->', renderJsx(<NotFound />))
}

function renderSitemap(config: BuildConfig, data: BlogData) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${
    data.meta.reduce(
      (acc, { date }) => `${acc}<url><loc>${config.website}posts/${handleUTC(date)}/</loc></url>`,
      '',
    )
  }\n</urlset>`
}

function renderFeed(config: BuildConfig, data: BlogData) {
  const rssItem = data.meta.reduce((acc, { date, title, summary }) => {
    const url = `${config.website}posts/${handleUTC(date)}/`
    return acc + `<item>\n<title>${title}</title>\n<link>${url}</link>\n<description>${summary}</description>\n<pubDate>${
      new Date(date).toUTCString()
    }</pubDate>\n</item>`
  }, '')
  return getRss(config.author, config.website, rssItem, config.site?.rssDescription)
}

function routeHtmlAliases(app: Hono, paths: string[], handler: any) {
  for (const path of paths) app.get(path, handler)
}

export function createBlogApp(config: BuildConfig, data: BlogData): Hono {
  const app = new Hono()

  routeHtmlAliases(app, ['/', '/index.html'], () => html(renderHomePage(config, data)))

  routeHtmlAliases(app, ['/home/:page/', '/home/:page/index.html'], (c) => {
    const page = Number(c.req.param('page'))
    if (!Number.isInteger(page) || page < 1 || page > pagedPosts(data.posts).length) {
      return html(renderNotFoundPage(config), 404)
    }
    return html(renderHomePage(config, data, page))
  })

  routeHtmlAliases(app, ['/about/', '/about/index.html'], () => html(renderAboutPage(config)))
  routeHtmlAliases(app, ['/archive/', '/archive/index.html'], () => html(renderArchivePage(config, data)))
  routeHtmlAliases(app, ['/tags/', '/tags/index.html'], () => html(renderTagsIndexPage(config, data)))
  routeHtmlAliases(app, ['/tags/:tag/', '/tags/:tag/index.html'], (c) => {
    const page = renderTagPage(config, data, c.req.param('tag'))
    return page ? html(page) : html(renderNotFoundPage(config), 404)
  })
  routeHtmlAliases(app, ['/posts/:date/', '/posts/:date/index.html'], (c) => {
    const post = data.posts.find((item) => item.dateSlug === c.req.param('date'))
    return post ? html(post.publicHtml) : html(renderNotFoundPage(config), 404)
  })

  app.get('/404.html', () => html(renderNotFoundPage(config), 404))
  app.get('/feed.xml', () => xml(renderFeed(config, data)))
  app.get('/sitemap.xml', () => xml(renderSitemap(config, data)))
  app.get('/robots.txt', () => text(`User-agent: *\nAllow: /\nSitemap: ${config.website}sitemap.xml`))

  app.all('*', () => html(renderNotFoundPage(config), 404))

  return app
}
