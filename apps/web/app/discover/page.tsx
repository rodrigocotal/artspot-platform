import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { DiscoverPageClient } from './discover-client';

const SLUG = 'discover';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function DiscoverPage() {
  const content = await fetchCmsPage(SLUG);
  return <DiscoverPageClient content={content as any} />;
}
