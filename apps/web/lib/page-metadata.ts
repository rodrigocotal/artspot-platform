import type { Metadata } from 'next';
import { resolveSeo, type SeoInput } from './seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch CMS page content for a slug. Returns null if CMS unreachable or page missing.
 * Used by server components for both metadata and page render.
 */
export async function fetchCmsPage(slug: string): Promise<SeoInput | null> {
  try {
    const res = await fetch(`${API_URL}/pages/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.data?.content as SeoInput) ?? null;
  } catch {
    return null;
  }
}

/**
 * Build Next.js Metadata for a page slug, applying the SEO fallback chain.
 * Fetches both the page content and site-settings in parallel.
 */
export async function pageMetadata(slug: string): Promise<Metadata> {
  const [page, site] = await Promise.all([fetchCmsPage(slug), fetchCmsPage('site-settings')]);
  const seo = resolveSeo(page, site);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: seo.siteName,
      images: seo.image?.url ? [{ url: seo.image.url, alt: seo.image.alt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image?.url ? [seo.image.url] : undefined,
    },
  };
}
