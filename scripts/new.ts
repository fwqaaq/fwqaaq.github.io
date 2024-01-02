import { Command } from 'Command'
import { stringify } from 'yaml'
import { format } from 'datetime'

interface Metadata {
  date: Date
  title: string
  categories: string
  tags: string[]
  summary?: string
}

const metadata = {
  date: new Date(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
  title: '',
  categories: '',
  tags: [],
} as Metadata

const _new = new Command()
  .name('blog')
  .version('0.0.1')
  .description('Create a new blog posts')

await new Command()
  .command('new', _new)
  .option('-t, --title <title:string>', 'Title of the blog post', {
    required: true,
  })
  .option('-c, --category <category:string>', 'Categories of the blog post', {
    required: true,
  })
  .option('-g, --tag <tag:string[]>', 'Tags of the blog post')
  .option('-s, --summary <summary:string>', 'Summary of the blog post')
  .action((options) => {
    if (!options.tag) metadata.tags.push(options.category)
    else metadata.tags = options.tag
    Object.assign(metadata, {
      title: options.title,
      categories: options.category,
      summary: options.summary ?? 'summary',
    })
  })
  .parse(Deno.args)

Deno.writeTextFileSync(
  `./src/posts/${metadata.title}.md`,
  `---
${stringify(
  metadata as unknown as Record<string, Metadata[keyof Metadata]>
)}---`
)
