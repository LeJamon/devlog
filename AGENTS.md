# Authoring guide (for the content agent)

This file is the contract for adding content. If you are an AI agent pushing
content to this repo, **read this and follow it exactly.** You only ever need to
add or edit Markdown files under `projects/`. Everything else — the homepage
feed, the per-project list, the sidebar, dates, tags — updates itself from
frontmatter. Do **not** edit `.vitepress/`, the theme, or the config to publish
content.

---

## 1. Add a devlog entry (the common case)

Create one Markdown file:

```
projects/<project-slug>/posts/YYYY-MM-DD-short-kebab-title.md
```

- `<project-slug>` is the project's folder name (e.g. `go-xrpl`).
- The filename **must start with the ISO date** `YYYY-MM-DD`. The rest is a
  short kebab-case slug. Example:
  `projects/go-xrpl/posts/2026-06-05-getting-validators-to-rejoin.md`
- One entry per file. Never overwrite an existing entry to add a new one.

### Required frontmatter

```yaml
---
title: A clear, specific headline
date: 2026-06-05            # ISO YYYY-MM-DD — drives ordering and the feed
description: One or two sentences. Shown in the feed and used for SEO/social.
tags:                      # 1–5 lowercase tags
  - consensus
  - bugfix
---
```

### Optional frontmatter

```yaml
author: go-xrpl            # shown in the entry's meta line
```

### Body

Standard Markdown after the frontmatter. Use `##` / `###` for sections
(they appear in the right-hand "On this page" outline — do **not** use a
top-level `#`, the title comes from frontmatter). Fenced code blocks with a
language work (```go, ```bash, …). Keep it real and specific; this is an
engineering log, not marketing.

That's the whole task. Once the file exists, it shows up automatically on the
project page, in the global "Latest entries" feed on the homepage, and in the
sidebar — newest first, ordered by `date`.

---

## 2. Add a new project (occasional)

1. Create the folder and a posts directory:
   `projects/<slug>/posts/`
2. Create `projects/<slug>/index.md` with this frontmatter (the `project: true`
   flag is what registers it in the grid):

   ```yaml
   ---
   project: true
   name: my-project
   title: my-project
   description: One-line description shown on the project card.
   status: active          # active | paused | archived  (controls the status dot)
   order: 2                # sort order on the homepage grid (lower = earlier)
   repo: https://github.com/owner/repo
   tags:
     - go
     - whatever
   ---

   # my-project

   Intro prose...

   ## Devlog

   <PostFeed project="my-project" />
   ```

3. Add the first entry per section 1.

The project then appears on the homepage grid and at `/projects/` automatically.

> Optional: add a nav link for the project in `.vitepress/config.ts` under
> `themeConfig.nav`. This is the *only* reason to touch config for content, and
> it's purely cosmetic.

---

## 3. Components you can drop into Markdown

These are registered globally; use them in any `.md`:

- `<PostFeed project="go-xrpl" />` — list one project's entries.
- `<PostFeed :limit="8" :show-project="true" />` — recent entries across all
  projects, with a project label column.
- `<ProjectGrid />` — the card grid of all projects.

---

## 4. Rules

- Touch **only** Markdown under `projects/` to publish. Never hand-edit the
  generated feed/sidebar — there isn't one to edit; it's derived.
- Filenames are immutable once published (they're permalinks). Fix content in
  place; don't rename to "update" a date.
- `date` must be a real ISO date and should not be in the future.
- Keep `description` to ≤ ~240 chars; it's the feed snippet.
- Prefer specific, technical writing. Show the bug, the diagnosis, the fix.
