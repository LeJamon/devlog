<script setup lang="ts">
import { computed } from 'vue'
import { data as projects } from '../projects.data'
import { data as posts } from '../posts.data'
import ProjectCard from './ProjectCard.vue'
import PostFeed from './PostFeed.vue'

const countByProject = computed<Record<string, number>>(() => {
  const acc: Record<string, number> = {}
  for (const p of posts) acc[p.project] = (acc[p.project] ?? 0) + 1
  return acc
})

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="dl-home">
    <!-- Hero -->
    <header class="dl-hero">
      <div class="dl-hero__eyebrow">
        <span class="dl-label">Engineering log</span>
        <span class="dl-section__spacer" style="max-width: 120px" />
      </div>
      <h1 class="dl-hero__title">
        Building in the open,<br />
        <span class="dim">one commit at a time.</span>
      </h1>
      <p class="dl-hero__lede">
        Notes from the workbench — design decisions, dead ends, and the fixes
        that stuck. Tracked per project, written as the work happens.
      </p>
    </header>

    <!-- Projects -->
    <section class="dl-section">
      <div class="dl-section__head">
        <span class="dl-section__index">{{ pad(1) }} /</span>
        <span class="dl-section__title">Projects</span>
        <span class="dl-section__spacer" />
        <span class="dl-section__index">{{ pad(projects.length) }}</span>
      </div>

      <div class="dl-grid">
        <ProjectCard
          v-for="p in projects"
          :key="p.slug"
          :project="p"
          :count="countByProject[p.slug] ?? 0"
        />
      </div>
    </section>

    <!-- Latest -->
    <section class="dl-section">
      <div class="dl-section__head">
        <span class="dl-section__index">{{ pad(2) }} /</span>
        <span class="dl-section__title">Latest entries</span>
        <span class="dl-section__spacer" />
        <span class="dl-section__index">{{ pad(posts.length) }}</span>
      </div>

      <PostFeed :limit="8" :show-project="true" />
    </section>
  </div>
</template>
