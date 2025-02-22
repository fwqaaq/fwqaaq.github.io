import { visit } from 'unist-util-visit'
import { toc } from 'https://esm.sh/mdast-util-toc@7'

/** @returns {import('unified/index.d.ts').Plugin<[], import('type-mdast').Root>}*/
const remarkToc = () => {
  return (tree) => {

    /** @type {{type: string, depth: number, children: []}[]}*/
    const headings = []
    visit(tree, "heading", (/**@type {import("type-mdast").Node} */ node, _index) => {
      // Using `type: "link"` when heading is not a text node
      /**@type {string} */
      let title = node.children[0].value
      if (node.children[0].type !== "text" && node.children[0].children[0]) {
        title = node.children[0].children[0].value
      }
      /**@type {number} */
      const depth = node.depth
      const children = [{ type: "text", value: title }]
      headings.push({ type: "heading", depth, children })
    })

    visit(tree, "paragraph", (/**@type {import("type-mdast").Node} */ node, _index) => {
      if (node.children?.[0]?.value !== "[TOC]") return
      const table = toc({ type: "root", children: headings })
      // update toc node
      table.map.data = {
        hProperties: {
          class: "remark-toc",
        },
      }
      node.data = {
        hName: "details",
        hProperties: {
          class: "remark-toc-details",
        },
      }
      node.children = [
        {
          type: "html",
          value: "<summary class='remark-toc-summary'>目录</summary>",
        },
        table.map
      ]
    })
    return tree
  }
}

export default remarkToc