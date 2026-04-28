import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { CollectionLanding } from '@/components/collection-landing';

const SLUG = 'collections-corporate-decorative-art';
const DEFAULTS = {
  headline: 'Corporate / Decorative Art',
  subtitle: 'Curated programs for corporate environments and decorative spaces.',
};

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function CorporateDecorativeArtPage() {
  const content = await fetchCmsPage(SLUG);
  return <CollectionLanding content={content as any} defaults={DEFAULTS} />;
}
