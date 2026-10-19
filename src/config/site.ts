/**
 * DINA Lab blog — site configuration
 *
 * Update the values below to personalize the site.
 * All configuration is fully typed — your editor will catch mistakes.
 */

import { FOOTNOTE_LABELS } from './footnote-labels';

// ─── Navigation types (exported for use in Navbar.astro / SearchTrigger) ────

/** A simple navigation link. */
export type NavLeaf = { label: string; href: string };

/**
 * A dropdown group. `label` is the trigger text; `children` are the menu items.
 * Maximum supported depth is 2 levels (group → item). Do not nest further.
 */
export type NavDropdown = { label: string; children: NavLeaf[] };

/** A top-level nav entry — either a plain link or a dropdown group. */
export type NavItem = NavLeaf | NavDropdown;

export const site = {
  // ─── Derived deployment values ────────────────────────────────────────────

  /** Site origin from Astro's resolved `site` option. */
  url: import.meta.env.SITE.replace(/\/$/, ''),

  /** Base path from Astro's resolved `base` option. */
  base: import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, ''),

  // ─── Identity ──────────────────────────────────────────────────────────────

  /** Site title. Shown in the browser tab and navbar. */
  title: 'DINA Lab',

  /** Site description. Used in meta tags. */
  description:
    'DINA — Distributed Infrastructure for NextGen Applications. Research lab blog and academic portfolio.',

  /** Language code for the site. */
  lang: 'en',

  // ─── Internationalization ───────────────────────────────────────────────

  i18n: {
    /** Default content language. */
    defaultLang: 'en' as 'en' | 'fa',
    /** Languages offered in the language switcher. */
    supported: ['en', 'fa'] as ('en' | 'fa')[],
    /** UI strings per language. */
    ui: {
      en: {
        blog: 'Blog',
        allTags: 'all tags',
        backToBlog: 'Blog',
        updated: 'Updated',
        by: 'By',
        toc: 'Table of Contents',
        footnotes: FOOTNOTE_LABELS.en,
        relatedTitle: 'Enjoy Reading This Article?',
        relatedSubtitle: 'Here are some more articles you might like to read next:',
        share: 'Share',
        shareOn: 'Share on',
        shareViaDevice: 'Share via device',
        shareCopy: 'Copy link',
        shareCopied: 'Copied',
        loadComments: 'Load comments',
        commentsNotice:
          'Comments are powered by Giscus (GitHub Discussions). Loading them fetches resources from GitHub.',
        searchPlaceholder: 'Search…',
        skipToContent: 'Skip to main content',
        backToTop: 'Back to top',
        copy: 'copy',
        copied: 'copied',
        subscribeTitle: 'Subscribe to updates',
        subscribe: 'Subscribe',
        newsletterDesc: 'Get notified about new posts and announcements.',
        emailAddress: 'Email address',
        nav_about: 'about',
        nav_blog: 'blog',
        nav_people: 'people',
        nav_publications: 'publications',
        lastUpdated: 'Last updated:',
        legalNotice: 'Legal Notice',
        blogName: 'DINA Blog',
        blogDesc:
          'Research notes and articles from the DINA lab — Distributed Infrastructure for NextGen Applications.',
        blogEmpty: 'No posts yet. Check back soon!',
        tagsTitle: 'tags',
        tagsBack: 'Back to blog',
        tagsEmpty: 'No tags yet.',
        postsCount: '{count} posts',
        allPosts: 'All posts',
        tagCloud: 'Tag cloud',
        postsTagged: 'Posts tagged',
        noTagPosts: 'No posts found for this tag.',
        prevPage: 'Previous page',
        nextPage: 'Next page',
        pageNum: 'Page {n}',
        peopleTitle: 'Members',
        supervisorTitle: 'Supervisor',
        membersTitle: 'Members',
        alumni: 'Alumni',
        noPeople: 'No people entries yet.',
        minReadN: '{n} min read',
        refsTitle: 'References',
        notFound: 'Page not found',
        notFoundDesc: "The page you were looking for doesn't exist or has been moved.",
        goHome: 'Go back home',
        categoryLabel: 'Category:',
        noCategoryPosts: 'No posts found for this category.',
        brandName: 'DINA Lab',
        byMany: 'Authors',
        searchNav: 'Navigation',
        searchPosts: 'Blog Posts',
        searchPeople: 'People',
        searchPublications: 'Publications',
        searchResults: 'Search Results',
        searchHintSelect: 'to select',
        searchHintNavigate: 'to navigate',
        searchHintClose: 'to close',
        pubTitle: 'publications',
        pubSearch: 'Search publications…',
        pubNoResults: 'No publications match your search.',
        pubShowingOne: 'Showing {filtered} of {total} publication',
        pubShowingMany: 'Showing {filtered} of {total} publications',
        pubDetails: 'Details',
        pubAbs: 'Abs',
        pubBib: 'Bib',
        pubSupp: 'Supp',
        pubBreadcrumb: 'Publications',
        pubAbstract: 'Abstract',
        pubCitation: 'Citation',
      },
      fa: {
        blog: 'وبلاگ',
        allTags: 'همه برچسب‌ها',
        backToBlog: 'وبلاگ',
        updated: 'به‌روزرسانی',
        by: 'نویسنده',
        toc: 'فهرست مطالب',
        footnotes: FOOTNOTE_LABELS.fa,
        relatedTitle: 'از خواندن این مطلب لذت بردید؟',
        relatedSubtitle: 'مطالب دیگری که ممکن است برایتان جالب باشد:',
        share: 'اشتراک‌گذاری',
        shareOn: 'اشتراک‌گذاری در',
        shareViaDevice: 'اشتراک‌گذاری با دستگاه',
        shareCopy: 'کپی پیوند',
        shareCopied: 'کپی شد',
        loadComments: 'نمایش دیدگاه‌ها',
        commentsNotice:
          'دیدگاه‌ها با گیسکس (بحث‌های گیت‌هاب) ارائه می‌شوند. با بارگذاری، منابعی از گیت‌هاب دریافت می‌شود.',
        searchPlaceholder: 'جستجو…',
        skipToContent: 'پرش به محتوای اصلی',
        backToTop: 'بازگشت به بالا',
        copy: 'کپی',
        copied: 'کپی شد',
        subscribeTitle: 'عضویت در خبرنامه',
        subscribe: 'عضویت',
        newsletterDesc: 'از مطالب و اطلاعیه‌های جدید باخبر شوید.',
        emailAddress: 'نشانی ایمیل',
        nav_about: 'درباره',
        nav_blog: 'وبلاگ',
        nav_people: 'اعضا',
        nav_publications: 'انتشارات',
        lastUpdated: 'آخرین به‌روزرسانی:',
        legalNotice: 'اطلاعات حقوقی',
        blogName: 'بلاگ دینا',
        blogDesc:
          'یادداشت‌ها و مقالات پژوهشی آزمایشگاه دینا — زیرساخت توزیع‌شده برای کاربردهای نسل بعد.',
        blogEmpty: 'هنوز مطلبی نیست. به‌زودی سر بزنید!',
        tagsTitle: 'برچسب‌ها',
        tagsBack: 'بازگشت به بلاگ',
        tagsEmpty: 'هنوز برچسبی نیست.',
        postsCount: '{count} مطلب',
        allPosts: 'همه مطالب',
        tagCloud: 'ابر برچسب‌ها',
        postsTagged: 'مطالب با برچسب',
        noTagPosts: 'مطلبی با این برچسب پیدا نشد.',
        prevPage: 'صفحه قبلی',
        nextPage: 'صفحه بعدی',
        pageNum: 'صفحه {n}',
        peopleTitle: 'اعضا',
        supervisorTitle: 'استاد راهنما',
        membersTitle: 'اعضا',
        alumni: 'دانش‌آموختگان',
        noPeople: 'هنوز عضوی ثبت نشده است.',
        minReadN: '{n} دقیقه مطالعه',
        refsTitle: 'منابع',
        notFound: 'صفحه پیدا نشد',
        notFoundDesc: 'صفحه‌ای که دنبالش بودید وجود ندارد یا جابه‌جا شده است.',
        goHome: 'بازگشت به خانه',
        categoryLabel: 'دسته:',
        noCategoryPosts: 'مطلبی در این دسته پیدا نشد.',
        brandName: 'آزمایشگاه دینا',
        byMany: 'نویسندگان',
        searchNav: 'ناوبری',
        searchPosts: 'مطالب وبلاگ',
        searchPeople: 'اعضا',
        searchPublications: 'انتشارات',
        searchResults: 'نتایج جستجو',
        searchHintSelect: 'برای انتخاب',
        searchHintNavigate: 'برای جابه‌جایی',
        searchHintClose: 'برای بستن',
        pubTitle: 'انتشارات',
        pubSearch: 'جستجوی انتشارات…',
        pubNoResults: 'انتشاری مطابق جستجو پیدا نشد.',
        pubShowingOne: 'نمایش {filtered} از {total} انتشار',
        pubShowingMany: 'نمایش {filtered} از {total} انتشار',
        pubDetails: 'جزئیات',
        pubAbs: 'چکیده',
        pubBib: 'بیب‌تک',
        pubSupp: 'پیوست',
        pubBreadcrumb: 'انتشارات',
        pubAbstract: 'چکیده',
        pubCitation: 'ارجاع',
      },
    },
  },

  // ─── Author ────────────────────────────────────────────────────────────────

  author: {
    /** Full name shown in navbar, page headings, and footer. */
    name: 'DINA Lab',

    /** Short email address (used in the homepage Person JSON-LD). */
    email: 'info@dina-lab.example',

    /** Path to profile photo. Place image in public/assets/img/. */
    avatar: '/assets/logo/DINA-logo.png',
  },

  // ─── Social links ──────────────────────────────────────────────────────────
  //
  // Only the keys below are consumed (Person JSON-LD + Open Graph tags).
  // Set to undefined to hide.

  socials: {
    x_username: undefined as string | undefined,
    github_username: 'DINA-Lab-IUST' as string | undefined,
    /** Google Scholar user ID — the part after user= in your Scholar URL */
    scholar_userid: undefined as string | undefined,
    orcid_id: undefined as string | undefined,
  },

  // ─── Navigation ────────────────────────────────────────────────────────────

  navbar: {
    /** Fix navbar to top of viewport. */
    fixed: true,
    /**
     * Top-level navigation items.
     * Use `{ label, href }` for a plain link.
     * Use `{ label, children: [...] }` for a dropdown group (max 2 levels).
     *
     * `href` values are relative to the site root (base is prepended automatically).
     */
    items: [
      { label: 'blog', href: '/' },
      { label: 'people', href: '/members/' },
      { label: 'publications', href: '/publications/' },
      { label: 'about', href: 'https://dina-lab-iust.github.io/' },
    ] as NavItem[],
  },

  // ─── Footer ────────────────────────────────────────────────────────────────

  footer: {
    /** Show "Last updated" timestamp in footer. */
    lastUpdated: false,
    /** Path to impressum/legal page (EU GDPR). Leave undefined to hide. */
    impressum: undefined as string | undefined,
    /**
     * Footer display mode:
     * 'sticky'  — always visible at the bottom of the viewport (default)
     * 'normal'  — sits at the natural bottom of page content (only visible when scrolled down)
     * 'hidden'  — footer is not rendered at all
     */
    position: 'sticky' as 'sticky' | 'normal' | 'hidden',
  },

  // ─── Blog ──────────────────────────────────────────────────────────────────

  blog: {
    /** Name shown in the blog page heading. */
    name: 'DINA Blog',
    description:
      'Research notes and articles from the DINA lab — Distributed Infrastructure for NextGen Applications.',
    /** Number of posts per page. */
    postsPerPage: 5,
    /**
     * Tags shown as badges on the blog listing page header.
     * Users can click them to filter posts by tag.
     */
    displayTags: [],
    /** Categories shown as badges on the blog listing page header. */
    displayCategories: [] as string[],
    /**
     * External post sources (fetched at build time).
     * Each entry is either an RSS feed URL or a list of individual post objects.
     */
    externalSources: [] as Array<{
      name: string;
      rssUrl?: string;
      posts?: Array<{ url: string; publishedDate: string }>;
      categories?: string[];
      tags?: string[];
    }>,
    /** Average reading speed (words per minute) used for reading-time estimates. */
    wordsPerMinute: 200 as number,
    /** Message shown on the blog listing page when no posts exist. */
    emptyMessage: 'No posts yet. Check back soon!',
  },

  // ─── Features ─────────────────────────────────────────────────────────────

  features: {
    /** Enable dark/light mode toggle in navbar. */
    darkmode: true,
    /** Enable ⌘K search. */
    search: true,
    /** Enable reading progress bar on blog posts. */
    progressBar: true,
    /** Show back-to-top button. */
    backToTop: true,
    /** Enable click-to-zoom on images (medium-zoom). */
    mediumZoom: true,
    /** Show styled CSS tooltips on hover for publication annotations.
     *  When false, the browser's native title-attribute tooltip is used instead. */
    tooltips: false,
    /** Enable GDPR-compliant cookie consent dialog. */
    cookieConsent: false,
    /** Enable newsletter subscription form. */
    newsletter: false,
    /**
     * Enable Astro View Transitions for smooth page-to-page animations.
     * Disable if you prefer full page reloads (e.g. for accessibility reasons).
     */
    viewTransitions: true,
    /** Show social sharing links (X, LinkedIn, Telegram, WhatsApp, Discord, email) at the bottom of blog posts. */
    socialShare: true,
  },

  // ─── Giscus comments ──────────────────────────────────────────────────────
  // Follow setup at https://giscus.app/ then fill in the values below.

  giscus: {
    /** Set to true once you've configured the fields below. */
    enabled: false,
    /**
     * When true, Giscus is hidden behind a "Load comments" button — the
     * giscus.app script is only fetched after the user opts in.
     * Recommended for GDPR compliance (giscus sets third-party cookies).
     * Default: true.
     */
    lazyLoad: true,
    repo: '' as `${string}/${string}`,
    repoId: '',
    category: 'Comments',
    categoryId: '',
    /** How to map discussions to pages. */
    mapping: 'title' as 'pathname' | 'url' | 'title' | 'og:title',
    strict: true,
    reactionsEnabled: true,
    inputPosition: 'bottom' as 'top' | 'bottom',
    darkTheme: 'dark',
    lightTheme: 'light',
    lang: 'en',
  },

  // ─── Analytics ────────────────────────────────────────────────────────────

  analytics: {
    /** Google Analytics 4 measurement ID (format: G-XXXXXXXXXX). */
    ga4: '' as string,
    /** Cronitor RUM analytics site ID. */
    cronitor: '' as string,
    /** Pirsch analytics site ID. */
    pirsch: '' as string,
    /** OpenPanel analytics client ID. */
    openpanel: '' as string,
    /** Google Search Console verification ID. */
    googleVerification: '' as string,
    /** Bing Webmaster verification ID. */
    bingVerification: '' as string,
  },

  // ─── Open Graph ───────────────────────────────────────────────────────────

  og: {
    /** Include Open Graph meta tags. */
    enabled: true,
    /** Default OG image path (in public/). */
    image: '' as string,
  },

  // ─── Newsletter ───────────────────────────────────────────────────────────

  newsletter: {
    /** Loops.so form endpoint. */
    endpoint: '' as string,
  },

  // ─── Publications ─────────────────────────────────────────────────────────

  publications: {
    /**
     * Show badges for individual publication entries.
     * Can be disabled globally here; also toggleable per entry in BibTeX.
     */
    badges: {
      altmetric: true,
      dimensions: true,
      googleScholar: true,
      inspirehep: true,
    },
    /**
     * Max number of authors shown before "and N more..." link.
     * Set to undefined to always show all authors.
     */
    maxAuthorLimit: 3 as number | undefined,
    /** Enable thumbnail images for publications (if `preview` set in BibTeX). */
    thumbnails: true,
    /**
     * Last name used to italicise your name in publication author lists.
     * Defaults to the last word of `site.author.name` when not set.
     * Override explicitly if your publications use a different name form.
     */
    authorLastName: undefined as string | undefined,
    /** Path prefix (relative to public/) for publication preview images. */
    previewDir: '/assets/img/publication_preview/',
    /** Path prefix (relative to public/) for publication PDFs and supplements. */
    pdfDir: '/assets/pdf/',
    /** UI labels — override for non-English sites. */
    labels: {
      abstract: 'Abs',
      bibtex: 'Bib',
      supp: 'Supp',
      searchPlaceholder: 'Search publications\u2026',
      noResults: 'No publications match your search.',
    },
  },

  // ─── Comments ─────────────────────────────────────────────────────────────

  comments: {
    /**
     * Disqus shortname — the subdomain part of YOUR-SHORTNAME.disqus.com.
     * Required when a post sets `disqus: true` in frontmatter.
     * Leave empty string if not using Disqus.
     */
    disqusShortname: '' as string,
  },

  // ─── Page copy ────────────────────────────────────────────────────────────
  // (Per-page descriptions; add entries here only for pages that exist.)

  pages: {},

  // ─── Theme defaults ───────────────────────────────────────────────────────

  theme: {
    /**
     * Default color theme.
     * 'system' follows OS preference.
     */
    default: 'system' as 'light' | 'dark' | 'system',

    /**
     * Primary accent color used for links, active nav items, badges, and highlights.
     * Accepts any CSS color string (hex, hsl, rgb, etc.).
     * Set to 'auto' to use the built-in defaults (purple in light mode, cyan in dark mode).
     *
     * Example presets:
     *   Purple (default): { light: '#b509ac', dark: '#2698ba' }
     *   Blue:             { light: '#0076df', dark: '#68c0d9' }
     *   Red:              { light: '#ff3636', dark: '#f29105' }
     *   Green:            { light: '#009f06', dark: '#b7d12a' }
     *   Orange:           { light: '#f29105', dark: '#efcc00' }
     *   Custom hover:     { light: '#0076df', dark: '#68c0d9', hoverLight: '#0a53be', hoverDark: '#9fd8ea' }
     */
    color: {
      light: 'auto' as string,
      dark: 'auto' as string,
      hoverLight: 'auto' as string,
      hoverDark: 'auto' as string,
    },
  },
} as const;

export type SiteConfig = typeof site;
