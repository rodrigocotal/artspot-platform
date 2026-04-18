import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { EditorialPageClient } from './editorial-client';

const SLUG = 'editorial';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function EditorialPage() {
  const content = await fetchCmsPage(SLUG);
  return <EditorialPageClient content={content as any} />;
}
