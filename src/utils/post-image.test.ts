import { describe, expect, it } from 'vitest';

import { fallbackPostImagePair, postBannerImage } from './post-image';

describe('postBannerImage', () => {
  it('prefers the author image when set (both modes)', () => {
    expect(postBannerImage('my-post', '/assets/img/custom.jpg')).toEqual({
      light: '/assets/img/custom.jpg',
      dark: '/assets/img/custom.jpg',
    });
  });

  it('pairs known on-brand artwork with its light counterpart', () => {
    expect(postBannerImage('my-post', '/assets/img/sample-federated.svg')).toEqual({
      light: '/assets/img/sample-federated-light.svg',
      dark: '/assets/img/sample-federated.svg',
    });
  });

  it('returns a matching light/dark pair', () => {
    const pair = postBannerImage('my-post', undefined);
    expect(pair.light).toMatch(/sample-(federated|edge)-light\.svg$/);
    expect(pair.dark).toMatch(/sample-(federated|edge)\.svg$/);
    // Same artwork family in both modes.
    expect(pair.light.replace('-light', '')).toBe(pair.dark);
  });

  it('resolves the light pair deterministically too', () => {
    expect(fallbackPostImagePair('my-post')).toEqual(fallbackPostImagePair('my-post'));
  });
});
