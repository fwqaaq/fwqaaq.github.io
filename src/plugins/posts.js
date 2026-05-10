import { markdown } from '../util/remark/markdown.js'
import { giscus } from '../util/template.js'
import { templateArticle } from '../util/template.js'
import { handleUTC, parseYaml, replaceHead } from '../util/utils.js'
import { ensureFile, exists } from '@std/fs'
import { readAll } from '@std/io'
import { format } from '@std/datetime'

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
const updateRegex = /^(updateAt:\s*)(.+)$/m
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
        const { dist, src, version, header, footer, website, author, head } =
          config

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
          const updated = formatDate(decoder.decode(stdout).trim())

          using file = await Deno.open(filePath, {
            read: true,
            write: true,
          })

          // Read file: don't use getReader, as it will release the file resource when done
          const fileBytes = await readAll(file)
          let postContent = decoder.decode(fileBytes)

          const matches = postContent.match(updateRegex)
          const updateAt = matches ? matches[2].trim() : null
          const oneDay = 24 * 60 * 60 * 1000

          if (
            !updateAt ||
            +new Date(updateAt) + oneDay < +new Date(updated)
          ) {
            postContent = postContent.replace(
              updateRegex,
              `updateAt: ${updated}`,
            )
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
          const url = `${website}/posts/${handleUTC(date)}/`
          const newHead = replaceHead({
            keywords,
            description,
            title,
            version,
            url,
            author,
          }, head)
          const postMeta = `<div class="post-meta post-meta-flex-around">
              <div class="post-author" href="/./about/"><i class="fa-solid fa-user"></i> ${author}</div> 
              <div class="post-time"><i class="fa-solid fa-clock"></i> ${formatDate(date).slice(0, 10)
            }</div> 
              <div class="post-update-time"><i class="fa-solid fa-clock-rotate-left"></i> ${updateAt.slice(0, 10)
            }</div>
            </div>`
          const content = templateArticle({
            content: await markdown(md),
            title,
            giscus,
            postMeta,
          })
          const post = `${newHead}${header}${content}${footer}`

          await Deno.writeTextFile(postDist, post)

          this.metaData.push(meta)
        }

        this.metaData.sort((a, b) => new Date(b.date) - new Date(a.date))
      },
    )
  },
}
