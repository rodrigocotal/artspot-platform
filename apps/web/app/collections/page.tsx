import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionsPageClient } from './collections-client';

const SLUG = 'collections';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function CollectionsPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionsPageClient content={content as any} />;
}
