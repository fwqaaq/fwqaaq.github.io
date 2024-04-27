import { visit } from 'unist-util-visit'

/**
 *  @returns  {import("unified").Plugin<[],import("type-mdast").Root>}
 */
const remarkList = () => {
  /**@param  {import('type-mdast').Root}  */
  return (tree) => {
    visit(
      tree,
      'list',
      (
        /**@type  {import('type-mdast').Node}  */ node,
        /**@type  {Number}*/ index,
        /**@type  {import('type-mdast').Parent}  */ parent,
      ) => {
        if (!index || !parent) return
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
