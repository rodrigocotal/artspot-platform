/**
 * Canonical allow-list of CMS-editable page slugs.
 * Must stay in sync with FIELD_CONFIGS in
 * apps/web/app/admin/content/[slug]/page.tsx.
 */
export const CMS_SLUGS = [
  'home',
  'contact',
  'collector-services',
  'discover',
  'site-settings',
  'artists',
  'artists-featured',
  'artworks',
  'collections',
  'collections-new-arrivals',
  'collections-museum-quality',
  'collections-online-projects-and-exhibitions',
  'collections-featured-art',
  'collections-public-art',
  'collections-corporate-decorative-art',
  'editorial',
  'inspiration',
  'exhibitions',
  'favorites',
  'footer',
] as const;

export type CmsSlug = (typeof CMS_SLUGS)[number];

const slugSet = new Set<string>(CMS_SLUGS);

export function isValidCmsSlug(slug: string): boolean {
  return slugSet.has(slug);
}
