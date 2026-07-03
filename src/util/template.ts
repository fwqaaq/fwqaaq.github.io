export const getRss = (
  author: string,
  website: string,
  items: string,
  description = '',
): string => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${author}'s blog</title>
  <link>${website}</link>
  <description>${description}</description>
  ${items}
</channel>
</rss>
`
