import { unified } from 'unified'
import remarkParse from 'remark-parse'
// 解析 markdown 为 html
import remarkRehype from 'remark-rehype'
// 将 remarkRehype 解析的 html 重新解析（可能内嵌的 html 因 xss 攻击未完全解析）
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import remarkGithubAlerts from './remark-github-alert.js'
import remarkList from './remark-list.js'
import remarkToc from './remark-toc.js'
import remarkSponsor from './remark-sponsor.js'

const sponsorAddress = 'https://personal-website-sponsorship-stripes.fwqaaq.com?amount=199'

export const markdown = async (file) =>
  await unified()
    .use(remarkParse, { commonmark: true })
    .use(remarkGfm)
    .use(remarkGithubAlerts)
    .use(remarkList)
    .use(remarkToc)
    .use(remarkSponsor, {
      address: sponsorAddress
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      theme: 'andromeeda',
      defaultColor: false,
      addLanguageClass: true,
    })
    .use(rehypeRaw)
    .use(rehypeSlug, { prefix: '' })
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor'],
        'aria-label': 'Anchor',
        'aria-hidden': 'true',
        'data-anchorjs-icon': '🔗',
      },
      content: { type: 'text', value: '' },
    })
    .use(rehypeStringify)
    .process(file)
