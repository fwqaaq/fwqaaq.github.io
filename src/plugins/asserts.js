import { readFile, writeFile } from 'node:fs/promises'
import { copy, ensureDir, walk } from '../util/node-fs.js'
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
            const css = await readFile(entry.path, 'utf8')
            const result = await postcssor.process(css, { from: entry.path })

            await writeFile(
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

          if (entry.path.includes('resume/index.html') && entry.isFile) {
            const html = (await readFile(entry.path, 'utf8')).replace(
              '<?-- index.css -->',
              `/public/resume/index.${version}.css`,
            )
            await writeFile(__dist_p, html)
            continue
          }

          // only copy the directory
          if (entry.isDirectory) {
            await ensureDir(__dist_p)
            continue
          }

          await copy(entry.path, __dist_p, {})
        }
      },
    )
  },
}
