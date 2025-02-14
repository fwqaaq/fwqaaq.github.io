import { markdown } from '../util/remark/markdown.js'
import { giscus } from '../util/template.js'
import { templateArticle } from '../util/template.js'
import { handleUTC, parseYaml, replaceHead } from '../util/utils.js'
import { ensureFile, exists } from 'fs'

export const postPlugin = {
  name: 'post',
  metaData: [],
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    core.addhook(
      'beforeBuild',
      async (/**@type {import("./core.js").Config} */ config) => {
        const { dist, src, version, header, footer } = config

        const posts = new URL('./posts/', src)
        const iter = Deno.readDir(posts)[Symbol.asyncIterator]()

        while (true) {
          const { value, done } = await iter.next()
          if (done) break
          const postContent = await Deno.readTextFile(
            new URL(value.name, posts),
          )

          const [meta, md] = parseYaml(postContent)
          const { title, summary, date, tags } = meta

          // Handle the posts
          const postDist = new URL(
            `./posts/${handleUTC(date)}/index.html`,
            dist,
          )
          if (!await exists(postDist)) await ensureFile(postDist)

          const head = await replaceHead({
            keywords: tags.join(', '),
            description: summary,
            title,
            version,
          })
          const content = templateArticle({
            title,
            content: await markdown(md),
            giscus,
          })
          const post = `${head}${header}${content}${footer}`

          await Deno.writeTextFile(postDist, post)

          this.metaData.push(meta)
        }

        this.metaData.sort((a, b) => new Date(b.date) - new Date(a.date))
      },
    )
  },
}
