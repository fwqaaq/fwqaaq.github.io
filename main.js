import { assertPlugin } from './src/plugins/asserts.js'
import { Core } from './src/plugins/core.js'
import { feedPlugin } from './src/plugins/feed.js'
import { pagesPlugin } from './src/plugins/pages.js'
import { postPlugin } from './src/plugins/posts.js'
import { existsSync } from 'fs'
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

  const header = await Deno.readTextFile(
    new URL('./util/header.html', baseConfig.src),
  )
  const footer = await Deno.readTextFile(
    new URL('./util/footer.html', baseConfig.src),
  )

  return { ...baseConfig, header, footer }
}

const config = await createConfig()
async function main() {
  if (existsSync(new URL(config.dist))) {
    Deno.removeSync(new URL(config.dist), { recursive: true })
  }
  const core = new Core()
  core.use(postPlugin)
    .use(assertPlugin)
    .use(feedPlugin)
    .use(pagesPlugin)
  await core.runHook('beforeBuild', config)
  await core.runHook('afterBuild', config)
}

// Handle the http server
const mode = Deno.env.get('MODE')
if (mode === 'DEV' || mode === 'PRO') {
  main()
}

if (mode === 'DEV' || mode === 'PRE') {
  startServer(config.port)
}
