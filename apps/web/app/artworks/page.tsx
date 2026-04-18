import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { ArtworksPageClient } from './artworks-client';

const SLUG = 'artworks';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function ArtworksPage() {
  const content = await fetchCmsPage(SLUG);
  return <ArtworksPageClient content={content as any} />;
}
