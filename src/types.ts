export interface SiteProfile {
  name?: string
  avatar?: string
  homepage?: string
  tagline?: string
  quote?: { text?: string; cite?: string }
  chips?: Array<{ icon?: string; label?: string }>
  skills?: Array<{ label?: string; items?: string[]; accent?: string[] }>
  projects?: Array<{ href?: string; icon?: string; title?: string; description?: string }>
  socials?: Array<{ href?: string; icon?: string; label?: string }>
}

export interface SiteConfig {
  author: string
  website: string
  title: string
  description: string
  keywords: string[]
  rssDescription?: string
  profile?: SiteProfile
  footer?: {
    startYear?: number
    licenseText?: string
    licenseUrl?: string
    poweredByText?: string
    poweredByUrl?: string
  }
  sponsor?: { url?: string }
  ads?: {
    enabled?: boolean
    title?: string
    items?: Array<{ title?: string; url?: string; description?: string }>
  }
  giscus?: Record<string, unknown> & { enabled?: boolean }
}

export interface BuildConfig {
  src: string
  dist: string
  author: string
  website: string
  port?: string | number
  version: number
  site: SiteConfig
}

export interface MetaData {
  date: string
  title: string
  summary?: string
  tags?: string[]
  updateAt?: string
  paid?: boolean
  price?: string
}

export interface Post {
  slug: string
  dateSlug: string
  meta: MetaData
  markdown: string
  contentHtml: string
}

export interface ApiContent {
  slug: string
  title: string
  date: string
  tags?: string[]
  summary?: string
  markdown: string
}

export interface PremiumContent {
  slug: string
  title: string
  html: string
  price?: string
}

export interface BlogData {
  posts: Post[]
  tags: Record<string, MetaData[]>
}
