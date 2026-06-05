<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import PostMeta from './components/PostMeta.vue'
import SiteFooter from './components/SiteFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <!-- Auto-rendered above any page that has a `date` in frontmatter,
         i.e. every devlog entry. The agent never has to add it by hand. -->
    <template #doc-before>
      <PostMeta v-if="frontmatter.date" />
    </template>

    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
