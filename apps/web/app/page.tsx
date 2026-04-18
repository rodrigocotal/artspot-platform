import type { Metadata } from 'next';
import { HomePageClient, type HomeContent } from './home-client';
import { resolveSeo, type SeoInput } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchPageContent(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${API_URL}/pages/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.data?.content as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([
    fetchPageContent('home'),
    fetchPageContent('site-settings'),
  ]);
  const seo = resolveSeo(page as SeoInput | null, site as SeoInput | null);
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

export default async function HomePage() {
  const content = await fetchPageContent('home');
  return <HomePageClient content={content as HomeContent | null} />;
}
