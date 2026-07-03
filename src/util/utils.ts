import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage } from 'node:http'
import { gzipSync } from 'node:zlib'
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
  const server = createServer(async (request, response) => {
    try {
      const res = await handler(request, version)
      response.writeHead(res.status, Object.fromEntries(res.headers.entries()))
      const body = res.body ? Buffer.from(await res.arrayBuffer()) : undefined
      response.end(body)
    } catch (error) {
      console.error(error)
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Internal Server Error')
    }
  })

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${listenPort} in use, try another port`)
      setTimeout(() => startServer(listenPort, version), 1000)
      return
    }
    throw error
  })

  server.listen(listenPort, '127.0.0.1', () => {
    const address = server.address()
    const actualPort = typeof address === 'object' && address ? address.port : listenPort
    console.log(`Server started at http://127.0.0.1:${actualPort}`)
  })
}

const handler = async (request: IncomingMessage, version: number): Promise<Response> => {
  let reqUrl = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
  const rawExt = reqUrl.endsWith('/') ? 'html' : reqUrl.split('.').pop()
  const contentType = rawExt === 'css'
    ? 'text/css'
    : rawExt === 'js'
      ? 'text/javascript'
      : rawExt === 'html'
        ? 'text/html'
        : '*/*'

  if (reqUrl.endsWith('/')) reqUrl += 'index.html'

  const headers = new Headers({ 'Content-Type': contentType })

  if (version && reqUrl.includes(String(version))) {
    reqUrl = reqUrl.replace(`.${version}`, '')
  }

  let content: Buffer
  let status = 200

  try {
    content = await readFile(`./dist${reqUrl}`)
  } catch {
    status = 404
    content = await readFile('./dist/404.html')
  }

  const contentEncoding = request.headers['accept-encoding']
  if (!contentEncoding || !contentEncoding.includes('gzip')) {
    return new Response(content as BodyInit, { headers, status })
  }

  headers.set('Content-Encoding', 'gzip')
  return new Response(gzipSync(content) as BodyInit, { headers, status })
}
