/** @jsxImportSource hono/jsx */
import { raw } from 'hono/html'

export function renderJsx(node) {
  return String(node)
}

export function Raw({ html = '' }) {
  return raw(html)
}

export function PostMeta({ author, date, updateAt }) {
  return <div class="post-meta post-meta-flex-around">
    <div class="post-author" href="/./about/"><i class="fa-solid fa-user" /> {author}</div>{' '}
    <div class="post-time"><i class="fa-solid fa-clock" /> {date}</div>{' '}
    <div class="post-update-time"><i class="fa-solid fa-clock-rotate-left" /> {updateAt}</div>
  </div>
}

export function Article({ title, postMeta, content = '', giscus = '' }) {
  return <>
    <main class="blog-main">
      <article class="blog-article">
        <h1>{title}</h1>
        <Raw html={postMeta} />
        <hr />
        <Raw html={content} />
      </article>
    </main>
    <Raw html={giscus} />
  </>
}

export function Teaser({ title, postMeta, summary, slug, price = '' }) {
  return <main class="blog-main">
    <article class="blog-article">
      <h1>{title}</h1>
      <Raw html={postMeta} />
      <hr />
      <p>{summary}</p>
      <div class="paywall-teaser">
        <p>🔒 这是一篇付费文章，解锁后可阅读全文。</p>
        <a class="paywall-unlock" href={`/premium/${slug}`}>解锁全文{price}</a>
      </div>
    </article>
  </main>
}

export function TagLinks({ tags = [], basePath = 'tags', counts = null }) {
  return <>
    {tags.map((tag) => <a class="tag" href={`/./${basePath}/${tag}/`}>
      <i class="fa-solid fa-tag" /> {tag}
      {counts ? <span class="tag-count">{counts[tag]}</span> : ''}
    </a>)}
  </>
}

export function HomePostBox({ author, place, time, tags = [], title, summary }) {
  return <section class="box">
    <h3><a class="decoration-line" href={place}>{title}</a></h3>
    <div class="post-meta">
      <a class="post-author" href="/./about/"><i class="fa-solid fa-user" /> {author} </a>发布于
      <div class="post-time"><i class="fa-solid fa-clock" /> {time}</div>
    </div>
    <p>{summary}</p>
    <div>
      <TagLinks tags={tags} />
    </div>
  </section>
}

export function Pagination({ before, page, after }) {
  return <section class="pages box">
    <a class="router" href={before}>ᐊ</a>
    <span>{page}</span>
    <a class="router" href={after}>ᐅ</a>
  </section>
}

export function ArchiveTimeline({ years }) {
  return <section class="archive-timeline" aria-label="文章归档时间线">
    {years.map(({ year, monthCount, postCount, months }, index) =>
      <details class="archive-year" open={index === 0}>
        <summary class="archive-year-head" aria-label={`${year}年归档`}>
          <span class="archive-year-node" aria-hidden="true" />
          <h2 class="archive-year-title">{year}</h2>
          <span class="archive-year-count">{monthCount} 个月 / {postCount} 篇</span>
          <i class="archive-year-chevron fa-solid fa-chevron-right" aria-hidden="true" />
        </summary>
        <ol class="archive-months">
          {months.map(({ month, label, posts }) =>
            <li class="archive-month">
              <div class="archive-month-head">
                <time class="archive-month-title" datetime={month}>{label}</time>
                <span class="archive-month-count">{posts.length} 篇</span>
              </div>
              <ul class="archive-posts">
                {posts.map(({ href, dateKey, day, title }) =>
                  <li class="archive-post">
                    <a class="archive-post-link" href={href}>
                      <time class="archive-post-day" datetime={dateKey}>{day}</time>
                      <span class="archive-post-title">{title}</span>
                    </a>
                  </li>
                )}
              </ul>
            </li>
          )}
        </ol>
      </details>
    )}
  </section>
}

export function TagPostList({ posts }) {
  return <div class="tag-post-list">
    {posts.map(({ href, title, date }) =>
      <a class="tag-post-item" href={href}>
        <span class="tag-post-title">{title}</span>
        <span class="tag-post-date">{date}</span>
      </a>
    )}
  </div>
}

export function NotFound() {
  return <section class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您请求的页面不存在或已被移除。</p>
  </section>
}
