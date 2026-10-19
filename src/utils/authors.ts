// ─── Co-author links (publications) ─────────────────────────────────────────
// Client-safe: no astro:content import (used by the BibSearch React island).

export interface CoauthorRecord {
  url?: string;
  scholar?: string;
  orcid?: string;
}

export type CoauthorMap = Record<string, CoauthorRecord>;

export interface LinkedAuthor {
  name: string;
  url?: string;
  isSelf: boolean;
}

/** Strip accents and lowercase for name comparison. */
function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Last whitespace-separated token, or the full string for single-word names. */
function lastNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

/**
 * Link BibTeX author names to co-author profiles and mark the site author.
 * Matches by last name (accent-insensitive); preserves the display string.
 */
export function linkAuthors(
  names: string[],
  coauthors: CoauthorMap,
  authorLastName: string,
): LinkedAuthor[] {
  const selfNorm = normalizeName(authorLastName.trim());
  const normEntries = Object.entries(coauthors).map(([key, record]) => ({
    norm: normalizeName(key),
    record,
  }));
  return names.map((name) => {
    const lastNorm = normalizeName(lastNameOf(name));
    const isSelf = selfNorm.length > 0 && lastNorm === selfNorm;
    const match = normEntries.find((e) => e.norm === lastNorm);
    return {
      name,
      url: isSelf ? undefined : match?.record.url,
      isSelf,
    };
  });
}
