import { site } from '@config/site';
import { getCollection } from 'astro:content';

export interface ResolvedAuthor {
  slug: string;
  name: string;
  nameFa: string | null;
  href: string | null;
}

/** Normalize a people-collection id to the slug used in post frontmatter. */
export function personSlug(id: string): string {
  return id.replace(/\.mdx?$/, '');
}

/**
 * Display name for an author in the language of the POST (not the site chrome):
 * Persian posts show the Persian name, everything else shows the English name.
 */
export function authorDisplayName(
  author: Pick<ResolvedAuthor, 'name' | 'nameFa'>,
  postLang: string,
): string {
  return postLang === 'fa' ? (author.nameFa ?? author.name) : author.name;
}

/** Build a deep link to a People profile anchor on the members page. */
export function personUrl(slug: string): string {
  return `${site.base}/members/#${slug}`;
}

/**
 * Resolve post author slugs to display names with profile links.
 * Unknown slugs fall back to a readable name with no link.
 * Server-only (uses astro:content) — do not import from client components.
 */
export async function resolvePostAuthors(slugs: string[] = []): Promise<ResolvedAuthor[]> {
  if (slugs.length === 0) return [];
  const people = await getCollection('people');
  const byId = new Map(people.map((p) => [personSlug(p.id), p]));
  // Also index by full id for safety.
  for (const p of people) byId.set(p.id, p);
  return slugs.map((raw) => {
    const slug = raw.trim();
    const key = personSlug(slug);
    const entry = byId.get(slug) ?? byId.get(key);
    if (entry) {
      return {
        slug: key,
        name: entry.data.name,
        nameFa: entry.data.nameFa ?? null,
        href: personUrl(key),
      };
    }
    const readable = slug.replace(/[-_]+/g, ' ');
    return { slug: key, name: readable, nameFa: null, href: null };
  });
}
