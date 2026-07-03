import { execFile } from 'node:child_process'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { markdown } from '../util/remark/markdown.ts'
import { format, handleUTC, parseYaml } from '../util/utils.ts'
import type { BlogData, BuildConfig, Post } from '../types.ts'
import type { Dirent } from 'node:fs'

const execFileAsync = promisify(execFile)
const updateRegex = /^(updateAt:\s*)(.+)$/m

async function latestGitDate(filePath: string): Promise<string> {
  const { stdout } = await execFileAsync('git', [
    'log',
    '-1',
    '--format=%ad',
    '--date=iso-strict',
    '--',
    filePath,
  ])
  return stdout.trim()
}

/** Keeps the `updateAt` frontmatter in sync with the file's last git commit date. */
async function readPostWithUpdatedFrontmatter(filePath: string): Promise<string> {
  let postContent = await readFile(filePath, 'utf8')
  const gitDate = await latestGitDate(filePath)
  const updated = gitDate ? format(new Date(gitDate), 'yyyy-MM-dd HH:mm:ss') : null
  const matches = postContent.match(updateRegex)
  const updateAt = matches ? matches[2].trim() : null
  const oneDay = 24 * 60 * 60 * 1000

  if (
    updated &&
    (!updateAt || +new Date(updateAt) + oneDay < +new Date(updated))
  ) {
    postContent = postContent.replace(updateRegex, `updateAt: ${updated}`)
    await writeFile(filePath, postContent)
  }

  return postContent
}

async function collectPost(config: BuildConfig, entry: Dirent, postsUrl: URL): Promise<Post> {
  const filePath = fileURLToPath(new URL(entry.name, postsUrl))
  const postContent = await readPostWithUpdatedFrontmatter(filePath)
  const [meta, md] = parseYaml(postContent)

  return {
    slug: entry.name.replace(/\.md$/, ''),
    dateSlug: handleUTC(meta.date),
    meta,
    markdown: md.trim(),
    contentHtml: String(await markdown(md, { sponsorUrl: config.site.sponsor?.url })),
  }
}

function groupTags(posts: Post[]): BlogData['tags'] {
  const tags: BlogData['tags'] = {}
  for (const post of posts) {
    for (const tag of post.meta.tags ?? []) {
      ;(tags[tag] ??= []).push(post.meta)
    }
  }
  return tags
}

export async function loadBlogData(config: BuildConfig): Promise<BlogData> {
  const postsUrl = new URL('./posts/', config.src)
  const entries = (await readdir(postsUrl, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .sort((a, b) => a.name.localeCompare(b.name))

  const posts: Post[] = []
  for (const entry of entries) posts.push(await collectPost(config, entry, postsUrl))

  posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())

  return { posts, tags: groupTags(posts) }
}
