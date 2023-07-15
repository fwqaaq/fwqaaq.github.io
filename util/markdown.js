import { unified } from "https://esm.sh/unified@10.1.2"
import remarkParse from "https://esm.sh/remark-parse@10.0.2"
import remarkRehype from "https://esm.sh/remark-rehype@10.1.0"
// import rehypeDocument from 'https://esm.sh/rehype-document@6.1.0'
import rehypeStringify from "https://esm.sh/rehype-stringify@9.0.3"
import rehypeHighlight from "https://esm.sh/rehype-highlight@5.0.2"
import rehypeSlug from "https://esm.sh/rehype-slug@5.1.0"
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@6.1.1"
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1"

export const markdown = async (file) =>
  await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
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
    })
    .use(rehypeStringify)
    .process(file)
