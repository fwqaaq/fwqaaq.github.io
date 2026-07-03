/** @jsxImportSource hono/jsx */
import { readFile } from 'node:fs/promises'
import { exists } from './node-fs.ts'
import { renderJsx } from '../blog/components.tsx'
import type { SiteConfig } from '../types.ts'

const defaultSiteConfig = {
  author: 'blog',
  website: '/',
  title: 'Blog',
  description: '',
  keywords: [],
  rssDescription: '',
  profile: {
    name: 'blog',
    avatar: '',
    homepage: '/',
    tagline: '',
    chips: [],
    quote: { text: '', cite: '' },
    skills: [],
    projects: [],
    socials: [],
  },
  footer: {
    startYear: new Date().getFullYear(),
    licenseText: '© CC BY-SA',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.zh-hans',
    poweredByText: 'Node.ts',
    poweredByUrl: 'https://nodejs.org',
  },
  sponsor: {
    url: '',
  },
  ads: {
    enabled: false,
    title: '推荐链接',
    items: [],
  },
  giscus: {
    enabled: false,
  },
}

const currentYear = new Date().getFullYear()

const mergeConfig = (base: any, override: any): any => {
  if (!override || typeof override !== 'object') return base

  const merged = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      merged[key] = mergeConfig(base[key], value)
    } else {
      merged[key] = value
    }
  }

  return merged
}

export async function loadSiteConfig(configUrl: URL): Promise<SiteConfig> {
  if (!await exists(configUrl)) return structuredClone(defaultSiteConfig)

  const userConfig = JSON.parse(await readFile(configUrl, 'utf8'))
  return mergeConfig(structuredClone(defaultSiteConfig), userConfig)
}

