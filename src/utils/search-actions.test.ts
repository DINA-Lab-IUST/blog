import { describe, expect, it } from 'vitest';

import {
  buildSearchActions,
  escapeSearchQuery,
  installLiteralFilter,
  matchesAllTokens,
  matchRank,
  pagePath,
  plainExcerpt,
  searchTokens,
  unescapeSearchQuery,
} from './search-actions';

/**
 * The exact predicate ninja-keys applies to every action it renders: an action
 * only shows up when the typed text matches its `title` or its `keywords`.
 */
function ninjaKeysKeeps(action: { title: string; keywords?: string }, query: string): boolean {
  const filter = new RegExp(query, 'gi');
  return Boolean(action.title.match(filter)) || Boolean(action.keywords?.match(filter));
}

describe('searchTokens / matchesAllTokens', () => {
  it('treats hyphens, underscores and dots as word separators', () => {
    expect(searchTokens('federated-learning')).toEqual(['federated', 'learning']);
    expect(matchesAllTokens('federated learning', 'federated-learning experiments')).toBe(true);
    expect(matchesAllTokens('federated learning', 'federated_learning')).toBe(true);
    expect(matchesAllTokens('ahmadi', 'Ali Ahmadi · علی احمدی')).toBe(true);
  });

  it('ignores word order, like Pagefind', () => {
    expect(matchesAllTokens('احمدی علی', 'علی احمدی · Ali Ahmadi')).toBe(true);
    expect(matchesAllTokens('learning federated', 'Federated Learning')).toBe(true);
  });

  it('requires every token', () => {
    expect(matchesAllTokens('علی رضایی', 'علی احمدی · Ali Ahmadi')).toBe(false);
    expect(matchesAllTokens('ahmadi maleki', 'Ali Ahmadi')).toBe(false);
  });

  it('matches whole words only', () => {
    expect(matchesAllTokens('ali', 'Ali Ahmadi')).toBe(true);
    expect(matchesAllTokens('li', 'Ali Ahmadi')).toBe(false);
    expect(matchesAllTokens('احمد', 'علی احمدی')).toBe(false);
  });

  it('rejects an empty query', () => {
    expect(matchesAllTokens('   ', 'anything')).toBe(false);
    expect(searchTokens(undefined as unknown as string)).toEqual([]);
  });
});

describe('matchRank', () => {
  it('ranks an exact heading above a prefix and a scattered match', () => {
    expect(matchRank('edge log', 'Edge Log')).toBe(0);
    expect(matchRank('edge log', 'Edge Log: An LLM-Assisted Framework')).toBe(1);
    expect(matchRank('edge log', 'Log analysis at the edge')).toBe(2);
  });

  it('ignores case, hyphens and word order', () => {
    expect(matchRank('MAB-RAFD', 'mab rafd: personalized federated')).toBe(1);
    // Reversed words still match, but no longer look like a heading prefix.
    expect(matchRank('log edge', 'Edge Log')).toBe(2);
  });

  it('returns null when a token is missing', () => {
    expect(matchRank('edge log', 'Edge computing')).toBeNull();
    expect(matchRank('', 'Edge Log')).toBeNull();
  });

  it('ranks a person whose name matches above one matched by focus', () => {
    expect(matchRank('علی احمدی', 'Ali Ahmadi · علی احمدی')).toBe(2);
    expect(matchRank('علی احمدی', 'Core Lead · سرپرست هسته')).toBeNull();
  });
});

describe('pagePath', () => {
  it('strips fragments, queries and trailing slashes', () => {
    expect(pagePath('/dina-blog-test/members/#ali-ahmadi')).toBe('/dina-blog-test/members');
    expect(pagePath('/dina-blog-test/members/')).toBe('/dina-blog-test/members');
    expect(pagePath('/dina-blog-test/posts/?page=2')).toBe('/dina-blog-test/posts');
  });

  it('reduces an absolute hit url to its path', () => {
    expect(pagePath('https://maleki-ah.github.io/dina-blog-test/members/')).toBe(
      '/dina-blog-test/members',
    );
  });

  it('decodes the path so encoded and literal tags match', () => {
    expect(pagePath('/dina-blog-test/posts/tag/%DB%8C%D8%A7%D8%AF%DA%AF%DB%8C%D8%B1%DB%8C/')).toBe(
      pagePath('/dina-blog-test/posts/tag/یادگیری/'),
    );
  });

  it('keeps the site root distinguishable', () => {
    expect(pagePath('https://example.com/blog/')).toBe('/blog');
  });
});

