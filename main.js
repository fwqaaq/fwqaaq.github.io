import { existsSync, rmSync, watch } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { config as loadEnv } from 'dotenv'
import { apiContentPlugin } from './src/plugins/api-content.js'
import { assertPlugin } from './src/plugins/asserts.js'
import { Core } from './src/plugins/core.js'
import { feedPlugin } from './src/plugins/feed.js'
import { pagesPlugin } from './src/plugins/pages.js'
import { postPlugin } from './src/plugins/posts.js'
import { startServer } from './src/util/utils.js'
import {
  loadSiteConfig,
  renderSiteTemplate,
  withEnvSiteConfig,
} from './src/util/site.js'

async function createConfig() {
  loadEnv()
  const site = withEnvSiteConfig(
    await loadSiteConfig(new URL('./site.config.json', import.meta.url)),
  )

  const baseConfig = {
    dist: import.meta.resolve('./dist/'),
    src: import.meta.resolve('./src/'),
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
async function main() {
  const distUrl = new URL(config.dist)
  if (existsSync(distUrl)) {
    rmSync(distUrl, { recursive: true, force: true })
  }
  const core = new Core()
  core.use(postPlugin)
    .use(apiContentPlugin)
    .use(assertPlugin)
    .use(feedPlugin)
    .use(pagesPlugin)
  await core.runHook('beforeBuild', config)
  await core.runHook('afterBuild', config)
}

/**
 * Watch public/ for CSS/JS changes and rebuild assets in DEV mode.
 * Node --watch restarts the full process for source/template changes; this
 * watcher keeps the original fast asset-only rebuild path for public assets.
 * @param {Awaited<ReturnType<typeof createConfig>>} config
 */
function watchPublicAssets(config) {
  const publicDir = new URL('./public/', import.meta.url)
  let timer = undefined

  watch(publicDir, { recursive: true }, (_eventType, filename) => {
    if (!filename) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      console.log('[watcher] public/ change detected, rebuilding assets...')
      try {
        const core = new Core()
        core.use(assertPlugin)
        await core.runHook('beforeBuild', config)
        console.log('[watcher] rebuild complete')
      } catch (err) {
        console.error('[watcher] rebuild failed:', err)
      }
    }, 300)
  })
}

const mode = process.env.MODE
if (mode === 'DEV' || mode === 'PRO') {
  await main()
}

if (mode === 'DEV') {
  watchPublicAssets(config)
}

if (mode === 'DEV' || mode === 'PRE') {
  startServer(config.port, config.version)
}
