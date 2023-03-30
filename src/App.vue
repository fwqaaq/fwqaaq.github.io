<script setup lang="ts">
import { useHead } from '@vueuse/head'
import Header from './components/Header.vue'
import { site } from './markdown/index.js'

useHead({
  htmlAttrs: { lang: 'zh-Hans' },
  meta: [
    { name: 'author', content: site.author },
    { name: 'description', content: site.description },
    { name: 'keywords', content: site.keywords.join(', ') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: site.title },
    { property: 'og:description', content: site.description },
    { property: 'og:image', content: '/favicon.ico' },
  ],
})
</script>

<template>
  <Header />
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped></style>
