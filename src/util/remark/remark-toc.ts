import { visit } from 'unist-util-visit'
import { toc } from 'mdast-util-toc'

/**
 * @typedef {Object} RemarkTocOptions
 * @property {string} [flag='[TOC]'] - The flag to replace with the table of contents.
 */

/** @type {import('unified/index.d.ts').Plugin<[RemarkTocOptions], import('type-mdast').Root>}*/
const remarkToc = (options: any = {}): any => {
  const { flag = '[TOC]' } = options
  return (tree: any) => {
    /** @type {{type: string, depth: number, children: []}[]}*/
    const headings = []
    visit(
      tree,
      'heading',
      (node: any, _index: any) => {
        /**@type {string} */
        let title = node.children[0].value
        // Using others type when heading is not a text node
        if (node.children[0].type !== 'text' && node.children[0].children[0]) {
          title = node.children[0].children[0].value
        }
        /**@type {number} */
        const depth = node.depth
        const children = [{ type: 'text', value: title }]
        headings.push({ type: 'heading', depth, children })
      },
    )

    visit(
      tree,
      'paragraph',
      (node: any, _index: any) => {
        if (node.children?.[0]?.value !== flag) return
        const table = toc({ type: 'root', children: headings })
        // update toc node
        table.map.data = {
          hProperties: {
            class: 'remark-toc',
          },
        }
        node.data = {
          hName: 'details',
          hProperties: {
            class: 'remark-toc-details',
          },
        }
        node.children = [
          {
            type: 'html',
            value: "<summary class='remark-toc-summary'>目录</summary>",
          },
          table.map,
        ]
      },
    )
    return tree
  }
}

export default remarkToc
