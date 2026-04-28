import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionLanding } from '@/components/collection-landing';

const SLUG = 'collections-online-projects-and-exhibitions';
const DEFAULTS = {
  headline: 'Online Projects and Exhibitions',
  subtitle: 'Digital exhibitions and curated online programming.',
};

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function OnlineProjectsAndExhibitionsPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionLanding content={content as any} defaults={DEFAULTS} />;
}
