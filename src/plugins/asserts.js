import { copy, ensureDir, ensureFile, exists, walk } from 'fs'
import { replaceHead } from '../util/utils.js'
import { createProcessor } from '../util/utils.js'

export const assertPlugin = {
  name: 'assert',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    core.addhook(
      'beforeBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, src, version } = config

        const __css_d = new URL('./public/css/', dist)
        await ensureDir(new URL('./public/', dist))
        const postcssor = createProcessor()
        for await (const entry of walk(new URL('../public/', src))) {
          const __dist_p = entry.path.replace('public', 'dist/public')

          if (entry.name.includes('css') && entry.isFile) {
            const css = await Deno.readTextFile(entry.path)
            const result = await postcssor.process(css, { from: entry.path })

            await Deno.writeTextFile(
              __dist_p.replace('.css', `.${version}.css`),
              result.css,
            )
            continue
          }

          if (entry.name.includes('js') && entry.isFile) {
            await copy(
              entry.path,
              __dist_p.replace('.js', `.${version}.js`),
            )
            continue
          }

          if (entry.name.includes('html') && entry.isFile) {
            const html = await Deno.readTextFile(entry.path)
            html.replace(
              '<?-- index.css -->',
              `/public/resume/index.${version}.css`,
            )
            await Deno.writeTextFile(__dist_p, html)
            continue
          }

          // only copy the directory
          if (entry.isDirectory) {
            await ensureDir(__dist_p)
            continue
          }

          await copy(entry.path, __dist_p, {})
        }

        // about me
        const __dist_about = new URL('./about/index.html', dist)
        if (!await exists(__dist_about)) await ensureFile(__dist_about)
        const __src_about = new URL('./about/about.html', src)

        const about = await replaceHead(
          { version },
          await Deno.readTextFile(__src_about),
        )
        Deno.writeTextFile(__dist_about, about)
      },
    )
  },
}
