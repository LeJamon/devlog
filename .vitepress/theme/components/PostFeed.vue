<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'

const props = defineProps<{
  // Limit to one project's entries. Omit to show every project's entries.
  project?: string
  // Cap the number of rows. Omit for no cap.
  limit?: number
  // Show the project label column (useful on the global feed).
  showProject?: boolean
}>()

const rows = computed(() => {
  let list = posts
  if (props.project) list = list.filter((p) => p.project === props.project)
  if (props.limit) list = list.slice(0, props.limit)
  return list
})
</script>

<template>
  <div class="dl-feed">
    <a
      v-for="post in rows"
      :key="post.url"
      class="dl-feed__row"
      :href="withBase(post.url)"
    >
      <span class="dl-feed__date">{{ post.dateText }}</span>

      <span class="dl-feed__body">
        <span class="dl-feed__title">{{ post.title }}</span>
        <span v-if="post.description" class="dl-feed__desc">{{ post.description }}</span>
        <span v-if="post.tags.length" class="dl-feed__tags">
          <span v-for="t in post.tags" :key="t" class="dl-tag">{{ t }}</span>
        </span>
      </span>

      <span v-if="showProject" class="dl-feed__project">{{ post.project }}</span>
    </a>

    <div v-if="!rows.length" class="dl-feed__empty">No entries yet.</div>
  </div>
</template>
