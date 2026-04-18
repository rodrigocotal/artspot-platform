import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionsMuseumQualityPageClient } from './museum-quality-client';

const SLUG = 'collections-museum-quality';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function MuseumQualityPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionsMuseumQualityPageClient content={content as any} />;
}
