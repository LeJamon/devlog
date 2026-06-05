<script setup lang="ts">
import { computed } from 'vue'
import { data as projects } from '../projects.data'
import { data as posts } from '../posts.data'
import ProjectCard from './ProjectCard.vue'

const countByProject = computed<Record<string, number>>(() => {
  const acc: Record<string, number> = {}
  for (const p of posts) acc[p.project] = (acc[p.project] ?? 0) + 1
  return acc
})
</script>

<template>
  <div class="dl-grid">
    <ProjectCard
      v-for="p in projects"
      :key="p.slug"
      :project="p"
      :count="countByProject[p.slug] ?? 0"
    />
  </div>
</template>
