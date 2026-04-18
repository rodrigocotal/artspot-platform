import type { Metadata } from 'next';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';
import { ContactPageClient } from './contact-client';

const SLUG = 'contact';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(SLUG);
}

export default async function ContactPage() {
  const content = await fetchCmsPage(SLUG);
  return <ContactPageClient content={content as any} />;
}
