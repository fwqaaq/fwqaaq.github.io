import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

async function writeRoute(distPath, file, response) {
  const outPath = join(distPath, file)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, Buffer.from(await response.arrayBuffer()))
}

export async function emitStaticRoutes(app, routeManifest, dist) {
  const distPath = fileURLToPath(new URL(dist))
  const emitted = new Set()

  for (const route of routeManifest) {
    if (emitted.has(route.file)) continue
    emitted.add(route.file)

    const response = await app.fetch(new Request(`http://hono-ssg.local${route.path}`))
    if (!response.ok && !(route.allowStatus && response.status === route.allowStatus)) {
      throw new Error(`Failed to render ${route.path}: ${response.status}`)
    }
    await writeRoute(distPath, route.file, response)
  }
}
