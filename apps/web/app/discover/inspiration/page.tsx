import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { InspirationPageClient } from './inspiration-client';

const SLUG = 'inspiration';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function InspirationPage() {
  const content = await fetchCmsPage(SLUG);
  return <InspirationPageClient content={content as any} />;
}
