import { exists } from '@std/fs'

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
    poweredByText: 'Deno',
    poweredByUrl: 'https://deno.com',
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

const mergeConfig = (base, override) => {
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

export async function loadSiteConfig(configUrl) {
  if (!await exists(configUrl)) return structuredClone(defaultSiteConfig)

  const userConfig = JSON.parse(await Deno.readTextFile(configUrl))
  return mergeConfig(structuredClone(defaultSiteConfig), userConfig)
}

export function withEnvSiteConfig(site) {
  const website = Deno.env.get('WEBSITE') || site.website
  const author = Deno.env.get('AUTHOR') || site.author

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

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const normalizeUrl = (value) => String(value ?? '').trim()

const withUrlProtocol = (value) => {
  const url = normalizeUrl(value)
  if (!url) return ''
  return /^[a-z][a-z\d+.-]*:/i.test(url) ? url : `https://${url}`
}

const getUrlHost = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const renderIcon = (icon) =>
  icon ? `<i class="${escapeHtml(icon)}" aria-hidden="true"></i>` : ''

const renderSocialLinks = (socials = []) =>
  socials.map(({ href, icon, label }) =>
    `<a class="icon" href="${escapeHtml(normalizeUrl(href))}" aria-label="${
      escapeHtml(label)
    }">
      ${renderIcon(icon)}
    </a>`
  ).join('')

const renderChips = (chips = []) =>
  chips.map(({ icon, label }) =>
    `<span class="about-chip">${renderIcon(icon)} ${escapeHtml(label)}</span>`
  ).join('')

const renderSkills = (skills = []) =>
  skills.map(({ label, items = [], accent = [] }) => {
    const accents = new Set(accent)
    const pills = items.map((item) =>
      `<span class="skill-pill${
        accents.has(item) ? ' skill-pill-accent' : ''
      }">${escapeHtml(item)}</span>`
    ).join('')

    return `<div class="skill-category">
          <span class="skill-category-label">${escapeHtml(label)}</span>
          <div class="skill-group">${pills}</div>
        </div>`
  }).join('')

const renderProjects = (projects = []) =>
  projects.map(({ href, icon, title, description }) =>
    `<a class="project-card" href="${
      escapeHtml(normalizeUrl(href))
    }" target="_blank" rel="noopener">
            <div class="project-card-icon">${renderIcon(icon)}</div>
            <div class="project-card-body">
              <h3 class="project-card-title">${escapeHtml(title)}</h3>
              <p class="project-card-desc">${escapeHtml(description)}</p>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square project-card-link-icon" aria-hidden="true"></i>
          </a>`
  ).join('')

const renderAds = (ads = {}) => {
  if (!ads.enabled || !Array.isArray(ads.items) || ads.items.length === 0) {
    return ''
  }

  const items = ads.items
    .map(({ title, url, description }) => {
      const href = withUrlProtocol(url)
      if (!href) return ''

      const displayUrl = getUrlHost(href)
      const adTitle = title || displayUrl
      const desc = description
        ? `<p class="site-ad-desc">${escapeHtml(description)}</p>`
        : ''

      return `<a class="site-ad-card" href="${
        escapeHtml(href)
      }" target="_blank" rel="noopener noreferrer sponsored">
        <span class="site-ad-label">AD</span>
        <span class="site-ad-title">${escapeHtml(adTitle)}</span>
        ${desc}
        <span class="site-ad-url">${escapeHtml(displayUrl)}</span>
      </a>`
    })
    .join('')

  if (!items) return ''

  return `<aside class="site-ads" aria-label="${escapeHtml(ads.title)}">
    <div class="site-ads-inner">
      <h2 class="site-ads-title">${escapeHtml(ads.title)}</h2>
      <div class="site-ads-grid">${items}</div>
    </div>
  </aside>`
}

export function renderSiteConfigScript(site) {
  const json = JSON.stringify({
    sponsor: site.sponsor,
    giscus: site.giscus,
  }).replaceAll('</', '<\\/')

  return `<script>globalThis.__BLOG_CONFIG__=${json}</script>`
}

export function renderSiteTemplate(template, site) {
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

export function createGiscus(giscus = {}) {
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

  const attributes = Object.entries(dataset)
    .map(([key, value]) =>
      `data-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}="${
        escapeHtml(value)
      }"`
    )
    .join('\n        ')

  return `<script src="https://giscus.app/client.js"
        ${attributes}
        crossorigin="anonymous"
        async></script>`
}
