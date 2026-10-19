import { site } from '@config/site';

export type SupportedLang = 'en' | 'fa';

/** True for Persian content. */
export function isRtl(lang: string | undefined): boolean {
  return lang === 'fa';
}

/** Resolve text direction for a language code. */
export function dirForLang(lang: string | undefined): 'rtl' | 'ltr' {
  return isRtl(lang) ? 'rtl' : 'ltr';
}

/** Normalize a frontmatter lang value to a supported language. */
export function normalizeLang(lang: string | undefined): SupportedLang {
  if (lang === 'fa') return 'fa';
  return site.i18n.defaultLang;
}

type UiDict = (typeof site.i18n.ui)['en'];
type UiKey = keyof UiDict;

/** Look up a UI string for the given language with English fallback. */
export function t(lang: string | undefined, key: UiKey): string {
  const normalized = normalizeLang(lang);
  const dict = site.i18n.ui[normalized] as Partial<UiDict>;
  const fallback = site.i18n.ui.en as UiDict;
  return dict[key] ?? fallback[key];
}

/** i18n dict key for a navbar label (e.g. "about" → "nav_about"). */
export function navKey(label: string): string {
  return `nav_${label.toLowerCase().replace(/[^a-z]/g, '')}`;
}

/**
 * Server-rendered navbar label: translated when the key exists,
 * otherwise the configured label itself (custom labels keep working).
 */
export function navLabel(lang: string | undefined, label: string): string {
  const table = site.i18n.ui[normalizeLang(lang)] as Record<string, string | undefined>;
  return table[navKey(label)] ?? label;
}

/** Persian digits for counts shown in fa chrome (۱۲ instead of 12). */
export function faDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

/** Format a count for the given language (Persian digits for fa). */
export function formatCount(n: number, lang: string | undefined): string {
  return normalizeLang(lang) === 'fa' ? faDigits(n) : String(n);
}

/** Format a date in the appropriate locale. */
export function formatPostDate(date: Date | string, lang: string | undefined): string {
  const d = date instanceof Date ? date : new Date(date);
  if (normalizeLang(lang) === 'fa') {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d);
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
