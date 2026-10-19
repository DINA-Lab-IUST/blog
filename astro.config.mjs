// Pinned to 7.2.0 (7.2.1 breaks Shiki in mdx blocks) — bump with astro.
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import Icons from 'unplugin-icons/vite';
import { loadEnv } from 'vite';

import { FOOTNOTE_LABELS } from './src/config/footnote-labels.ts';

/**
 * Deployment config is env-first: `.env` is loaded explicitly so both
 * `yarn dev` and `yarn build` see the same values without extra setup.
 * Real environment variables (e.g. GitHub Actions repository variables)
 * take precedence over the `.env` file.
 */
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const ASTRO_SITE = process.env.ASTRO_SITE || fileEnv.ASTRO_SITE || 'https://example.github.io';
const ASTRO_BASE = (process.env.ASTRO_BASE ?? fileEnv.ASTRO_BASE ?? '').replace(/\/$/, '');

/**
 * Remark plugin: rewrite root-relative src/href inside raw HTML blocks in .md files.
 * Markdown raw HTML (e.g. <img src="/assets/...">) stays as mdast 'html' nodes and
 * is never parsed into hast elements — string replacement is the only reliable path.
 */
function remarkBasePaths() {
  const base = ASTRO_BASE;
  if (!base) return (tree) => tree;

  // Match src="/" or href="/" but not src="//" (protocol-relative)
  const re = /((?:src|href)=")\/(?!\/)/g;

  function walk(node) {
    if (node.type === 'html' && typeof node.value === 'string') {
      node.value = node.value.replace(re, `$1${base}/`);
    }
    node.children?.forEach(walk);
  }

  return (tree) => walk(tree);
}

/**
 * Rehype plugin: rewrite root-relative src/href on hast element nodes.
 * Handles standard markdown images (![](/)  → <img src="/">) and MDX JSX elements
 * after remark-rehype converts them to hast.
 */
function rehypeBasePaths() {
  const base = ASTRO_BASE;
  if (!base) return (tree) => tree;

  function walk(node) {
    if (node.type === 'element') {
      const src = node.properties?.src;
      if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')) {
        node.properties.src = `${base}${src}`;
      }
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
        node.properties.href = `${base}${href}`;
      }
    }
    node.children?.forEach(walk);
  }

  return (tree) => walk(tree);
}

/**
 * Rehype plugin: give every <table> an explicit `dir` derived from the dominant
 * script of its own content. This makes table alignment per-table rather than
 * per-article: a fully Persian table renders RTL inside an English post, and a
 * fully English table stays LTR inside a Persian post.
 *
 * Tables that already declare `dir` (e.g. raw HTML `<table dir="rtl">`) are left
 * untouched, so authors keep manual control. Tables without any strong-direction
 * letters (numeric-only) are also left untouched and simply inherit the article.
 */
function rehypeTableDirection() {
  const RTL_RANGES = [
    [0x0590, 0x05ff], // Hebrew
    [0x0600, 0x06ff], // Arabic
    [0x0700, 0x074f], // Syriac
    [0x0750, 0x077f], // Arabic Supplement
    [0x0780, 0x07bf], // Thaana
    [0x07c0, 0x07ff], // NKo
    [0x08a0, 0x08ff], // Arabic Extended-A
    [0xfb1d, 0xfb4f], // Hebrew presentation forms
    [0xfb50, 0xfdff], // Arabic presentation forms A
    [0xfe70, 0xfeff], // Arabic presentation forms B
  ];
  const LTR_RANGES = [
    [0x0041, 0x005a], // A-Z
    [0x0061, 0x007a], // a-z
    [0x00c0, 0x024f], // Latin supplement / extended
    [0x0370, 0x03ff], // Greek
    [0x0400, 0x04ff], // Cyrillic
    [0x0530, 0x058f], // Armenian
  ];

  const inRanges = (code, ranges) => ranges.some(([lo, hi]) => code >= lo && code <= hi);

  const textOf = (node) => {
    if (node.type === 'text') return node.value;
    if (!node.children) return '';
    return node.children.map(textOf).join(' ');
  };

  const directionOf = (text) => {
    let rtl = 0;
    let ltr = 0;
    let first = null;
    for (const ch of text) {
      const code = ch.codePointAt(0);
      const isRtl = inRanges(code, RTL_RANGES);
      const isLtr = inRanges(code, LTR_RANGES);
      if (!isRtl && !isLtr) continue;
      if (first === null) first = isRtl ? 'rtl' : 'ltr';
      if (isRtl) rtl += 1;
      else ltr += 1;
    }
    if (rtl === 0 && ltr === 0) return null;
    if (rtl === ltr) return first;
    return rtl > ltr ? 'rtl' : 'ltr';
  };

  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'table' && !node.properties?.dir) {
      const dir = directionOf(textOf(node));
      if (dir) node.properties = { ...node.properties, dir };
    }
    node.children?.forEach(walk);
  };

  return (tree) => walk(tree);
}

/**
 * Rehype plugin: GFM renders the footnotes section with the English word
 * "Footnotes" in a screen-reader-only heading. Rename it to the article's own
 * language (from frontmatter) so a Persian post shows "پانویس" — both in the
 * heading and in the table of contents that mirrors it. Languages missing from
 * the shared map are left untouched.
 */
function rehypeLocalizeFootnotes() {
  return (tree, file) => {
    const label = FOOTNOTE_LABELS[file?.data?.astro?.frontmatter?.lang];
    if (!label) return;

    const walk = (node) => {
      if (node.tagName === 'h2' && node.properties?.id === 'footnote-label') {
        node.children = [{ type: 'text', value: label }];
        return;
      }
      node.children?.forEach(walk);
    };

    walk(tree);
  };
}

// https://astro.build/config
//
// Deployment config is env-first:
// - local development: copy `.env.example` to `.env`
// - GitHub Pages: set repository variables `ASTRO_SITE` and `ASTRO_BASE`
//
// `src/config/site.ts` consumes the resolved Astro values via
// `import.meta.env.SITE` and `import.meta.env.BASE_URL`; it is not the
// source of truth for deployment URLs.
export default defineConfig({
  site: ASTRO_SITE, // override via ASTRO_SITE env var or edit directly
  base: ASTRO_BASE, // override via ASTRO_BASE env var or set '/repo-name' for project pages
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    // Allow Astro's <Image> component to optimise images from these remote domains.
    // Used for book covers (Open Library) and GitHub stats cards.
    domains: [
      'covers.openlibrary.org',
      'github-readme-stats.vercel.app',
      'github-profile-trophy.vercel.app',
    ],
  },
  integrations: [
    react(),
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  vite: {
    // Icons are provided by unplugin-icons: each icon is a static
    // `~icons/<collection>/<name>` import compiled to a zero-JS inline SVG.
    // An unknown icon name fails the build (unresolved import) instead of a
    // silent warning, so there is no hand-maintained include list to drift.
    plugins: [tailwindcss(), Icons({ compiler: 'astro' })],
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '@assets': '/src/assets',
        '@config': '/src/config',
        '@utils': '/src/utils',
        '@content': '/src/content',
        '@data': '/src/data',
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Shorter, readable asset paths (e.g. _s/abc123.js instead of _astro/abc123.js)
          assetFileNames: '_s/[hash][extname]',
          chunkFileNames: '_s/[hash].js',
          entryFileNames: '_s/[hash].js',
        },
      },
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkBasePaths],
      rehypePlugins: [
        [rehypeKatex, { strict: false }],
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        ],
        rehypeBasePaths,
        rehypeTableDirection,
        rehypeLocalizeFootnotes,
      ],
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
