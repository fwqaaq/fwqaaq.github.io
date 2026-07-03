import { markdown } from '../util/remark/markdown.js'
import { templateArticle, templateTeaser } from '../util/template.js'
import { handleUTC, parseYaml, replaceHead } from '../util/utils.js'
import { createGiscus } from '../util/site.js'
import { execFile } from 'node:child_process'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { ensureFile, exists } from '../util/node-fs.js'
import { format } from '../util/utils.js'

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
const updateRegex = /^(updateAt:\s*)(.+)$/m
const execFileAsync = promisify(execFile)

export const postPlugin = {
  name: 'post',
  /**@type {import("../util/type.js").MetaData[]} */
  metaData: [],
  /**
   * Full rendered HTML of paid posts, keyed by slug. Consumed by the
   * api-content plugin and served by the Worker only after payment.
   * @type {Record<string, { title: string, html: string }>}
   */
  premiumPages: {},
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    core.addhook(
      'beforeBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, src, version, header, footer, website, author, head } =
          config

        const posts = new URL('./posts/', src)
        const entries = await readdir(posts, { withFileTypes: true })

        for (const value of entries) {
          if (!value.isFile() || !value.name.endsWith('.md')) continue

          const filePath = fileURLToPath(new URL(value.name, posts))
          // Get updated date
          let gitDate = ''
          try {
            const { stdout } = await execFileAsync('git', [
              'log',
              '-1',
              '--format=%ad',
              '--date=iso-strict',
              '--',
              filePath,
            ])
            gitDate = stdout.trim()
          } catch (error) {
            throw new Error(`Git command failed: ${error.stderr ?? error.message}`)
          }
          // Untracked/uncommitted posts have no git date; keep frontmatter's.
          const updated = gitDate ? formatDate(gitDate) : null

          let postContent = await readFile(filePath, 'utf8')

          const matches = postContent.match(updateRegex)
          const updateAt = matches ? matches[2].trim() : null
          const oneDay = 24 * 60 * 60 * 1000

          if (
            updated &&
            (!updateAt || +new Date(updateAt) + oneDay < +new Date(updated))
          ) {
            postContent = postContent.replace(
              updateRegex,
              `updateAt: ${updated}`,
            )
            await writeFile(filePath, postContent)
          }

          const [meta, md] = parseYaml(postContent)
          const slug = value.name.replace(/\.md$/, '')
          // Paid posts must not leak body text into the meta description.
          const description = meta.paid
            ? (meta.summary ?? '')
            : md.trim().slice(10, 100).replace(/\n/g, ' ') + '...'
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
              <div class="post-time"><i class="fa-solid fa-clock"></i> ${
            formatDate(date).slice(0, 10)
          }</div> 
              <div class="post-update-time"><i class="fa-solid fa-clock-rotate-left"></i> ${
            updateAt.slice(0, 10)
          }</div>
            </div>`
          const content = templateArticle({
            content: await markdown(md, {
              sponsorUrl: config.site?.sponsor?.url,
            }),
            title,
            giscus: createGiscus(config.site?.giscus),
            postMeta,
          })
          const fullPost = `${newHead}${header}${content}${footer}`

          let post = fullPost
          if (meta.paid) {
            const price = meta.price
            // Stash the full page for the Worker; write only a teaser to dist.
            this.premiumPages[slug] = { title, html: fullPost, price }
            const teaser = templateTeaser({
              title,
              postMeta,
              summary: meta.summary ?? '',
              slug,
              price: price ? `（${price}）` : '',
            })
            post = `${newHead}${header}${teaser}${footer}`
          }

          await writeFile(postDist, post)

          this.metaData.push(meta)
        }

        this.metaData.sort((a, b) => new Date(b.date) - new Date(a.date))
      },
    )
  },
}
