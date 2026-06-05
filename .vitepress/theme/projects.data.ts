import { createContentLoader } from 'vitepress'

export interface Project {
  name: string
  slug: string
  url: string
  description: string
  status: string
  tags: string[]
  order: number
  repo: string
}

declare const data: Project[]
export { data }

export default createContentLoader('projects/*/index.md', {
  transform(raw): Project[] {
    return raw
      // Only treat pages explicitly marked as a project landing page.
      .filter((page) => page.frontmatter.project === true)
      .map((page) => {
        const slug = page.url.split('/')[2] ?? 'unknown'
        return {
          name: page.frontmatter.name ?? page.frontmatter.title ?? slug,
          slug,
          url: page.url,
          description: page.frontmatter.description ?? '',
          status: page.frontmatter.status ?? 'active',
          tags: page.frontmatter.tags ?? [],
          order: page.frontmatter.order ?? 99,
          repo: page.frontmatter.repo ?? '',
        }
      })
      .sort((a, b) => a.order - b.order)
  },
})
