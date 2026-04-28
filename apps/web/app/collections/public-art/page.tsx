import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionLanding } from '@/components/collection-landing';

const SLUG = 'collections-public-art';
const DEFAULTS = {
  headline: 'Public Art',
  subtitle: 'Commissioned installations and works in shared civic spaces.',
};

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function PublicArtPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionLanding content={content as any} defaults={DEFAULTS} />;
}
