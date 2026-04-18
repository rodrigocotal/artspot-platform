import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { FavoritesPageClient } from './favorites-client';

const SLUG = 'favorites';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function FavoritesPage() {
  const content = await fetchCmsPage(SLUG);
  return <FavoritesPageClient content={content as any} />;
}
