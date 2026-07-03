import { readFile } from 'node:fs/promises'
import { exists } from './node-fs.ts'
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
