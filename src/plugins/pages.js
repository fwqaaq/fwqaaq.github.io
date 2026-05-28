import { ensureDir } from '@std/fs'
import {
  convertToUSA,
  generateArchiveTimelinePage,
  generatePage,
  generateTags,
  handleUTC,
  replaceBody,
  replaceHead,
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
        const { dist, version, header, footer, src, author, website, head } =
          config
        const newHead = replaceHead({
          keywords: 'fwqaaq, blog, about, fwqaaq blog',
          description: 'fwqaaq 的个人博客',
          title: 'fwqaaq 的博客',
          version,
          url: website,
          author,
        }, head)

        // handle the about page
        const aboutURL = new URL('./about/index.html', src)
        const aboutPage = replaceBody(newHead, header, footer, aboutURL)
        await ensureDir(new URL('./about/', dist))
        await Deno.writeTextFile(new URL('./about/index.html', dist), aboutPage)

        // Handle the tags
        const groupTags = Object.groupBy(
          meta.flatMap((item) =>
            item.tags.map((tag) => ({ tag, author, ...item }))
          ),
          (item) => item.tag,
        )

        await Promise.all([
          generateArchiveTimelinePage({
            meta: meta.map((item) => ({ author, ...item })),
            head,
            ...config,
          }),
          generatePage({ group: groupTags, basePath: 'tags', head, ...config }),
        ])

        // index home temeplate url
        const homeURL = new URL('../index.html', src)

        // handle the 404
        const indexPage = replaceBody(newHead, header, footer, homeURL)
        const notFound = indexPage.replace(
          '<!-- Template -->',
          `<section class="not-found">
        <h1>404 - 页面未找到</h1>
        <p>抱歉，您请求的页面不存在或已被移除。</p>
        </section>`,
        )
        await Deno.writeTextFile(new URL('./404.html', dist), notFound)

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
              author,
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
