import { describe, expect, it, vi } from 'vitest';

// Mock astro:content so the module resolves in unit tests
vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

import { relatedPosts } from './posts';

// Minimal post factory — only the fields used by utils/posts.ts
function makePost(
  id: string,
  opts: {
    date?: Date;
    tags?: string[];
    categories?: string[];
    hidden?: boolean;
    pinned?: boolean;
  } = {},
) {
  return {
    id,
    data: {
      title: id,
      date: opts.date ?? new Date('2024-01-01'),
      tags: opts.tags ?? [],
      categories: opts.categories ?? [],
      hidden: opts.hidden ?? false,
      pinned: opts.pinned ?? false,
    },
  } as any;
}

describe('relatedPosts', () => {
  it('excludes the current post', () => {
    const current = makePost('a', { tags: ['x'] });
    const other = makePost('b', { tags: ['x'] });
    const result = relatedPosts(current, [current, other]);
    expect(result.every((p) => p.id !== 'a')).toBe(true);
  });

  it('returns posts sorted by tag overlap', () => {
    const current = makePost('a', { tags: ['x', 'y', 'z'] });
    const high = makePost('high', { tags: ['x', 'y', 'z'] });
    const low = makePost('low', { tags: ['x'] });
    const result = relatedPosts(current, [current, low, high]);
    expect(result[0].id).toBe('high');
  });

  it('excludes posts with no shared tags', () => {
    const current = makePost('a', { tags: ['x'] });
    const unrelated = makePost('b', { tags: ['q'] });
    expect(relatedPosts(current, [current, unrelated])).toHaveLength(0);
  });

  it('respects the limit parameter', () => {
    const current = makePost('a', { tags: ['x'] });
    const others = ['b', 'c', 'd'].map((id) => makePost(id, { tags: ['x'] }));
    expect(relatedPosts(current, [current, ...others], 2)).toHaveLength(2);
  });
});
