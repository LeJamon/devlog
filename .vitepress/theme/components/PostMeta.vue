<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, page } = useData()

const project = computed(() => page.value.relativePath.split('/')[1] ?? '')

const dateText = computed(() => {
  const raw = frontmatter.value.date
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(+d)) return String(raw)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const tags = computed<string[]>(() => frontmatter.value.tags ?? [])
</script>

<template>
  <div class="dl-postmeta">
    <a class="dl-postmeta__crumb" :href="withBase('/projects/')">Projects</a>
    <span class="dl-postmeta__sep">/</span>
    <a class="dl-postmeta__crumb" :href="withBase(`/projects/${project}/`)">{{ project }}</a>
    <span class="dl-postmeta__sep">·</span>
    <span class="dl-postmeta__crumb">{{ dateText }}</span>
    <span v-if="frontmatter.author" class="dl-postmeta__sep">·</span>
    <span v-if="frontmatter.author" class="dl-postmeta__crumb">{{ frontmatter.author }}</span>

    <span v-if="tags.length" class="dl-postmeta__tags">
      <span v-for="t in tags" :key="t" class="dl-tag">{{ t }}</span>
    </span>
  </div>
</template>
