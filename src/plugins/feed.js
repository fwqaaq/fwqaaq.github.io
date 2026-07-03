import { getRss } from '../util/template.js'
import { handleUTC } from '../util/utils.js'
import { writeFile } from 'node:fs/promises'
import { ensureFile, exists } from '../util/node-fs.js'

export const feedPlugin = {
  name: 'feed',
  /**@param {import("./core.js").Core} core  */
  apply(core) {
    /**@type {import("../util/type.js").MetaData[]} */
    const meta = core.plugins.get('post').metaData

    core.addhook(
      'afterBuild',
      async (/**@type {import("../util/type.js").Config} */ config) => {
        const { dist, author, website } = config

        // sitemap
        const __sitemap_dist = new URL('./sitemap.xml', dist)
        const itemsSitemap =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${
            meta.reduce(
              (acc, { date }) =>
                `${acc}<url><loc>${website}posts/${
                  handleUTC(date)
                }/</loc></url>`,
              '',
            )
          }\n</urlset>`

        // rss
        const __rss_dist = new URL('./feed.xml', dist)
        const rssItem = meta.reduce((acc, { date, title, summary }) => {
          const url = `${config.website}posts/${handleUTC(date)}/`
          return acc +
            `<item>\n<title>${title}</title>\n<link>${url}</link>\n<description>${summary}</description>\n<pubDate>${
              new Date(date).toUTCString()
            }</pubDate>\n</item>`
        }, '')
        const rssContent = getRss(
          author,
          website,
          rssItem,
          config.site?.rssDescription,
        )

        // robots
        const __robots_dist = new URL('./robots.txt', dist)
        const robotsContent =
          `User-agent: *\nAllow: /\nSitemap: ${website}sitemap.xml`
        await Promise.all([
          [__sitemap_dist, itemsSitemap],
          [__rss_dist, rssContent],
          [__robots_dist, robotsContent],
        ].map(async ([path, content]) => {
          if (!await exists(path)) await ensureFile(path)
          await writeFile(path, content)
        }))
      },
    )
  },
}
