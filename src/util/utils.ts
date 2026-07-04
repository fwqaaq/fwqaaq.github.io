import { readFile } from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import postcssMinify from '@csstools/postcss-minify'
import { parse } from 'yaml'
import type { MetaData } from '../types.ts'

export const format = (date: Date | string | number, pattern: string): string => {
  const d = new Date(date)
  const pad = (value: number) => String(value).padStart(2, '0')
  return pattern
    .replaceAll('yyyy', String(d.getFullYear()))
    .replaceAll('MM', pad(d.getMonth() + 1))
    .replaceAll('dd', pad(d.getDate()))
    .replaceAll('HH', pad(d.getHours()))
    .replaceAll('mm', pad(d.getMinutes()))
    .replaceAll('ss', pad(d.getSeconds()))
}

const regxYaml = /---(\n[\s\S]*?\n)---/

export const parseYaml = (file: string): [MetaData, string] => {
  const [yamlRaw, contentMd] = file.split(regxYaml).slice(1)
  return [parse(yamlRaw) as MetaData, contentMd]
}

export const handleUTC = (date: string): string => format(new Date(date), 'yyyyMMddHHmmss')

export const convertToUSA = (date: string): string => {
  const utc = new Date(date)
  return utc.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export function createProcessor(): postcss.Processor {
  return postcss([
    postcssMinify(),
    postcssPresetEnv({
      stage: 3,
      browsers: 'last 2 versions, > 1%, not dead',
      features: {
        'nesting-rules': true,
        'has-pseudo-class': true,
        'nested-calc': true,
      },
    }),
  ])
}

export function startServer(port: number | string | undefined = 3000, version: number): void {
  const listenPort = Number(port) || 3000

  const app = new Hono()
  app.use(compress())
  app.use('*', serveStatic({
    root: './dist',
    rewriteRequestPath: (path) => path.replace(`.${version}`, ''),
  }))
  app.notFound(async (c) => c.html(await readFile('./dist/404.html', 'utf8'), 404))

  const server = serve({ fetch: app.fetch, port: listenPort, hostname: '127.0.0.1' }, (info) => {
    console.log(`Server started at http://127.0.0.1:${info.port}`)
  })

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${listenPort} in use, try another port`)
      setTimeout(() => startServer(listenPort, version), 1000)
      return
    }
    throw error
  })
}
