import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// ─── Posts ─────────────────────────────────────────────────────────────────

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    categories: z.array(z.string()).optional().default([]),
    /** Content language: "en" (LTR) or "fa" (RTL). Defaults to "en". */
    lang: z.enum(['en', 'fa']).optional().default('en'),
    /** Author slugs matching src/content/people/*.md ids. Shown with links to profiles. */
    authors: z.array(z.string()).optional().default([]),
    /**
     * Manual cross-references to other posts (by collection id, e.g. "my-post" or
     * "my-post-fa"). Rendered as a References/منابع section with title links.
     */
    refs: z.array(z.string()).optional().default([]),
    /** Enable KaTeX math rendering. */
    math: z.boolean().optional().default(false),
    /** Show table of contents sidebar. */
    toc: z.boolean().optional().default(true),
    /** Show related posts section. */
    relatedPosts: z.boolean().optional().default(false),
    /** Pin to top of blog listing. */
    pinned: z.boolean().optional().default(false),
    /** Hide from blog listing (but accessible via direct URL). */
    hidden: z.boolean().optional().default(false),
    /** Draft post — hidden from all listings and the search index until published. */
    draft: z.boolean().optional().default(false),
    /** Override the robots meta tag (e.g. 'noindex, nofollow'). Useful for sensitive posts. */
    robots: z.string().optional(),
    /** Last modified date — displayed in the post header and used in JSON-LD dateModified. */
    lastmod: z.coerce.date().optional(),
    /** Redirect to external URL instead of rendering content. */
    redirect: z.string().url().optional(),
    /** Hero/thumbnail image path. */
    image: z.string().optional(),
    /** Distill layout — renders as a Distill article. */
    distill: z.boolean().optional().default(false),
    /** Authors for Distill-style posts. */
    distillAuthors: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url().optional(),
          affiliations: z.object({ name: z.string() }).optional(),
        }),
      )
      .optional(),
    /** BibTeX bibliography file reference for Distill posts. */
    bibliography: z.string().optional(),
    /** Citation key for this post (used in bibliography). */
    citation_key: z.string().optional(),
    /** Load Mermaid diagram rendering on this post. */
    mermaid: z.boolean().optional().default(false),
    /** Load Chart.js on this post. */
    chart_js: z.boolean().optional().default(false),
    /** Load Apache ECharts on this post. */
    echarts: z.boolean().optional().default(false),
    /** Load Vega/Vega-Lite on this post. */
    vega: z.boolean().optional().default(false),
    /** Load Plotly.js on this post. */
    plotly: z.boolean().optional().default(false),
    /** Load pseudocode.js on this post. */
    pseudocode: z.boolean().optional().default(false),
    /** Load Typograms on this post. */
    typograms: z.boolean().optional().default(false),
    /** Load TikzJax on this post. */
    tikzjax: z.boolean().optional().default(false),
    /** Load Leaflet maps on this post. */
    map: z.boolean().optional().default(false),
    /** Load img-comparison-slider on this post. */
    img_comparison: z.boolean().optional().default(false),
    /** Load Diff2Html on this post. */
    code_diff: z.boolean().optional().default(false),
    /** Load PhotoSwipe gallery on this post. */
    gallery: z.boolean().optional().default(false),
    /** Enable Disqus comments on this post. */
    disqus: z.boolean().optional().default(false),
  }),
});

// ─── People ────────────────────────────────────────────────────────────────

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    /** Persian display name (shown as a bilingual block). */
    nameFa: z.string().optional(),
    /** Persian role (shown as a bilingual block). */
    roleFa: z.string().optional(),
    /** Photo path in public/assets/img/ (remote https:// URLs allowed). */
    photo: z.string().optional(),
    /** Brief description shown on profile card. */
    description: z.string().optional(),
    /** Persian description shown as a bilingual block. */
    descriptionFa: z.string().optional(),
    /** Personal website. */
    website: z.string().url().optional(),
    /** GitHub username. */
    github: z.string().optional(),
    /** LinkedIn profile URL or username. */
    linkedin: z.string().optional(),
    /** Research focus areas shown as chips (from lab focus data). */
    focus: z.array(z.string()).optional().default([]),
    /** Google Scholar user ID. */
    scholar: z.string().optional(),
    /** ORCID ID. */
    orcid: z.string().optional(),
    /** Sort order. */
    importance: z.number().optional().default(999),
    /** 'supervisor' | 'current' | 'alumni' */
    group: z.enum(['supervisor', 'current', 'alumni']).optional().default('current'),
  }),
});

export const collections = { posts, people };
