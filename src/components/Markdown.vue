<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { getRouts, formatTime } from '../markdown/index.js'
import { useHead } from '@vueuse/head'
import { Title } from '../markdown/index.js'

const { path } = useRoute()
const { frontmatter: md } = defineProps<{ frontmatter: Title }>()

useHead({
  title: md.title,
  meta: [
    { name: 'description', content: md.title },
    { name: 'keywords', content: md.tags.join(', ') },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: md.title },
    { property: 'og:description', content: md.title },
    { property: 'article:author', content: md.title },
    { property: 'article:published_time', content: md.date },
    { property: 'article:tag', content: md.tags.join(', ') },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: md.title },
    { name: 'twitter:description', content: md.title },
  ],
})
</script>

<template>
  <article class="prose">
    <h1>{{ md.title }}</h1>
    <div class="time">
      <time :datetime="md.date">{{ formatTime(md.date) }}</time>
    </div>
    <slot />
  </article>
</template>

<style scoped>
h1 {
  text-align: center;
  padding: 1ch 0;
}

.time {
  padding: 1ch 0;
  font-size: 2ch;
}

time {
  text-decoration: dotted white;
}

article {
  margin: 0 auto;
  max-width: 80ch;
}
</style>
