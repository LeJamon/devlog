import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

// ─────────────────────────────────────────────────────────────────────────────
// Site identity — change these three if the repo name / owner differs.
// `base` MUST equal "/<repo-name>/" for GitHub Pages project sites
// (e.g. https://<owner>.github.io/devlog/ → base = "/devlog/").
// For a user/org site (<owner>.github.io) or a custom domain, set base = "/".
// ─────────────────────────────────────────────────────────────────────────────
const REPO_OWNER = 'LeJamon'
const REPO_NAME = 'devlog'
const BASE = `/${REPO_NAME}/`

const root = process.cwd()
const projectsDir = path.join(root, 'projects')

// Build the per-project sidebar automatically from the filesystem so that
// dropping a new markdown file under projects/<slug>/posts/ is all it takes.
function buildSidebar(): Record<string, unknown> {
  const sidebar: Record<string, unknown> = {}
  if (!fs.existsSync(projectsDir)) return sidebar

  for (const dirent of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue
    const slug = dirent.name
    const postsDir = path.join(projectsDir, slug, 'posts')

    const items: { text: string; link: string }[] = []
    if (fs.existsSync(postsDir)) {
      const entries = fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const { data } = matter(fs.readFileSync(path.join(postsDir, f), 'utf-8'))
          const name = f.replace(/\.md$/, '')
          return {
            text: (data.title as string) || name,
            link: `/projects/${slug}/posts/${name}`,
            date: (data.date as string) || name,
          }
        })
        // newest first
        .sort((a, b) => (a.date < b.date ? 1 : -1))

      items.push(...entries.map(({ text, link }) => ({ text, link })))
    }

    sidebar[`/projects/${slug}/`] = [
      { text: 'Overview', link: `/projects/${slug}/` },
      { text: 'Devlog', collapsed: false, items },
    ]
  }
  return sidebar
}

export default defineConfig({
  title: 'Devlog',
  description: 'Engineering notes, tracked per project.',
  lang: 'en-US',
  base: BASE,
  cleanUrls: true,
  // Repo docs, not site pages.
  srcExclude: ['README.md', 'AGENTS.md'],
  appearance: 'force-dark',
  lastUpdated: true,
  metaChunk: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#0a0a0a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Devlog' }],
    ['meta', { property: 'og:description', content: 'Engineering notes, tracked per project.' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
    ],
  ],

  themeConfig: {
    logo: undefined,
    siteTitle: 'DEVLOG',

    nav: [
      { text: 'Index', link: '/' },
      { text: 'Projects', link: '/projects/' },
    ],

    sidebar: buildSidebar(),

    socialLinks: [{ icon: 'github', link: `https://github.com/${REPO_OWNER}/${REPO_NAME}` }],

    outline: { level: [2, 3], label: 'On this page' },

    docFooter: { prev: 'Previous', next: 'Next' },

    search: { provider: 'local' },

    lastUpdatedText: 'Last updated',
  },
})
