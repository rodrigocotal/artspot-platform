import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { ExhibitionsPageClient } from './exhibitions-client';

const SLUG = 'exhibitions';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function ExhibitionsPage() {
  const content = await fetchCmsPage(SLUG);
  return <ExhibitionsPageClient content={content as any} />;
}
