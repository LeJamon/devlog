import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  dateText: string
  project: string
  tags: string[]
  description: string
}

declare const data: Post[]
export { data }

function formatDate(raw: string): string {
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(+d)) return raw
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default createContentLoader('projects/*/posts/*.md', {
  transform(raw): Post[] {
    return raw
      .filter((page) => page.frontmatter.date)
      .map((page) => {
        // url: /projects/<slug>/posts/<name>
        const project = page.url.split('/')[2] ?? 'unknown'
        return {
          title: page.frontmatter.title ?? page.url,
          url: page.url,
          date: page.frontmatter.date,
          dateText: formatDate(page.frontmatter.date),
          project,
          tags: page.frontmatter.tags ?? [],
          description: page.frontmatter.description ?? '',
        }
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  },
})
