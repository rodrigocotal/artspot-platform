import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { ArtistsFeaturedPageClient } from './featured-client';

const SLUG = 'artists-featured';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function FeaturedArtistsPage() {
  const content = await fetchCmsPage(SLUG);
  return <ArtistsFeaturedPageClient content={content as any} />;
}
