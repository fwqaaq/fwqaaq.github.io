import { unified } from "unified"
import remarkParse from "remark-parse"
// 解析 markdown 为 html
import remarkRehype from "remark-rehype"
// 将 remarkRehype 解析的 html 重新解析（可能内嵌的 html 因 xss 攻击未完全解析）
import rehypeRaw from "rehype-raw"
// import rehypeDocument from 'https://esm.sh/rehype-document@6.1.0'
import rehypeStringify from "rehype-stringify"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"

export const markdown = async (file) =>
  await unified()
    .use(remarkParse, { commonmark: true })
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { prefix: "hl-", detect: true })
    // .use(rehypeDocument, { title: '👋🌍' })
    .use(rehypeSlug, { prefix: "" })
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["anchor"],
        "aria-label": "Anchor",
        "aria-hidden": "true",
        "data-anchorjs-icon": "🔗",
      },
      content: { type: "text", value: "" },
    })
    .use(rehypeStringify)
    .process(file)
