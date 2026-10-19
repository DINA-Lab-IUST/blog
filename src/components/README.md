# Components

UI inventory for the DINA Lab blog. Components are grouped by folder; the language
rule below applies to everything here.

## Language rule (chrome vs. content)

The site chrome (navbar, footer, blog hero, tag/archive headers, pagination, search
palette, members page, publications search box and result counts) follows the visitor's
site-language switch. Chrome strings carry `data-i18n="key"` attributes and are swapped
live by `LabI18n.astro`, which reads the dictionary in `src/config/site.ts`.

Content zones (posts, post cards, related/ref cards, TOC, share, comments, publication
entries — including their card labels and detail-page headings) are monolingual: they
render in their own `lang` and must never carry `data-i18n*`. Direction is pinned on the
zone itself (`dir` plus an explicit `text-align`) because `text-align` inherits across
`dir` boundaries. See the "Content-zone isolation" block in `src/styles/global.css`.

## Layouts (`src/layouts/`)

| Component     | Purpose                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| `Base.astro`  | Root HTML shell: `<head>`, meta/OG, dark mode, View Transitions, global scripts. Props: `title`, `description`, `image`, `noindex`, `robots`, `isHome`, `lang`, `dir`, `contentDir`. Named slot: `head`. |
| `Page.astro`  | `Base` plus a centred `.page-container`. Props: same as `Base` (pass `dir` only for wholly English-only pages; `contentDir` when the page holds one content zone — it moves the back-to-top button). |
| `Post.astro`  | Blog post: breadcrumb, hero banner, byline, TOC sidebar, body, refs, related posts, share, comments. Props: `post`, `headings`. Renders in the post's language. |
| `Distill.astro` | Distill-style article layout with its own TOC and typography. Props: `post`, `headings`. |

## Top level (`src/components/`)

| Component              | Purpose                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| `Navbar.astro`         | Sticky glass navbar with menus, search trigger, theme toggle, language switcher. Prop: `lang`. |
| `Footer.astro`         | Bilingual footer line (lab name linked to the main site, Jalali year for fa). |
| `LabI18n.astro`        | Inline chrome-language engine (no props). Included by `Base.astro`.  |
| `LanguageSwitcher.astro` | EN / فارسی links. Default language links to the clean URL, others use `?lang=`. |
| `ThemeToggle.astro`    | Light/dark toggle.                                                   |
| `ReadingProgress.astro` | Top reading-progress bar on posts (feature-gated).                  |
| `Pagination.astro`     | Numbered pagination with translated labels and Persian digits.       |
| `PersonCard.astro`     | Lab member card. Props: `person`, `lead`, `horizontal`.              |
| `TOC.astro`            | Table of contents. Props: `headings`, `lang` (pins the post language). |
| `Giscus.astro`         | GitHub Discussions comments. Prop: `lang`.                           |
| `Newsletter.astro`     | Loops.so subscribe form (feature-gated). Prop: `lang`.               |
| `JupyterNotebook.astro` | Notebook-style cells with Shiki highlighting and a Colab/Binder bar. Props: `cells`, `language`, `colabUrl`, `binderUrl`, `notebookHref`. |
| `Figure.astro`         | Figure with caption and optional zoom.                               |
| `Tabs.astro`           | Segmented tab group (ARIA tabs: roving tabindex + arrow/Home/End keys, direction-aware). Props: `tabs`, `id`. |
| `VideoEmbed.astro`     | Responsive YouTube/Vimeo/MP4 embed. Props: `src`, `title`, `caption`, `aspect`. |
| `AudioPlayer.astro`    | Accessible HTML5 audio player. Props: `src`, `title`, `caption`, `type`. |

The four media/diagram components (`Figure`, `Tabs`, `VideoEmbed`, `AudioPlayer`) are a
content-authoring toolkit: import them from an `.mdx` post when you need them.

## Blog (`src/components/blog/`)

| Component            | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `BlogListing.astro`  | Listing page (hero, pinned + paged post rows). Props: `pagePosts`, `pinnedPosts`, `currentPage`, `totalPages`, `prevUrl`, `nextUrl`, `basePath`. |
| `PostCard.astro`     | Post card / row used in listings. Prop: `post`. Renders in the post's language. |
| `PostMeta.astro`     | Date, reading time, tags. Props: `date`, `tags`, `categories`, `readingTime`, `lang`. |
| `PostRefs.astro`     | Numbered cross-reference list. Props: `refs`, `lang`.                  |
| `RelatedPosts.astro` | Related-post cards. Props: `posts`, `lang`.                            |
| `SocialShare.astro`  | Share buttons. Props: `title`, `url`, `description`, `lang`.           |

## Search (`src/components/search/`)

| Component           | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `SearchTrigger.astro` | ⌘K button + Pagefind palette. Ranks tags → titles → member names → member focuses → other metadata → Pagefind full-text hits, and deep-links members to `/members/#<slug>`. |
| `@utils/search-actions` | Turns Pagefind hits into palette actions (raw query in `keywords`), keeps `ninja-keys`' own filter from hiding body-only matches or throwing on queries like `c++`, and exposes `matchesAllTokens` / `matchRank` / `pagePath` for ranking and de-duplicating results. |

## Publications (`src/components/publications/`)

| Component                | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `BibSearch.tsx`          | React island: full-text + year search, grouped by year, expandable abstract/BibTeX panels. Each entry card renders in its own BibTeX `lang` (dir, font and labels); search box and counts stay site chrome. |
| `BadgeSet.tsx`           | Altmetric / Dimensions / Google Scholar / InspireHEP badge row.    |
| `GoogleScholarBadge.tsx` | Google Scholar citation badge with live count.                     |
| `InspireHEPBadge.tsx`    | InspireHEP badge.                                                  |
