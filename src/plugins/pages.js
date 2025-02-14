import { ensureDir } from 'fs'
import { replaceBody, generatePage } from '../util/utils.js'
import { templateBox, templateProcess } from '../util/template.js'
import { convertToUSA, handleUTC } from '../util/utils.js'


export const pagesPlugin = {
  name: 'pages',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    /** @type {import("./core.js").MetaData[]}*/
    const meta = core.plugins.get('post').metaData
    core.addhook(
      'afterBuild',
      async (/**@type {import("./core.js").Config} */ config) => {
        const { dist, version, author, header, footer, src } = config

        // Handle the archive
        const groupArchive = Object.groupBy(
          meta,
          (item) => new Date(item.date).getFullYear(),
        )
        await generatePage({ group: groupArchive, basePath: 'archive', dist, header, footer, version, author })

        // Handle the tags
        const groupTags = Object.groupBy(
          meta.flatMap((item) => item.tags.map((tag) => ({ tag, ...item }))),
          (item) => item.tag,
        )
        await generatePage({ group: groupTags, basePath: 'tags', dist, header, footer, version, author })

        // Handle the home
        const homeDest = new URL('./home/', dist)
        let indexPage = await Deno.readTextFile(new URL('../index.html', src))
        indexPage = replaceBody(indexPage, header, footer, config.version)

        const mLength = meta.length
        const lastPage = Math.ceil(mLength / 8)
        let content = ''

        for (let index = 0; index < mLength; index++) {
          const { date, title, summary, tags } = meta[index]
          const aTags = tags.reduce(
            (acc, tag) =>
              acc +
              `<a class="tag" href="/./tags/${tag}/"><i class="fa-solid fa-tag"></i> ${tag}</a>`,
            '',
          )
          content += templateBox({
            place: `/./posts/${handleUTC(date)}/`,
            title,
            summary,
            time: convertToUSA(date),
            tags: aTags,
          })

          if ((index + 1) % 8 === 0 || index + 1 === mLength) {
            const cur = index + 1 === mLength
              ? lastPage
              : Math.floor((index + 1) / 8)
            const process = templateProcess({
              before: cur > 2 ? `/./home/${cur - 1}/` : '/',
              page: `${cur} / ${lastPage}`,
              after: index === mLength ? '#' : `/./home/${cur + 1}/`,
            })
            const home = indexPage.replace(
              '<!-- Template -->',
              content + process,
            )

            // Reset the content
            content = ''

            // Generate the home dir
            if (cur !== 1) await ensureDir(new URL(`${cur}/`, homeDest))
            const url = cur === 1
              ? new URL('./index.html', dist)
              : new URL(`${cur}/index.html`, homeDest)

            await Deno.writeTextFile(url, home)
          }
        }
      },
    )
  },
}
