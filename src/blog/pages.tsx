/** @jsxImportSource hono/jsx */
import { convertToUSA, format, handleUTC } from '../util/utils.ts'
import { renderPage } from './layout.tsx'
import {
  ArchiveTimeline,
  Article,
  createGiscus,
  HomePostBox,
  Icon,
  NotFound,
  Pagination,
  PostMeta,
  renderJsx,
  TagLinks,
  TagPostList,
  Teaser,
} from './components.tsx'
import type { ApiContent, BlogData, BuildConfig, MetaData, Post, PremiumContent } from '../types.ts'

const POST_PER_PAGE = 8

const formatDate = (date: string | Date) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')

function pagedPosts(posts: Post[]): Post[][] {
  return Array.from(
    { length: Math.max(1, Math.ceil(posts.length / POST_PER_PAGE)) },
    (_, index) => posts.slice(index * POST_PER_PAGE, (index + 1) * POST_PER_PAGE),
  )
}

export function totalHomePages(posts: Post[]): number {
  return pagedPosts(posts).length
}

// --- home / 404 ---

export function homePage(config: BuildConfig, data: BlogData, pageNumber = 1): string {
  const groups = pagedPosts(data.posts)
  const totalPage = groups.length
  const index = Math.min(Math.max(pageNumber, 1), totalPage) - 1
  const posts = groups[index] ?? []

  return renderPage(config, {}, <main class="blog-main">
    <article>
      {posts.map(({ meta }) =>
        <HomePostBox
          author={config.author}
          place={`/./posts/${handleUTC(meta.date)}/`}
          time={convertToUSA(meta.date)}
          tags={meta.tags ?? []}
          title={meta.title}
          summary={meta.summary}
        />)}
      <Pagination
        before={index <= 1 ? '/' : `/./home/${index}/`}
        page={`${index + 1} / ${totalPage}`}
        after={index === totalPage - 1 ? '#' : `/./home/${index + 2}/`}
      />
    </article>
  </main>)
}

export function notFoundPage(config: BuildConfig): string {
  return renderPage(config, {}, <main class="blog-main">
    <article>
      <NotFound />
    </article>
  </main>)
}

// --- about ---

export function aboutPage(config: BuildConfig): string {
  const profile = config.site.profile ?? {}
  const quote = profile.quote ?? {}

  return renderPage(config, {}, <main class="about-main">
    <div class="about-container">
      <section class="about-profile">
        <img class="about-avatar" src={profile.avatar} alt={profile.name} />
        <div class="about-profile-info">
          <h1 class="about-name">{profile.name}</h1>
          <p class="about-tagline">{profile.tagline}</p>
          <div class="about-chips">
            {(profile.chips ?? []).map(({ icon, label }) =>
              <span class="about-chip"><Icon icon={icon} /> {label}</span>)}
          </div>
        </div>
      </section>

      <section class="about-quote">
        <blockquote>
          {quote.text}
          <cite>— {quote.cite}</cite>
        </blockquote>
      </section>

      <section class="about-section">
        <h2 class="about-section-title">技术栈</h2>
        {(profile.skills ?? []).map(({ label, items = [], accent = [] }) => {
          const accents = new Set(accent)
          return <div class="skill-category">
            <span class="skill-category-label">{label}</span>
            <div class="skill-group">
              {items.map((item) =>
                <span class={`skill-pill${accents.has(item) ? ' skill-pill-accent' : ''}`}>
                  {item}
                </span>)}
            </div>
          </div>
        })}
      </section>

      <section class="about-section">
        <h2 class="about-section-title">项目</h2>
        <div class="projects-grid">
          {(profile.projects ?? []).map(({ href, icon, title, description }) =>
            <a class="project-card" href={href} target="_blank" rel="noopener">
              <div class="project-card-icon"><Icon icon={icon} /></div>
              <div class="project-card-body">
                <h3 class="project-card-title">{title}</h3>
                <p class="project-card-desc">{description}</p>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square project-card-link-icon" aria-hidden="true" />
            </a>)}
        </div>
      </section>
    </div>
  </main>)
}

// --- archive ---

const toMonthKey = (date: string) => format(new Date(date), 'yyyy-MM')
const toDateKey = (date: string) => format(new Date(date), 'yyyy-MM-dd')
const toDayLabel = (date: string) => format(new Date(date), 'MM-dd')

const toMonthLabel = (date: string) => {
  const value = new Date(date)
  return `${value.getFullYear()} 年 ${value.getMonth() + 1} 月`
}

function createArchiveYears(meta: MetaData[]) {
  const sorted = [...meta].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const years = new Map<string, Map<string, MetaData[]>>()

  for (const item of sorted) {
    const year = String(new Date(item.date).getFullYear())
    const months = years.get(year) ?? new Map<string, MetaData[]>()
    years.set(year, months)
    const posts = months.get(toMonthKey(item.date)) ?? []
    months.set(toMonthKey(item.date), posts)
    posts.push(item)
  }

  return [...years.entries()].map(([year, months]) => ({
    year,
    monthCount: months.size,
    postCount: [...months.values()].reduce((total, items) => total + items.length, 0),
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
  }))
}

export function archivePage(config: BuildConfig, data: BlogData): string {
  const meta = data.posts.map((post) => post.meta)
  const years = [...new Set(meta.map((item) => new Date(item.date).getFullYear()))]
    .sort((a, b) => b - a)

  return renderPage(config, {
    keywords: years.join(', '),
    description: `${config.author} 的文章归档`,
    title: `${config.author} ~ archive`,
    url: `${config.website}archive/`,
  }, <Article
    title="archive"
    postMeta=""
    content={renderJsx(<ArchiveTimeline years={createArchiveYears(meta)} />)}
    giscus=""
  />)
}

