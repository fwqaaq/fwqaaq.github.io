import { constants } from 'node:fs'
import { access, copyFile, mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type PathLike = string | URL

export interface WalkEntry {
  name: string
  path: string
  isFile: boolean
  isDirectory: boolean
  isSymlink: boolean
}

export function toPath(pathLike: PathLike): string {
  if (pathLike instanceof URL) return fileURLToPath(pathLike)
  if (pathLike.startsWith('file:')) return fileURLToPath(pathLike)
  return pathLike
}

export async function exists(pathLike: PathLike): Promise<boolean> {
  try {
    await access(toPath(pathLike), constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function ensureDir(pathLike: PathLike): Promise<void> {
  await mkdir(toPath(pathLike), { recursive: true })
}

export async function ensureFile(pathLike: PathLike): Promise<void> {
  const filePath = toPath(pathLike)
  await mkdir(dirname(filePath), { recursive: true })
  if (!await exists(filePath)) await writeFile(filePath, '')
}

export async function copy(src: PathLike, dest: PathLike): Promise<void> {
  const srcPath = toPath(src)
  const destPath = toPath(dest)
  await mkdir(dirname(destPath), { recursive: true })
  await copyFile(srcPath, destPath)
}

export async function* walk(root: PathLike): AsyncGenerator<WalkEntry> {
  const rootPath = toPath(root)
  const entries = await readdir(rootPath, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(rootPath, entry.name)
    const info: WalkEntry = {
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
