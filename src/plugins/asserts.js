import { compileCss } from '../util/utils.js'
import { copy, ensureDir, ensureFile, exists } from 'fs'
import { replaceHead } from '../util/utils.js'

export const assertPlugin = {
  name: 'assert',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    core.addhook(
      'beforeBuild',
      async (/**@type {import("./core.js").Config} */ config) => {
        const { dist, src, version } = config

        await ensureDir(new URL('./public/', dist))
        for await (const entry of Deno.readDir(new URL('../public/', src))) {
          if (entry.name === 'css') continue
          const __src_p = new URL(`../public/${entry.name}`, src)
          const __dist_p = new URL(`./public/${entry.name}`, dist)
          if (entry.name === 'JavaScript') {
            await ensureFile(
              new URL(`./${entry.name}/index.${config.version}.js`, __dist_p),
            )
            await copy(
              new URL(`./${entry.name}/index.js`, __src_p),
              new URL(`./${entry.name}/index.${version}.js`, __dist_p),
              { overwrite: true },
            )
            continue
          }
          await copy(__src_p, __dist_p, { overwrite: true })
        }

        // compile the css
        const __css_d = new URL('./public/css/', dist)
        await ensureDir(__css_d)
        for await (
          const entry of Deno.readDir(new URL('../public/css/', src))
        ) {
          const path = new URL(`../public/css/${entry.name}`, src)
          const code = await compileCss(path)
          const fileName = entry.name.split('.').join(`.${config.version}.`)
          await Deno.writeFile(new URL(fileName, __css_d), code)
        }

        // about me
        const __dist_about = new URL('./about/index.html', dist)
        if (!await exists(__dist_about)) await ensureFile(__dist_about)
        const __src_about = new URL('./about/about.html', src)

        const about = await replaceHead(
          { version },
          await Deno.readTextFile(__src_about),
        )
        await Deno.writeTextFile(__dist_about, about)
      },
    )
  },
}
