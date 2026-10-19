/**
 * Single source of truth for the footnotes section label.
 *
 * GFM renders the footnotes heading (and the table-of-contents entry that
 * mirrors it) with the English word "Footnotes". Two consumers need the
 * localized wording:
 *
 *   - `rehypeLocalizeFootnotes` (astro.config.mjs) rewrites the heading at
 *     build time for the article's language.
 *   - the UI dictionary `site.i18n.ui` (src/config/site.ts) feeds the
 *     server-rendered table of contents.
 *
 * Keeping the values here means the two can never drift apart.
 */
export const FOOTNOTE_LABELS: Record<string, string> = {
  en: 'Footnotes',
  fa: 'پانویس',
};
