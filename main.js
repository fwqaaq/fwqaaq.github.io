import { apiContentPlugin } from './src/plugins/api-content.js'
import { assertPlugin } from './src/plugins/asserts.js'
import { Core } from './src/plugins/core.js'
import { feedPlugin } from './src/plugins/feed.js'
import { pagesPlugin } from './src/plugins/pages.js'
import { postPlugin } from './src/plugins/posts.js'
import { existsSync } from '@std/fs'
import { startServer } from './src/util/utils.js'
import { load } from 'dotenv'

async function createConfig() {
  await load({ export: true, defaults: true })

  const baseConfig = {
    dist: import.meta.resolve('./dist/'),
    src: import.meta.resolve('./src/'),
    website: Deno.env.get('WEBSITE'),
    author: Deno.env.get('AUTHOR'),
    port: Deno.env.get('PORT'),
    version: Math.floor(Math.random() * 1000000),
  }

  const head = await Deno.readTextFile(
    new URL('./util/head.html', baseConfig.src),
  )

  const header = await Deno.readTextFile(
    new URL('./util/header.html', baseConfig.src),
  )
  const footer = await Deno.readTextFile(
    new URL('./util/footer.html', baseConfig.src),
  )

  return { ...baseConfig, header, footer, head }
}

const config = await createConfig()
async function main() {
  if (existsSync(new URL(config.dist))) {
    Deno.removeSync(new URL(config.dist), { recursive: true })
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
 * Watch the public/ directory for changes and rebuild assets (CSS, JS).
 * Only active in DEV mode. Uses Deno.watchFs to detect file changes
 * that --unstable-hmr cannot see (files read via Deno.readTextFile at runtime).
 * @param {Awaited<ReturnType<typeof createConfig>>} config
 */
async function watchPublicAssets(config) {
  const publicDir = new URL('./public/', import.meta.url)
  const watcher = Deno.watchFs(publicDir.pathname, { recursive: true })
  let timer = undefined

  for await (const event of watcher) {
    if (event.kind === 'access') continue
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      console.log(
        '[watcher] public/ change detected, rebuilding assets...',
      )
      try {
        const core = new Core()
        core.use(assertPlugin)
        await core.runHook('beforeBuild', config)
        console.log('[watcher] rebuild complete')
      } catch (err) {
        console.error('[watcher] rebuild failed:', err)
      }
    }, 300)
  }
}

// Handle the http server
const mode = Deno.env.get('MODE')
if (mode === 'DEV' || mode === 'PRO') {
  main()
}

if (mode === 'DEV') {
  // Watch public/ for CSS/JS changes (not covered by --unstable-hmr)
  watchPublicAssets(config)
}

if (mode === 'DEV' || mode === 'PRE') {
  startServer(config.port)
}
