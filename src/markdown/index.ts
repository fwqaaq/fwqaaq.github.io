import type { RouteRecordNormalized } from 'vue-router'
import { useRouter } from 'vue-router'

export const site = {
  author: 'fwqaaq',
  title: '咱们中国真伟大！！！',
  website: 'https://www.fwqaq.us',
  description: "I don't get it...",
  keywords: ['feiwu', 'fw', 'Fw', 'QAQ'],
}

export interface Title extends RouteRecordNormalized {
  title: string
  date: string
  author: string
  categories: string
  tags: string[]
  summary: string
}

export function formatTime(raw: string | Date) {
  return new Date(raw).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getRouts() {
  return useRouter()
    .getRoutes()
    .map(
      (r) =>
        ({
          ...r,
          author: r.meta.author,
          title: r.meta.title,
          date: r.meta.date,
          categories: r.meta.description,
          tags: r.meta.tags,
          summary: r.meta.summary,
        } as Title)
    )
    .filter((o) => o.date)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

new Date('2022-10-18 17:10:00+08').toLocaleDateString('default', {})
