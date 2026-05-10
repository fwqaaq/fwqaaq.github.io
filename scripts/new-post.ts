import { Command } from '@cliffy/command'

/**
 * 从标题生成 slug（文件名用）
 * 例: "My New Post!" -> "my_new_post"
 */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // 去掉特殊字符
    .replace(/\s+/g, '_') // 空格替换为下划线
    .replace(/_+/g, '_') // 合并连续下划线
    .replace(/^_|_$/g, '') // 去掉首尾下划线
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

if (import.meta.main) {
  await new Command()
    .name('new-post')
    .description('Generate a new blog post markdown file in src/posts/')
    .option('--title <title: string>', 'Post title', { required: true })
    .option('--categories <categories: string>', 'Category, e.g. "Tech"', {
      required: true,
    })
    .option(
      '--tags <tags: string>',
      'Comma-separated tags, e.g. "JavaScript,Deno"',
    )
    .option('--summary <summary: string>', 'Post summary / description')
    .option(
      '--slug <slug: string>',
      'Custom filename slug (without .md extension). Default: auto-generated from title',
    )
    .action(async (options: Record<string, unknown>) => {
      const {
        title,
        categories,
        tags: tagsStr,
        summary,
        slug: customSlug,
      } = options as {
        title: string
        categories: string
        tags?: string
        summary?: string
        slug?: string
      }

      if (!summary) {
        console.error('Error: --summary is required')
        Deno.exit(1)
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

      // 检查是否已存在
      try {
        const stat = await Deno.stat(filepath)
        if (stat.isFile) {
          console.error(`Error: File already exists: ${filepath}`)
          Deno.exit(1)
        }
      } catch {
        // 文件不存在，继续
      }

      const content = generateContent({ title, categories, tags, summary })

      await Deno.writeTextFile(filepath, content)

      console.log(`✅ Created: ${filepath}`)
      console.log()
      console.log('--- preview ---')
      console.log(content)
    })
    .parse(Deno.args)
}
