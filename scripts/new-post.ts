import { stat, writeFile } from 'node:fs/promises'

/**
 * 从标题生成 slug（文件名用）
 * 例: "My New Post!" -> "my_new_post"
 */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

function parseArgs(args: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const next = args[i + 1]
    if (!next || next.startsWith('--')) {
      out[key] = true
    } else {
      out[key] = next
      i++
    }
  }
  return out
}

/**
 * 获取当前时间，格式为 YYYY-MM-DD HH:mm:ss
 */
function now(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * 生成 YAML front matter + 基本模板
 */
function generateContent(options: {
  title: string
  categories: string
  tags: string[]
  summary: string
}): string {
  const { title, categories, tags, summary } = options
  const date = now()

  const tagsYaml =
    tags.length > 0 ? tags.map((t) => `   - ${t}`).join('\n') : '   - '

  return `---
title: ${title}
date: ${date}
categories: ${categories}
tags:
${tagsYaml}
summary: ${summary}
updateAt: ${date}
---

[TOC]
`
}

const options = parseArgs(process.argv.slice(2))

const title = options.title as string | undefined
const categories = options.categories as string | undefined
const tagsStr = options.tags as string | undefined
const summary = options.summary as string | undefined
const customSlug = options.slug as string | undefined

if (!title || !categories) {
  console.error('Usage: node scripts/new-post.ts --title <title> --categories <category> --summary <summary> [--tags a,b] [--slug slug]')
  process.exit(1)
}

if (!summary) {
  console.error('Error: --summary is required')
  process.exit(1)
}

const tags = tagsStr
  ? tagsStr
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)
  : []

const slug = customSlug || toSlug(title)
const filename = `${slug}.md`
const filepath = `src/posts/${filename}`

try {
  const fileStat = await stat(filepath)
  if (fileStat.isFile()) {
    console.error(`Error: File already exists: ${filepath}`)
    process.exit(1)
  }
} catch {
  // 文件不存在，继续
}

const content = generateContent({ title, categories, tags, summary })

await writeFile(filepath, content)

console.log(`✅ Created: ${filepath}`)
console.log()
console.log('--- preview ---')
console.log(content)
