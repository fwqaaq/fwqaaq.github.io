import path from 'node:path'
import { fileURLToPath } from 'url'
import { defineConfig, type UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-vue-markdown'
import { ViteSSGOptions } from 'vite-ssg'
import Pages from 'vite-plugin-pages'
import { readFileSync } from 'node:fs'
import { parse } from 'ultramatter'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/head'],
  },
  plugins: [
    vue({
      reactivityTransform: true,
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      headEnabled: true,
      wrapperComponent: 'Markdown',
      wrapperClasses: '',
    }),
    Pages({
      dirs: 'posts',
      extensions: ['md', 'vue'],
      extendRoute(route) {
        const __filename = path.resolve(
          fileURLToPath(import.meta.url),
          `../${route.component}`
        )
        const md = readFileSync(__filename, 'utf8')
        const { frontmatter } = parse(md)
        // console.log(frontmatter)
        if (frontmatter)
          route.meta = {
            ...frontmatter,
            ...route.meta,
          }
        return { ...route }
      },
    }),
    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/types/components.d.ts',
    }),
  ],
  ssgOptions: {
    script: 'async',
    format: 'esm',
    formatting: 'minify',
    dirStyle: 'nested',
  },
} as UserConfigExport & ViteSSGOptions)
