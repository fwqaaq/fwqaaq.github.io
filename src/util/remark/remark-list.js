import { visit } from 'unist-util-visit'

/** @return {import('unified/index.d.ts').Plugin<[], import('type-mdast').Root>}*/
const remarkList = () => {
  return (/**@type {import('type-mdast').Root}*/tree) => {
    visit(
      tree,
      'list',
      (
        /**@type  {import('type-mdast').Node}  */ node,
        /**@type  {Number}*/ _index,
        /**@type  {import('type-mdast').Parent}  */ _parent,
      ) => {
        if (node.ordered) {
          node.data = {
            hName: 'ul',
            hProperties: {
              class: 'remark-ordered-list',
            },
          }
        }
        if (!node.ordered) {
          node.data = {
            hName: 'ul',
            hProperties: {
              class: 'remark-unordered-list',
            },
          }
        }
      },
    )
    return tree
  }
}

export default remarkList
