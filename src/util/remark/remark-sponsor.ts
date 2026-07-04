import type { Plugin } from 'unified'
import type { Root, RootContent } from 'mdast'

type RemarkSponsorOptions = {
  address: string
}

const remarkSponsor: Plugin<[RemarkSponsorOptions], Root> = (
  options: RemarkSponsorOptions,
) => {
  const { address } = options

  return (tree) => {
    if (!address) return tree

    const node: RootContent = {
      type: 'paragraph',
      data: {
        hName: 'div',
        hProperties: {
          class: 'sponsor-container',
        },
      },
      // Paragraph nodes require children; initialize as empty and populate below
      // Use any[] to satisfy typing for nested mdast content
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      children: [],
    }

    node.children = [
      {
        type: 'strong',
        data: {
          hName: 'button',
          hProperties: {
            class: 'sponsor-btn',
          },
        },
        children: [
          {
            type: 'link',
            url: address,
            data: {
              hProperties: {
                target: '_blank',
                rel: 'noopener noreferrer',
                class: '',
              },
            },
            children: [
              {
                type: 'strong',
                data: {
                  hName: 'span',
                  hProperties: {
                    class: 'sponsor-icon',
                  },
                },
                children: [
                  {
                    type: 'text',
                    value: '☕',
                  },
                ],
              },
              {
                type: 'strong',
                data: {
                  hName: 'span',
                },
                children: [
                  {
                    type: 'text',
                    value: '请博主喝杯咖啡',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    tree.children.push(node)
    return tree
  }
}

export default remarkSponsor
