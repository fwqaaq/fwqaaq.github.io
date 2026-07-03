import { existsSync, rmSync, watch } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { config as loadEnv } from 'dotenv'
import { createBlogApp } from './src/blog/app.tsx'
import { collectBlogData, emitWorkerContentModule } from './src/blog/data.tsx'
import { emitStaticRoutes } from './src/blog/emit.ts'
import { emitAssets } from './src/build/assets.ts'
import { startServer } from './src/util/utils.ts'
import { loadSiteConfig, renderSiteTemplate, withEnvSiteConfig } from './src/util/site.ts'
import type { BuildConfig } from './src/types.ts'

async function createConfig(): Promise<BuildConfig> {
  loadEnv()
  const site = withEnvSiteConfig(
    await loadSiteConfig(new URL('./site.config.json', import.meta.url)),
  )

  const baseConfig = {
    dist: new URL('./dist/', import.meta.url).href,
    src: new URL('./src/', import.meta.url).href,
    website: site.website,
    author: site.author,
    port: process.env.PORT,
    version: Math.floor(Math.random() * 1000000),
    site,
  }

  const head = renderSiteTemplate(
    await readFile(new URL('./util/head.html', baseConfig.src), 'utf8'),
    site,
  )
  const header = renderSiteTemplate(
    await readFile(new URL('./util/header.html', baseConfig.src), 'utf8'),
    site,
  )
  const footer = renderSiteTemplate(
    await readFile(new URL('./util/footer.html', baseConfig.src), 'utf8'),
    site,
  )

  return { ...baseConfig, header, footer, head }
}

const config = await createConfig()

async function buildSite(): Promise<void> {
  const distUrl = new URL(config.dist)
  if (existsSync(distUrl)) {
    rmSync(distUrl, { recursive: true, force: true })
  }

  const data = await collectBlogData(config)
  await emitWorkerContentModule(config, data)
  await emitAssets(config)
  const app = createBlogApp(config, data)
  await emitStaticRoutes(app, data.routeManifest, config.dist)
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
