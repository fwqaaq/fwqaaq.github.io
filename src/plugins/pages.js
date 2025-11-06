import { ensureDir } from 'fs'
import {
  convertToUSA,
  generatePage,
  generateTags,
  handleUTC,
  replaceBody,
} from '../util/utils.js'
import { templateBox, templateProcess } from '../util/template.js'

export const pagesPlugin = {
  name: 'pages',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    /**@type {import("../util/type.js").MetaData[]} */
    const meta = core.plugins.get('post').metaData
    core.addhook(
      'afterBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, version, header, footer, src } = config

        // Handle the archive
        const groupArchive = Object.groupBy(
          meta,
          (item) => new Date(item.date).getFullYear(),
        )

        // Handle the tags
        const groupTags = Object.groupBy(
          meta.flatMap((item) => item.tags.map((tag) => ({ tag, ...item }))),
          (item) => item.tag,
        )

        Promise.all([
          generatePage({ group: groupArchive, basePath: 'archive', ...config }),
          generatePage({ group: groupTags, basePath: 'tags', ...config }),
        ])

        // handle the 404
        const indexPage = replaceBody(header, footer, version, src)
        const notFound = indexPage.replace('<!-- Template -->',`<section style="display: flex; align-items: center; justify-content: center;">
        <h1>404 - 页面未找到</h1>
        <p>抱歉，您请求的页面不存在或已被移除。</p>
        <p><a href="/">返回首页</a></p>
      </section>`)
        await Deno.writeTextFile(new URL("./404.html", dist), notFound)
        
        // Handle the home
        const POST_PER_PAGE = 8
        const groupMetaData = Array.from(
          { length: Math.ceil(meta.length / POST_PER_PAGE) },
          (_, index) =>
            meta.slice(index * POST_PER_PAGE, (index + 1) * POST_PER_PAGE),
        )
        const totalPage = groupMetaData.length

        const generateBox = (
          /**@type {import("../util/type.js").MetaData[]} */ meta,
        ) =>
          meta.map(({ date, tags, ...args }) =>
            templateBox({
              place: `/./posts/${handleUTC(date)}/`,
              time: convertToUSA(date),
              tags: generateTags(tags),
              ...args,
            })
          )

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
