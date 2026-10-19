<div align="center">

# DINA Lab Blog

Bilingual academic blog and publication portal for the DINA Laboratory.

[![CI](https://github.com/DINA-Lab-IUST/blog/actions/workflows/ci.yml/badge.svg)](https://github.com/DINA-Lab-IUST/blog/actions/workflows/ci.yml)
[![Deploy](https://github.com/DINA-Lab-IUST/blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/DINA-Lab-IUST/blog/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[Live Site](https://dina-lab-iust.github.io/blog/) · [Publications](https://dina-lab-iust.github.io/blog/publications/) · [Members](https://dina-lab-iust.github.io/blog/members/) · [Report a bug](https://github.com/DINA-Lab-IUST/blog/issues/new?labels=bug) · [Request a feature](https://github.com/DINA-Lab-IUST/blog/issues/new?labels=enhancement)

</div>

---

## About

DINA Lab Blog is the public web presence of the DINA Laboratory — Distributed Infrastructure for NextGen Applications — at Iran University of Science and Technology. The repository is a static Astro site that serves two audiences at once: lab members who publish research notes and announcements, and readers who follow the lab's publications and people.

The site is bilingual. Every post declares its own language in frontmatter, and the site chrome (navigation, footer, listings, search, labels) can be switched between English and Persian at runtime, with full right-to-left support for Persian. Content pillars are blog posts, publications, and lab members. The output is fully static and is deployed to GitHub Pages by a workflow on every push to `main`.

## Features

### Content & i18n

- Bilingual posts — language declared per-post via frontmatter (`lang: en | fa`)
- Runtime chrome-language toggle (English / Persian) with RTL support, persisted in localStorage
- Content-zone isolation: posts, cards, and publications follow their own language and direction regardless of the site chrome

### Writing toolkit

- MDX posts with reusable components: `Figure`, `Tabs`, `VideoEmbed`, `AudioPlayer`, `JupyterNotebook`
- Distill-style layout for research articles (`distill: true`)
- KaTeX math, Mermaid, Vega-Lite, Chart.js, Plotly, TikZ, pseudocode, Typograms — all opt-in per post
- Build-time Jupyter notebook rendering (no Python at runtime)

### Publications

- BibTeX-driven publications page with per-year grouping
- Live search across titles, authors, venues, years
- Badges: Google Scholar citation counts, Altmetric, Dimensions, InspireHEP (per-entry opt-in)
- Co-author link resolution via `coauthors.yml`
- Automatic citation-count refresh via weekly GitHub Action

### Discovery & polish

- Full-text search with Pagefind (build-time index) and a keyboard-driven command palette
- Dark / light theme with system-preference detection
- Auto-generated Open Graph images via Satori
- Reading progress, table of contents, related posts, RSS, sitemap
- Medium-zoom for post images, reading-time estimates

### Engineering

- Strict TypeScript, ESLint flat config, Prettier, simple-import-sort
- Vitest for utilities, Playwright for smoke tests
- GitHub Actions CI (type-check, lint, unit tests, build) and CD
- Husky + lint-staged + commitlint for conventional commits

## Tech Stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Astro 6 (static output)                 |
| UI islands | React 19                                |
| Styling    | Tailwind CSS 4 + CSS custom properties  |
| Content    | Astro Content Collections + MDX         |
| Search     | Pagefind                                |
| Testing    | Vitest (unit), Playwright (e2e)         |
| Tooling    | Yarn 4, ESLint, Prettier, Husky         |
| Deployment | GitHub Pages                            |

## Getting Started

### Prerequisites

- Node.js 24 or newer
- Yarn 4 (via Corepack — Node ships it)

### Local setup

```bash
corepack enable
git clone https://github.com/DINA-Lab-IUST/blog.git
cd blog
yarn install --immutable
cp .env.example .env
# edit .env — set ASTRO_SITE and ASTRO_BASE
yarn dev
```

The dev server runs at `http://localhost:4321`. When `ASTRO_BASE` is set, pages are served under that prefix.

### Environment variables

Only two variables are used, both consumed by `astro.config.mjs` and re-exported through `src/config/site.ts`:

| Variable     | Purpose                              | Example                             |
| ------------ | ------------------------------------ | ----------------------------------- |
| `ASTRO_SITE` | Public origin of the deployed site   | `https://dina-lab-iust.github.io`   |
| `ASTRO_BASE` | Base path for GitHub project pages   | `/blog`                             |

Leave `ASTRO_BASE` empty for user/org pages; set it to `/repo-name` for project pages.

## Project Structure

```
src/
  components/    Reusable Astro + React components
  layouts/       Base, Page, Post, Distill layouts
  pages/         Route handlers (blog, members, publications, feeds)
  content/       Post and people MDX/MD files
  data/          BibTeX, citation counts, co-author links
  config/        Single source of truth: site.ts
  styles/        Global CSS, color tokens, typography
  utils/         Pure helpers (bibtex, i18n, reading-time, search)
public/
  assets/        Favicons, logos, JS shims, sample SVGs
scripts/         Content validation + citation refresh
e2e/             Playwright smoke tests
.github/         CI, Deploy, Citation refresh, Release-please
```

## Writing Content

### Adding a blog post

Create `src/content/posts/<slug>.mdx` (or `.md` for plain Markdown). Minimum frontmatter:

```yaml
---
title: Your post title
date: 2026-01-15
description: One-line summary shown in listings and search.
tags: [tag-one, tag-two]
categories: [research]
lang: en              # or 'fa' for Persian
authors: [member-slug]
---
```

Optional fields (`math`, `toc`, `relatedPosts`, `pinned`, `hidden`, `draft`, `robots`, `lastmod`, `redirect`, `image`, `distill`, `refs`, and the per-post chart and render flags) are documented in `src/content.config.ts`.

### Adding a publication

Open `src/data/papers.bib` and append one BibTeX entry per publication. Required: `title`, `author`, `year`, and one of `journal` / `booktitle` / `publisher`. Strongly recommended:

- `abbr` — short venue abbreviation shown as a pill on the card
- `abstract` — enables the Abstract toggle
- `doi` — enables DOI link, DOI-based badges, citation counting
- `preview` — thumbnail filename under `public/assets/img/publication_preview/`
- `pdf` — filename under `public/assets/pdf/`
- `google_scholar_id` — required for citation counts
- `bibtex_show: true` — enables the Bib toggle

Persian-language entries should set `lang: fa` and may provide `author_fa` for localized author display.

After editing, run:

```bash
yarn citations:update
yarn content:check
```

### Adding a lab member

Create `src/content/people/<slug>.md` where `<slug>` is what posts reference in `authors`. Minimum:

```yaml
---
name: Full Name
role: PhD Student
group: current        # 'supervisor' | 'current' | 'alumni'
photo: /assets/img/people/photo.jpg
focus: [federated-learning, llm-infrastructure]
website: https://example.com
github: username
---
```

Optional Persian fields: `nameFa`, `roleFa`, `descriptionFa`. The members page renders bilingual blocks based on the visitor's chrome language.

### Validating content

```bash
yarn content:check
```

This runs `scripts/check-content.ts` — a fast frontmatter validator that catches typos in `authors`, `refs`, `lang`, and image paths without a full build. It runs automatically in CI on content-only PRs.

## Development Commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `yarn dev`             | Start the dev server                     |
| `yarn build`           | Static build + Pagefind index            |
| `yarn preview`         | Preview the production build locally     |
| `yarn check`           | Astro's type-check pass                  |
| `yarn test:types`      | `astro check` + `tsc --noEmit`           |
| `yarn lint`            | ESLint with autofix                      |
| `yarn lint:ci`         | ESLint without writes                    |
| `yarn format`          | Prettier                                 |
| `yarn test`            | Vitest unit tests                        |
| `yarn test:watch`      | Vitest in watch mode                     |
| `yarn test:e2e`        | Playwright smoke tests                   |
| `yarn test:all`        | Full gate: types, lint, unit, e2e        |
| `yarn content:check`   | Fast frontmatter validation              |
| `yarn citations:update` | Refresh citation counts from OpenAlex   |

## Testing

- Unit tests (Vitest, happy-dom environment) cover pure utilities: BibTeX parsing, i18n helpers, reading time, search rank, copy buttons, author linking. Run with `yarn test`.
- End-to-end tests (Playwright, Chromium) cover critical paths: homepage, members, publications, dark-mode persistence, language switch, 404. Run with `yarn test:e2e`. The config uses `yarn preview` against a fresh build.
- CI splits into two jobs based on changed paths (`dorny/paths-filter`):
  - Content-only PRs run `yarn content:check` only (fast).
  - Template PRs run the full gate: `test:types` → `lint:ci` → `test` → `build`.

## Deployment

Deployment is fully automated via `.github/workflows/deploy.yml` on every push to `main`:

1. Checkout, install, `yarn build` with `ASTRO_SITE` and `ASTRO_BASE` read from repository variables.
2. Commit updated `src/data/citations.yml` if the citation refresh produced changes.
3. Upload the `dist/` artifact and deploy to GitHub Pages.

Repository variables to set (Settings → Secrets and variables → Actions → Variables):

- `ASTRO_SITE` — e.g. `https://dina-lab-iust.github.io`
- `ASTRO_BASE` — e.g. `/blog` (leave empty for user/org pages)

Falls back to the DINA Lab deployment defaults if the variables are unset.

## Contributing

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint.
- Pre-commit hook runs `lint-staged` (ESLint on TS/TSX/Astro, Prettier on JSON/CSS/MD/YAML).
- Before opening a PR:

  ```bash
  yarn test:types
  yarn lint:ci
  yarn test
  yarn test:e2e
  ```

- For content-only contributions (posts, people, bib entries), CI runs the fast `content:check` path.
- Keep pull requests focused. One concern per PR.

## License

Released under the MIT License — see [`LICENSE`](./LICENSE). The upstream theme's
copyright notice is retained in the same file.

## Acknowledgements

- Original theme foundation: [as-folio](https://github.com/dadangnh/as-folio) by Dadang NH (MIT).
- Academic layout inspiration: [al-folio](https://github.com/alshedivat/al-folio).
- Distill-style research layout inspiration: [Distill](https://distill.pub/).
