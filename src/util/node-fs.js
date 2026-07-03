import { constants } from 'node:fs'
import { access, copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function toPath(pathLike) {
  if (pathLike instanceof URL) return fileURLToPath(pathLike)
  if (typeof pathLike === 'string' && pathLike.startsWith('file:')) {
    return fileURLToPath(pathLike)
  }
  return pathLike
}

export async function exists(pathLike) {
  try {
    await access(toPath(pathLike), constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function ensureDir(pathLike) {
  await mkdir(toPath(pathLike), { recursive: true })
}

export async function ensureFile(pathLike) {
  const filePath = toPath(pathLike)
  await mkdir(dirname(filePath), { recursive: true })
  if (!await exists(filePath)) await writeFile(filePath, '')
}

export async function copy(src, dest) {
  const srcPath = toPath(src)
  const destPath = toPath(dest)
  await mkdir(dirname(destPath), { recursive: true })
  await copyFile(srcPath, destPath)
}

export async function* walk(root) {
  const rootPath = toPath(root)
  const entries = await readdir(rootPath, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(rootPath, entry.name)
    const info = {
      name: entry.name,
      path,
      isFile: entry.isFile(),
      isDirectory: entry.isDirectory(),
      isSymlink: entry.isSymbolicLink(),
    }
    yield info
    if (entry.isDirectory()) yield* walk(path)
  }
}
