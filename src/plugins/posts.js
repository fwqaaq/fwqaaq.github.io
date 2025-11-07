import { markdown } from '../util/remark/markdown.js'
import { giscus } from '../util/template.js'
import { templateArticle } from '../util/template.js'
import { handleUTC, parseYaml, replaceHead } from '../util/utils.js'
import { ensureFile, exists } from 'fs'
import { readAll } from '@std/io'
import { format } from 'datetime'

const postsDate = (date) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
const dateRegex = /^(date:\s*)(.+)$/m
const decoder = new TextDecoder()
const encoder = new TextEncoder()

export const postPlugin = {
  name: 'post',
  /**@type {import("../util/type.js").MetaData[]} */
  metaData: [],
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    core.addhook(
      'beforeBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, src, version, header, footer } = config

        const posts = new URL('./posts/', src)
        const iter = Deno.readDir(posts)[Symbol.asyncIterator]()

        while (true) {
          const { value, done } = await iter.next()
          if (done) break

          const filePath = import.meta.resolve(new URL(value.name, posts))
            .slice(7)
          // Get updated date
          const command = new Deno.Command('git', {
            args: [
              'log',
              '-1',
              '--format=%ad',
              '--date=iso-strict',
              '--',
              filePath,
            ],
            stdout: 'piped',
          })

          const { code, stdout, stderr } = await command.output()

          if (code !== 0) {
            throw new Error(`Git command failed: ${decoder.decode(stderr)}`)
          }
          const updated = postsDate(decoder.decode(stdout).trim())

          using file = await Deno.open(filePath, {
            read: true,
            write: true,
          })

          // Read file: don't use getReader, as it will release the file resource when done
          const fileBytes = await readAll(file)
          let postContent = decoder.decode(fileBytes)

          const dates = postContent.match(dateRegex)

          const needswrite = !!dates[2] &&
            (dates[2].slice(0, 10) !== updated.slice(0, 10)) &&
            (new Date(dates[2]) > new Date('2025-11-09'))

          if (needswrite) {
            // Write updated date back to file
            postContent = postContent.replace(dateRegex, `$1${updated}`)

            await file.seek(0, Deno.SeekMode.Start)

            await file.truncate(0)
            await file.write(encoder.encode(postContent))
          }

          const [meta, md] = parseYaml(postContent)
          const description = md.trim().slice(10, 100).replace(/\n/g, ' ') +
            '...'
          const { title, date, tags } = meta

          // Handle the posts
          const postDist = new URL(
            `./posts/${handleUTC(date)}/index.html`,
            dist,
          )
          if (!await exists(postDist)) await ensureFile(postDist)

          const keywords = tags.join(', ')
          const head = await replaceHead({
            keywords,
            description,
            title,
            version,
            url: `${config.website}/posts/${handleUTC(date)}/`,
          })
          const content = templateArticle({
            content: await markdown(md),
            title,
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