// --- tags ---

export function tagsIndexPage(config: BuildConfig, data: BlogData): string {
  const entries = Object.entries(data.tags).sort(([, a], [, b]) => b.length - a.length)
  const keys = entries.map(([key]) => key)
  const counts = Object.fromEntries(entries.map(([key, value]) => [key, value.length]))

  return renderPage(config, {
    keywords: keys.join(', '),
    description: `${config.author} ~ tags`,
    title: `${config.author} ~ tags`,
    url: `${config.website}tags/`,
  }, <Article
    title="tags"
    postMeta=""
    content={renderJsx(<TagLinks tags={keys} basePath="tags" counts={counts} />)}
    giscus=""
  />)
}

export function tagPage(config: BuildConfig, data: BlogData, tag: string): string {
  const items = data.tags[tag] ?? []
  const posts = items.map(({ date, title }) => ({
    href: `/./posts/${handleUTC(date)}/index.html`,
    title,
    date: convertToUSA(date),
  }))

  return renderPage(config, {
    keywords: [...new Set(items.flatMap((item) => item.tags ?? []))].join(', '),
    description: `${config.author} ~ ${tag}`,
    title: `${config.author} ~ ${tag}`,
    url: `${config.website}tags/${encodeURIComponent(tag)}/`,
  }, <Article
    title={tag}
    postMeta=""
    content={renderJsx(<TagPostList posts={posts} />)}
    giscus=""
  />)
}

// --- posts ---

function postPageMeta(config: BuildConfig, post: Post) {
  const { meta, markdown, dateSlug } = post
  return {
    keywords: (meta.tags ?? []).join(', '),
    description: meta.paid
      ? (meta.summary ?? '')
      : `${markdown.slice(10, 100).replace(/\n/g, ' ')}...`,
    title: meta.title,
    url: `${config.website}posts/${dateSlug}/`,
  }
}

function postMetaHtml(config: BuildConfig, meta: MetaData): string {
  return renderJsx(<PostMeta
    author={config.author}
    date={formatDate(meta.date).slice(0, 10)}
    updateAt={String(meta.updateAt ?? meta.date).slice(0, 10)}
  />)
}

export function postPage(config: BuildConfig, post: Post): string {
  return renderPage(config, postPageMeta(config, post), <Article
    title={post.meta.title}
    postMeta={postMetaHtml(config, post.meta)}
    content={post.contentHtml}
    giscus={createGiscus(config.site.giscus)}
  />)
}

export function teaserPage(config: BuildConfig, post: Post): string {
  const { meta, slug } = post
  return renderPage(config, postPageMeta(config, post), <Teaser
    title={meta.title}
    postMeta={postMetaHtml(config, meta)}
    summary={meta.summary ?? ''}
    slug={slug}
    price={meta.price ? `（${meta.price}）` : ''}
  />)
}

// --- xml / txt (string templates by design) ---

const escapeXml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export function feedXml(config: BuildConfig, data: BlogData): string {
  const items = data.posts.map(({ meta }) => {
    const url = `${config.website}posts/${handleUTC(meta.date)}/`
    return `<item>
<title>${escapeXml(meta.title)}</title>
<link>${url}</link>
<description>${escapeXml(meta.summary ?? '')}</description>
<pubDate>${new Date(meta.date).toUTCString()}</pubDate>
</item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${escapeXml(config.author)}'s blog</title>
  <link>${config.website}</link>
  <description>${escapeXml(config.site.rssDescription ?? '')}</description>
  ${items}
</channel>
</rss>
`
}

export function sitemapXml(config: BuildConfig, data: BlogData): string {
  const urls = data.posts
    .map((post) => `<url><loc>${config.website}posts/${post.dateSlug}/</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function robotsTxt(config: BuildConfig): string {
  return `User-agent: *\nAllow: /\nSitemap: ${config.website}sitemap.xml`
}

// --- site inventory ---

/** The complete list of files the static site consists of. */
export function buildPages(config: BuildConfig, data: BlogData): Array<[string, string]> {
  const pages: Array<[string, string]> = [
    ['index.html', homePage(config, data)],
    ['about/index.html', aboutPage(config)],
    ['archive/index.html', archivePage(config, data)],
    ['tags/index.html', tagsIndexPage(config, data)],
    ['404.html', notFoundPage(config)],
    ['feed.xml', feedXml(config, data)],
    ['sitemap.xml', sitemapXml(config, data)],
    ['robots.txt', robotsTxt(config)],
  ]

  for (let page = 2; page <= totalHomePages(data.posts); page++) {
    pages.push([`home/${page}/index.html`, homePage(config, data, page)])
  }
  for (const tag of Object.keys(data.tags)) {
    pages.push([`tags/${tag}/index.html`, tagPage(config, data, tag)])
  }
  for (const post of data.posts) {
    pages.push([
      `posts/${post.dateSlug}/index.html`,
      post.meta.paid ? teaserPage(config, post) : postPage(config, post),
    ])
  }

  return pages
}

/** Data consumed by the Cloudflare worker (content.generated.js). */
export function buildWorkerContent(config: BuildConfig, data: BlogData): {
  content: Record<string, ApiContent>
  premium: Record<string, PremiumContent>
} {
  const content: Record<string, ApiContent> = {}
  const premium: Record<string, PremiumContent> = {}

  for (const post of data.posts) {
    const { slug, meta, markdown } = post
    if (meta.paid) {
      premium[slug] = {
        slug,
        title: meta.title,
        html: postPage(config, post),
        ...(meta.price ? { price: meta.price } : {}),
      }
      continue
    }
    content[slug] = {
      slug,
      title: meta.title,
      date: meta.date,
      tags: meta.tags,
      summary: meta.summary,
      markdown,
    }
  }

  return { content, premium }
}
