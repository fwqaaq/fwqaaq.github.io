import { ensureDir } from 'fs'
import { generatePage, replaceBody } from '../util/utils.js'
import { templateBox, templateProcess } from '../util/template.js'
import { convertToUSA, handleUTC } from '../util/utils.js'

export const pagesPlugin = {
  name: 'pages',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    /**@type {import("../util/type.js").MetaData[]} */
    const meta = core.plugins.get('post').metaData
    core.addhook(
      'afterBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, version, author, header, footer, src } = config

        // Handle the archive
        const groupArchive = Object.groupBy(
          meta,
          (item) => new Date(item.date).getFullYear(),
        )
        await generatePage({
          group: groupArchive,
          basePath: 'archive',
          dist,
          header,
          footer,
          version,
          author,
        })

        // Handle the tags
        const groupTags = Object.groupBy(
          meta.flatMap((item) => item.tags.map((tag) => ({ tag, ...item }))),
          (item) => item.tag,
        )
        await generatePage({
          group: groupTags,
          basePath: 'tags',
          dist,
          header,
          footer,
          version,
          author,
        })

        // Handle the home
        const POST_PER_PAGE = 8
        const groupMetaData = Array.from(
          { length: Math.ceil(meta.length / POST_PER_PAGE) },
          (_, index) =>
            meta.slice(index * POST_PER_PAGE, (index + 1) * POST_PER_PAGE),
        )
        const totalPage = groupMetaData.length

        /**@param {string[]} */
        const generateTags = (/**@type {string[]} */ tags) =>
          tags.reduce(
            (acc, tag) =>
              acc +
              `<a class="tag" href="/./tags/${tag}/"><i class="fa-solid fa-tag"></i> ${tag}</a>`,
            '',
          )
        const generateBox = (
          /**@type {import("../util/type.js").MetaData[]} */ meta,
        ) => {
          return meta.map(({ date, title, summary, tags }) => {
            return templateBox({
              place: `/./posts/${handleUTC(date)}/`,
              title,
              summary,
              time: convertToUSA(date),
              tags: generateTags(tags),
            })
          })
        }

        const indexPage = replaceBody(header, footer, version, src)
        for (const [index, metaData] of groupMetaData.entries()) {
          const content = generateBox(metaData).join('')
          const process = templateProcess({
            before: index <= 1 ? '/' : `/./home/${index}/`,
            page: `${index + 1} / ${totalPage}`,
            after: index === totalPage - 1 ? '#' : `/./home/${index + 2}/`,
          })
          const home = indexPage.replace('<!-- Template -->', content + process)
          const url = index === 0
            ? new URL('./index.html', dist)
            : new URL(`./home/${index + 1}/index.html`, dist)

          if (index !== 0) {
            await ensureDir(new URL(`./home/${index + 1}/`, dist))
          }
          await Deno.writeTextFile(url, home)
        }
      },
    )
  },
}
