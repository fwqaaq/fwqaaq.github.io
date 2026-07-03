import { existsSync, rmSync, watch } from 'node:fs'
import { config as loadEnv } from 'dotenv'
import { loadBlogData } from './src/blog/posts.ts'
import { buildPages, buildWorkerContent } from './src/blog/pages.tsx'
import { emitWorkerContentModule, writePages } from './src/blog/emit.ts'
import { emitAssets } from './src/build/assets.ts'
import { startServer } from './src/util/utils.ts'
import { loadSiteConfig, withEnvSiteConfig } from './src/util/site.ts'
import type { BuildConfig } from './src/types.ts'

async function createConfig(): Promise<BuildConfig> {
  loadEnv()
  const site = withEnvSiteConfig(
    await loadSiteConfig(new URL('./site.config.json', import.meta.url)),
  )

  return {
    dist: new URL('./dist/', import.meta.url).href,
    src: new URL('./src/', import.meta.url).href,
    website: site.website,
    author: site.author,
    port: process.env.PORT,
    version: Math.floor(Math.random() * 1000000),
    site,
  }
}

const config = await createConfig()

async function buildSite(): Promise<void> {
  const distUrl = new URL(config.dist)
  if (existsSync(distUrl)) {
    rmSync(distUrl, { recursive: true, force: true })
  }

  const data = await loadBlogData(config)
  await emitWorkerContentModule(config.src, buildWorkerContent(config, data))
  await emitAssets(config)
  await writePages(config.dist, buildPages(config, data))
}

function watchPublicAssets(config: BuildConfig): void {
  const publicDir = new URL('./public/', import.meta.url)
  let timer: NodeJS.Timeout | undefined

  watch(publicDir, { recursive: true }, (_eventType, filename) => {
    if (!filename) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      console.log('[watcher] public/ change detected, rebuilding assets...')
      try {
        await emitAssets(config)
        console.log('[watcher] rebuild complete')
      } catch (err) {
        console.error('[watcher] rebuild failed:', err)
      }
    }, 300)
  })
}

const mode = process.env.MODE
if (mode === 'DEV' || mode === 'PRO') {
  await buildSite()
}

if (mode === 'DEV') {
  watchPublicAssets(config)
}

if (mode === 'DEV' || mode === 'PRE') {
  startServer(config.port, config.version)
}
