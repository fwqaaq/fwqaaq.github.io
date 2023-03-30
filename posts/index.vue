<template>
  <div class="index">
    <div ref="title" v-for="post in getRouts()" role="list" class="title">
      <RouterLink :to="post.path">{{ post.title }}</RouterLink>
      <time :datetime="post.date">{{ formatTime(post.date) }}</time>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRouts, formatTime } from '../src/markdown/index'
</script>

<style scoped>
.index {
  margin: 0 auto;
  max-width: 80ch;
}

.title {
  display: flex;
  justify-content: space-between;
  padding: 0.2ch 0;
}
</style>