export function withEnvSiteConfig(site: SiteConfig): SiteConfig {
  const website = process.env.WEBSITE || site.website
  const author = process.env.AUTHOR || site.author

  return {
    ...site,
    author,
    website,
    title: site.title || `${author} 的博客`,
    profile: {
      ...site.profile,
      name: site.profile?.name || author,
      homepage: site.profile?.homepage || website,
    },
  }
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const normalizeUrl = (value: unknown) => String(value ?? '').trim()

const withUrlProtocol = (value: unknown): string => {
  const url = normalizeUrl(value)
  if (!url) return ''
  return /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`
}

const getUrlHost = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const Icon = ({ icon }: { icon?: string }) =>
  icon ? <i class={icon} aria-hidden="true" /> : null

const renderSocialLinks = (socials: Array<any> = []) =>
  renderJsx(<>
    {socials.map(({ href, icon, label }) =>
      <a class="icon" href={normalizeUrl(href)} aria-label={label}>
        <Icon icon={icon} />
      </a>)}
  </>)

const renderChips = (chips: Array<any> = []) =>
  renderJsx(<>
    {chips.map(({ icon, label }) =>
      <span class="about-chip"><Icon icon={icon} /> {label}</span>)}
  </>)

const renderSkills = (skills: Array<any> = []) =>
  renderJsx(<>
    {skills.map(({ label, items = [], accent = [] }) => {
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
  </>)

const renderProjects = (projects: Array<any> = []) =>
  renderJsx(<>
    {projects.map(({ href, icon, title, description }) =>
      <a class="project-card" href={normalizeUrl(href)} target="_blank" rel="noopener">
        <div class="project-card-icon"><Icon icon={icon} /></div>
        <div class="project-card-body">
          <h3 class="project-card-title">{title}</h3>
          <p class="project-card-desc">{description}</p>
        </div>
        <i class="fa-solid fa-arrow-up-right-from-square project-card-link-icon" aria-hidden="true" />
      </a>)}
  </>)

const renderAds = (ads: any = {}) => {
  if (!ads.enabled || !Array.isArray(ads.items) || ads.items.length === 0) {
    return ''
  }

  const items = ads.items
    .map(({ title, url, description }) => {
      const href = withUrlProtocol(url)
      if (!href) return null

      const displayUrl = getUrlHost(href)
      const adTitle = title || displayUrl

      return <a class="site-ad-card" href={href} target="_blank" rel="noopener noreferrer sponsored">
        <span class="site-ad-label">AD</span>
        <span class="site-ad-title">{adTitle}</span>
        {description ? <p class="site-ad-desc">{description}</p> : null}
        <span class="site-ad-url">{displayUrl}</span>
      </a>
    })
    .filter(Boolean)

  if (items.length === 0) return ''

  return renderJsx(<aside class="site-ads" aria-label={ads.title}>
    <div class="site-ads-inner">
      <h2 class="site-ads-title">{ads.title}</h2>
      <div class="site-ads-grid">{items}</div>
    </div>
  </aside>)
}

export function renderSiteConfigScript(site: SiteConfig): string {
  const json = JSON.stringify({
    sponsor: site.sponsor,
    giscus: site.giscus,
  }).replaceAll('</', '<\\/')

  return renderJsx(
    <script
      dangerouslySetInnerHTML={{
        __html: `globalThis.__BLOG_CONFIG__=${json}`,
      }}
    />,
  )
}

export function renderSiteTemplate(template: string, site: SiteConfig): string {
  const profile = site.profile ?? {}
  const quote = profile.quote ?? {}
  const footer = site.footer ?? {}
  const escapedReplacements = {
    '{{site.author}}': site.author,
    '{{site.website}}': site.website,
    '{{site.title}}': site.title,
    '{{site.description}}': site.description,
    '{{profile.name}}': profile.name,
    '{{profile.avatar}}': profile.avatar,
    '{{profile.homepage}}': profile.homepage,
    '{{profile.tagline}}': profile.tagline,
    '{{profile.quote.text}}': quote.text,
    '{{profile.quote.cite}}': quote.cite,
    '{{footer.licenseText}}': footer.licenseText,
    '{{footer.licenseUrl}}': footer.licenseUrl,
    '{{footer.startYear}}': footer.startYear,
    '{{footer.currentYear}}': currentYear,
    '{{footer.poweredByText}}': footer.poweredByText,
    '{{footer.poweredByUrl}}': footer.poweredByUrl,
  }

  let rendered = template
  for (const [key, value] of Object.entries(escapedReplacements)) {
    rendered = rendered.replaceAll(key, escapeHtml(value))
    rendered = rendered.replaceAll(
      key.replace('{{', '{{ ').replace('}}', ' }}'),
      escapeHtml(value),
    )
  }
  for (
    const [key, value] of Object.entries({
      '<!-- profile.chips -->': renderChips(profile.chips),
      '<!-- profile.skills -->': renderSkills(profile.skills),
      '<!-- profile.projects -->': renderProjects(profile.projects),
      '<!-- profile.socials -->': renderSocialLinks(profile.socials),
      '<!-- site.ads -->': renderAds(site.ads),
      '<!-- site-config -->': renderSiteConfigScript(site),
    })
  ) {
    rendered = rendered.replaceAll(key, value)
  }

  return rendered
}

export function createGiscus(giscus: any = {}): string {
  if (!giscus.enabled) return ''

  const dataset = {
    repo: giscus.repo,
    repoId: giscus.repoId,
    category: giscus.category,
    categoryId: giscus.categoryId,
    mapping: giscus.mapping ?? 'pathname',
    strict: giscus.strict ?? '0',
    reactionsEnabled: giscus.reactionsEnabled ?? '1',
    emitMetadata: giscus.emitMetadata ?? '1',
    inputPosition: giscus.inputPosition ?? 'bottom',
    theme: giscus.theme ?? 'preferred_color_scheme',
    lang: giscus.lang ?? 'zh-CN',
  }

  if (
    !dataset.repo || !dataset.repoId || !dataset.category || !dataset.categoryId
  ) {
    return ''
  }

  const attributes = Object.fromEntries(
    Object.entries(dataset).map(([key, value]) => [
      `data-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`,
      String(value),
    ]),
  )

  return renderJsx(
    <script
      src="https://giscus.app/client.ts"
      {...attributes}
      crossorigin="anonymous"
      async
    />,
  )
}
