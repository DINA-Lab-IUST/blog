/**
 * Pagefind hits → ninja-keys actions, plus the guard rails the palette needs.
 *
 * ninja-keys re-filters every action it is handed against the typed text, and
 * it only inspects `title` and `keywords`. A full-text hit whose words live in
 * the page body — the entire point of Pagefind — would therefore vanish from
 * the palette and leave the visitor with an empty list. Each action therefore
 * carries the raw query (plus the highlighted excerpt) as `keywords`, so every
 * genuine hit stays listed.
 *
 * That same internal filter builds a regular expression straight from the typed
 * text, which `installLiteralFilter` neutralises so queries such as `c++`
 * cannot break the palette.
 */

export type PagefindHit = {
  url: string;
  meta?: { title?: string } | null;
  excerpt?: string;
};

export type SearchAction = {
  id: string;
  title: string;
  section: string;
  keywords: string;
  /** The page the entry opens — used to drop duplicate Pagefind hits. */
  path: string;
  handler: () => void;
};

/** Characters that carry a special meaning inside a regular expression. */
const REGEX_META = /[.*+?^${}()|[\]\\]/g;

export function escapeSearchQuery(query: string): string {
  return query.replace(REGEX_META, '\\$&');
}

export function unescapeSearchQuery(query: string): string {
  return query.replace(/\\(.)/g, '$1');
}

export type LiteralFilter = {
  /** Back to what the visitor typed, from ninja-keys' own `change` payload. */
  query: (payload: string) => string;
};

/**
 * `ninja-keys` narrows the palette with `new RegExp(typedText)`, so a query such
 * as `c++`, `(` or `a**` throws inside its render and freezes the list on the
 * previous results. Redefining the `_search` field it owns keeps a valid,
 * literal copy for that filter, and `query()` undoes the escaping for search.
 */
export function installLiteralFilter(el: { _search?: string }): LiteralFilter {
  let escaped = '';
  let assigned = false;

  try {
    Object.defineProperty(el, '_search', {
      configurable: true,
      get: () => escaped,
      set: (value: string) => {
        escaped = escapeSearchQuery(String(value ?? ''));
        assigned = true;
      },
    });
  } catch {
    // Field is locked down — keep ninja-keys' own behaviour.
  }

  return {
    // `assigned` stays false only if the component never wrote the field, in
    // which case the payload is already raw text and must not be unescaped.
    query: (payload: string) =>
      assigned ? unescapeSearchQuery(String(payload ?? '')) : String(payload ?? ''),
  };
}

/**
 * Splits text into lowercase word tokens, so `federated-learning`,
 * `federated_learning` and `federated learning` compare equal. Persian letters
 * count as word characters; ZWNJ, hyphens and punctuation separate words.
 */
export function searchTokens(text: string): string[] {
  return String(text ?? '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * True when every token of `query` appears in `haystack`, in any order — the
 * AND semantics Pagefind uses, so `احمدی علی` still finds `علی احمدی`.
 */
export function matchesAllTokens(query: string, haystack: string): boolean {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return false;
  const words = ` ${searchTokens(haystack).join(' ')} `;
  return tokens.every((token) => words.includes(` ${token} `));
}

/**
 * The page a URL belongs to: no query, no fragment, no trailing slash, decoded.
 * A local palette entry and a Pagefind hit can describe one page through
 * different URLs (`/members/#ali-ahmadi` vs `/members/`), so both are compared
 * through this key instead of the raw URL.
 */
export function pagePath(url: string): string {
  const clean = String(url ?? '')
    .split('#')[0]
    .split('?')[0]
    .replace(/\/+$/, '');
  const path = (() => {
    try {
      return new URL(clean).pathname;
    } catch {
      return clean;
    }
  })();
  try {
    return decodeURI(path).replace(/\/+$/, '');
  } catch {
    return path.replace(/\/+$/, '');
  }
}

/**
 * How directly `text` answers `query`: `0` the query is the whole text, `1` the
 * text starts with the query, `2` it merely contains every query token (any
 * order), `null` no match. The palette uses it to order its result tiers.
 */
export function matchRank(query: string, text: string): number | null {
  if (!matchesAllTokens(query, text)) return null;
  const needle = searchTokens(query).join(' ');
  const haystack = searchTokens(text).join(' ');
  if (haystack === needle) return 0;
  return haystack.startsWith(`${needle} `) ? 1 : 2;
}

/** Pagefind marks the matched terms with `<mark>` tags inside the excerpt. */
export function plainExcerpt(excerpt = ''): string {
  return excerpt
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchActions(
  hits: PagefindHit[],
  rawQuery: string,
  section: string,
  limit = 10,
): SearchAction[] {
  return hits.slice(0, limit).map((hit) => ({
    id: hit.url,
    title: hit.meta?.title || hit.url,
    section,
    keywords: `${rawQuery} ${plainExcerpt(hit.excerpt)}`.trim(),
    path: pagePath(hit.url),
    handler: () => {
      window.location.href = hit.url;
    },
  }));
}
