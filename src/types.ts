import type { Hono } from 'hono'

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
  header: string
  footer: string
  head: string
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

export interface CollectedPost {
  slug: string
  dateSlug: string
  meta: MetaData
  markdown: string
  publicHtml: string
  premiumPage: PremiumContent | null
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

export interface RouteManifestEntry {
  path: string
  file: string
  allowStatus?: number
}

export interface BlogData {
  posts: CollectedPost[]
  meta: MetaData[]
  tags: Record<string, Array<MetaData & { author: string; tag: string }>>
  content: Record<string, ApiContent>
  premium: Record<string, PremiumContent>
  routeManifest: RouteManifestEntry[]
}

export type BlogApp = Hono
