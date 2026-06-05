<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import type { Project } from '../projects.data'

const props = defineProps<{ project: Project; count: number }>()

const dotClass = computed(() => {
  const s = (props.project.status || 'active').toLowerCase()
  if (s.startsWith('active') || s.startsWith('live')) return 'dl-card__dot--active'
  if (s.startsWith('pause') || s.startsWith('wip') || s.startsWith('hold')) return 'dl-card__dot--paused'
  if (s.startsWith('archiv') || s.startsWith('done')) return 'dl-card__dot--archived'
  return ''
})
</script>

<template>
  <a class="dl-card" :href="withBase(project.url)">
    <div class="dl-card__top">
      <span class="dl-card__status">
        <span class="dl-card__dot" :class="dotClass" />
        {{ project.status }}
      </span>
      <span class="dl-card__arrow">↗</span>
    </div>

    <div>
      <div class="dl-card__name">{{ project.name }}</div>
    </div>

    <div class="dl-card__desc">{{ project.description }}</div>

    <div class="dl-card__meta">
      <span v-for="t in project.tags" :key="t" class="dl-tag">{{ t }}</span>
      <span class="dl-card__count" style="margin-left: auto">
        {{ count }} {{ count === 1 ? 'entry' : 'entries' }}
      </span>
    </div>
  </a>
</template>
