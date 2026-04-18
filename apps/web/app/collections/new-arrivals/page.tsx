import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionsNewArrivalsPageClient } from './new-arrivals-client';

const SLUG = 'collections-new-arrivals';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function NewArrivalsPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionsNewArrivalsPageClient content={content as any} />;
}
