import { readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, relative } from 'node:path'
import { build as esbuild } from 'esbuild'
import { copy, ensureDir, walk } from '../util/node-fs.ts'
import { createProcessor } from '../util/utils.ts'
import type { BuildConfig } from '../types.ts'

const versionedCss = (path: string, version: number) => path.replace(/\.css$/i, `.${version}.css`)
const versionedJs = (path: string, version: number) => path.replace(/\.(?:ts|js)$/i, `.${version}.js`)

export async function emitAssets(config: BuildConfig): Promise<void> {
  const publicUrl = new URL('../public/', config.src)
  const publicPath = publicUrl.pathname
  const distPublicUrl = new URL('./public/', config.dist)
  const postcssor = createProcessor()

  await ensureDir(distPublicUrl)

  for await (const entry of walk(publicUrl)) {
    if (entry.name === '.DS_Store') continue
    const rel = relative(publicPath, entry.path)
    if (!rel) continue

    const outPath = new URL(rel, distPublicUrl).pathname

    if (entry.isDirectory) {
      await ensureDir(outPath)
      continue
    }

    if (!entry.isFile) continue

    if (entry.path.includes('/resume/index.html')) {
      const html = (await readFile(entry.path, 'utf8')).replace(
        '<?-- index.css -->',
        `/public/resume/index.${config.version}.css`,
      )
      await ensureDir(dirname(outPath))
      await writeFile(outPath, html)
      continue
    }

    const ext = extname(entry.path).toLowerCase()
    if (ext === '.css') {
      const css = await readFile(entry.path, 'utf8')
      const result = await postcssor.process(css, { from: entry.path })
      await ensureDir(dirname(outPath))
      await writeFile(versionedCss(outPath, config.version), result.css)
      continue
    }

    if (ext === '.ts' && entry.path.startsWith(new URL('./JavaScript/', publicUrl).pathname)) {
      const outfile = versionedJs(outPath, config.version)
      await ensureDir(dirname(outfile))
      await esbuild({
        entryPoints: [entry.path],
        outfile,
        bundle: true,
        minify: true,
        format: 'iife',
        target: ['es2022'],
        sourcemap: false,
        logLevel: 'silent',
      })
      continue
    }

    if (ext === '.js') {
      await copy(entry.path, versionedJs(outPath, config.version))
      continue
    }

    await copy(entry.path, outPath)
  }

}
