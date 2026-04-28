import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionLanding } from '@/components/collection-landing';

const SLUG = 'collections-featured-art';
const DEFAULTS = {
  headline: 'Featured Art',
  subtitle: 'A rotating selection of standout works hand-picked by our curators.',
};

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function FeaturedArtPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionLanding content={content as any} defaults={DEFAULTS} />;
}
