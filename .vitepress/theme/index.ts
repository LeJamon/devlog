import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeLanding from './components/HomeLanding.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import PostFeed from './components/PostFeed.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Registered globally so markdown pages can drop them in directly.
    app.component('HomeLanding', HomeLanding)
    app.component('ProjectGrid', ProjectGrid)
    app.component('PostFeed', PostFeed)
  },
} satisfies Theme
