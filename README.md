# Devlog

An engineering devlog, tracked per project, with a technical-minimal UI.Built with [VitePress](https://vitepress.dev)
and deployed to GitHub Pages. Content is plain Markdown — an AI agent (or a
human) adds entries by dropping files under `projects/`, and the homepage feed,
per-project lists, and sidebar regenerate themselves.

First project tracked: **go-xrpl**.

## Quick start

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # production build → .vitepress/dist
npm run preview    # serve the production build locally
```

Requires Node 18+ (developed on Node 20+).

## Adding content

See **[AGENTS.md](./AGENTS.md)** for the full authoring contract. The short
version — add one Markdown file:

```
projects/go-xrpl/posts/YYYY-MM-DD-some-slug.md
```

with frontmatter:

```yaml
---
title: A clear headline
date: 2026-06-05
description: One or two sentences for the feed.
tags: [consensus, bugfix]
---
```

…and it appears everywhere automatically. You never edit the theme or config to
publish.

## How it works

| Concern | Where | Notes |
| --- | --- | --- |
| Entries | `projects/<slug>/posts/*.md` | Frontmatter-driven; date orders them |
| Project metadata | `projects/<slug>/index.md` (`project: true`) | Powers the grid + cards |
| Homepage feed / grid | `posts.data.ts`, `projects.data.ts` | VitePress content loaders, build-time |
| Sidebar | `.vitepress/config.ts` (`buildSidebar`) | Generated from the filesystem |
| Look & feel | `.vitepress/theme/custom.css` | ritual.net-inspired dark theme |
| Layout / components | `.vitepress/theme/` | Vue 3 SFCs |

## Deployment (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to
`main`. One-time setup:

1. Create the GitHub repo and push this directory to it.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. Push to `main`. The site publishes to
   `https://<owner>.github.io/<repo>/`.

> **`base` path must match the repo name.** This repo assumes
> `https://LeJamon.github.io/devlog/`, so `base` is `/devlog/` in
> `.vitepress/config.ts`. If your repo name or owner differs, edit the
> `REPO_OWNER` / `REPO_NAME` constants at the top of that file. For a
> user/org site (`<owner>.github.io`) or a custom domain, set the repo name so
> `base` becomes `/` (or hardcode `BASE = '/'`).

## License

Content © its authors. Tooling under the MIT License.