describe('plainExcerpt', () => {
  it('strips the highlight markup Pagefind adds', () => {
    expect(plainExcerpt('Edge <mark>log</mark> analysis')).toBe('Edge log analysis');
  });

  it('collapses whitespace', () => {
    expect(plainExcerpt('  a \n b ')).toBe('a b');
  });

  it('handles a missing excerpt', () => {
    expect(plainExcerpt()).toBe('');
  });
});

describe('buildSearchActions', () => {
  const bodyHit = {
    url: '/dina-blog-test/posts/research-vectors/',
    meta: { title: 'Research Vectors at DINA' },
    excerpt: 'We expose <mark>federated</mark> <mark>learning</mark> vectors …',
  };

  it('keeps a body-only hit visible to the ninja-keys filter', () => {
    const [action] = buildSearchActions([bodyHit], 'federated learning', 'Search Results');

    // The title alone fails the filter — that is the bug that emptied the palette.
    expect(ninjaKeysKeeps({ title: action.title }, 'federated learning')).toBe(false);
    expect(ninjaKeysKeeps(action, 'federated learning')).toBe(true);
  });

  it('survives a trailing space in the typed query', () => {
    const [action] = buildSearchActions([bodyHit], 'federated learning ', 'Search Results');
    expect(ninjaKeysKeeps(action, 'federated learning ')).toBe(true);
  });

  it('exposes the excerpt without markup', () => {
    const [action] = buildSearchActions([bodyHit], 'federated', 'Search Results');
    expect(action.keywords).not.toContain('<mark>');
    expect(action.keywords).toContain('federated');
  });

  it('falls back to the url when a hit has no title', () => {
    const [action] = buildSearchActions(
      [{ url: '/dina-blog-test/posts/x/' }],
      'x',
      'Search Results',
    );
    expect(action.title).toBe('/dina-blog-test/posts/x/');
    expect(action.id).toBe('/dina-blog-test/posts/x/');
  });

  it('caps the list and gives every action a handler', () => {
    const hits = Array.from({ length: 25 }, (_, i) => ({
      url: `/dina-blog-test/posts/p${i}/`,
      meta: { title: `Post ${i}` },
    }));

    const actions = buildSearchActions(hits, 'post', 'Search Results');

    expect(actions).toHaveLength(10);
    expect(actions.every((action) => typeof action.handler === 'function')).toBe(true);
    expect(actions.map((action) => action.id)).toEqual(hits.slice(0, 10).map((hit) => hit.url));
    expect(actions.every((action) => action.section === 'Search Results')).toBe(true);
  });
});

describe('escapeSearchQuery / unescapeSearchQuery', () => {
  it('escapes every regex metacharacter', () => {
    expect(escapeSearchQuery('c++')).toBe('c\\+\\+');
    expect(escapeSearchQuery('(EEG)')).toBe('\\(EEG\\)');
    expect(escapeSearchQuery('a*b?[c]')).toBe('a\\*b\\?\\[c\\]');
    expect(escapeSearchQuery('a.b|c$')).toBe('a\\.b\\|c\\$');
  });

  it('leaves plain text alone', () => {
    expect(escapeSearchQuery('federated learning')).toBe('federated learning');
    expect(escapeSearchQuery('یادگیری')).toBe('یادگیری');
  });

  it('round-trips a query back to what the visitor typed', () => {
    for (const query of ['c++', 'a.b', '(EEG)', 'a\\b', 'federated learning', 'یادگیری']) {
      expect(unescapeSearchQuery(escapeSearchQuery(query))).toBe(query);
    }
  });
});

describe('installLiteralFilter', () => {
  it('keeps a valid filter copy and returns the typed text', () => {
    const el: { _search?: string } = {};
    const filter = installLiteralFilter(el);

    el._search = 'c++';

    expect(el._search).toBe('c\\+\\+');
    expect(() => new RegExp(el._search!, 'gi')).not.toThrow();
    expect(filter.query(el._search!)).toBe('c++');
  });

  it('makes ninja-keys filter literal instead of pattern text', () => {
    const el: { _search?: string } = {};
    installLiteralFilter(el);

    el._search = 'a.b';
    const ninjaFilter = new RegExp(el._search!, 'gi');

    expect('a.b'.match(ninjaFilter)).toBeTruthy();
    expect('axb'.match(ninjaFilter)).toBeNull();
  });

  it('falls back to the payload when the field cannot be redefined', () => {
    const el: { _search?: string } = {};
    Object.defineProperty(el, '_search', { value: 'x', writable: false, configurable: false });

    const filter = installLiteralFilter(el);

    expect(filter.query('c++')).toBe('c++');
  });
});
