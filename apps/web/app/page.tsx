import type { Metadata } from 'next';
import { HomePageClient, type HomeContent } from './home-client';
import { fetchCmsPage, pageMetadata } from '@/lib/page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('home');
}

export default async function HomePage() {
  const content = await fetchCmsPage('home');
  return <HomePageClient content={content as HomeContent | null} />;
}
