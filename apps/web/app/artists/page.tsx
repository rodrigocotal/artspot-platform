import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { ArtistsPageClient } from './artists-client';

const SLUG = 'artists';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function ArtistsPage() {
  const content = await fetchCmsPage(SLUG);
  return <ArtistsPageClient content={content as any} />;
}
