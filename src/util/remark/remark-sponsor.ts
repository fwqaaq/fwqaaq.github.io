/**
 * @typedef {Object} RemarkSponsorOptions
 * @property {string} address - The address to redirect when click the sponsor button.
 */

/** @type {import('unified/index.d.ts').Plugin<[RemarkSponsorOptions], import('type-mdast').Root>}*/
const remarkSponsor = (options: any): any => {
  const { address } = options

  return (tree: any) => {
    if (!address) return tree

    const sponsorNode = {
      type: 'html',
      value: `
<div class="sponsor-container">
  <button class="sponsor-btn">
    <a href="${address}" target="_blank" rel="noopener noreferrer" class="">
      <span class="sponsor-icon">☕</span>
      <span>请博主喝杯咖啡</span>
  </a>
  </button>
</div>`.trim(),
    }
    tree.children.push(sponsorNode)
    return tree
  }
}

export default remarkSponsor
