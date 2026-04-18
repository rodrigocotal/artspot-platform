import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectorServicesPageClient } from './collector-services-client';

const SLUG = 'collector-services';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function CollectorServicesPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectorServicesPageClient content={content as any} />;
}
