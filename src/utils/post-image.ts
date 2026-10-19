import { withBase } from './base';

/** On-brand fallback banners shown when a post sets no `image`. */
const FALLBACK_IMAGES = [
  '/assets/img/sample-federated.svg',
  '/assets/img/sample-edge.svg',
  '/assets/img/sample-pulse.svg',
];

/** Known light-mode counterparts for dark fallback artwork. */
const LIGHT_VARIANTS: Record<string, string> = {
  '/assets/img/sample-federated.svg': '/assets/img/sample-federated-light.svg',
  '/assets/img/sample-edge.svg': '/assets/img/sample-edge-light.svg',
  '/assets/img/sample-pulse.svg': '/assets/img/sample-pulse-light.svg',
};

/** Light-mode counterparts (same artwork on cream paper). */
const FALLBACK_IMAGES_LIGHT = [
  '/assets/img/sample-federated-light.svg',
  '/assets/img/sample-edge-light.svg',
  '/assets/img/sample-pulse-light.svg',
];

export interface BannerPair {
  light: string;
  dark: string;
}

/** Deterministic light/dark fallback pair for a post id. */
export function fallbackPostImagePair(id: string): BannerPair {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const i = hash % FALLBACK_IMAGES.length;
  return { light: withBase(FALLBACK_IMAGES_LIGHT[i]), dark: withBase(FALLBACK_IMAGES[i]) };
}

/**
 * Resolve a post's banner: the author image first (with a light counterpart
 * when the artwork is one of the known on-brand pairs), otherwise the
 * deterministic on-brand fallback pair.
 */
export function postBannerImage(id: string, image: string | undefined): BannerPair {
  if (image) {
    const dark = withBase(image);
    const light = LIGHT_VARIANTS[image] ? withBase(LIGHT_VARIANTS[image]) : dark;
    return { light, dark };
  }
  return fallbackPostImagePair(id);
}
