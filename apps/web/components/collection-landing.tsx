'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { HeroImage } from '@/components/hero-image';
import { ArtworkCard } from '@/components/artwork';
import { Button } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type Artwork } from '@/lib/api-client';
import type { ImageFieldValue } from '@/lib/seo';

interface CollectionLandingContent {
  headline?: string;
  subtitle?: string;
  heroImage?: ImageFieldValue | null;
}

interface CollectionLandingProps {
  content: Record<string, any> | null;
  defaults: { headline: string; subtitle: string };
  /**
   * Slug of the DB collection that backs this themed page. When provided, the
   * collection's artworks are fetched and rendered in a grid below the hero.
   */
  collectionSlug?: string;
}

export function CollectionLanding({ content, defaults, collectionSlug }: CollectionLandingProps) {
  const merged: CollectionLandingContent = { ...defaults, ...(content ?? {}) };

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(collectionSlug));

  useEffect(() => {
    if (!collectionSlug) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getCollection(collectionSlug);
        const items = res.data.artworks?.map((item) => item.artwork).filter(Boolean) ?? [];
        if (!cancelled) setArtworks(items);
      } catch {
        // Collection not created yet (404) or transient error — fall back to CTA.
        if (!cancelled) setArtworks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [collectionSlug]);

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mb-4">
            Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-neutral-900 leading-[1.05]">
            {merged.headline}
          </h1>
          {merged.subtitle && (
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {merged.subtitle}
            </p>
          )}
          <div className="mt-10">
            <HeroImage image={merged.heroImage ?? null} />
          </div>
        </div>

        {collectionSlug && (
          <div className="mt-20">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full rounded-md" />
                ))}
              </div>
            ) : artworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {artworks.map((artwork, index) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} priority={index < 8} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-t border-neutral-200">
                <p className="text-neutral-600 mb-8">
                  Works for this collection are coming soon.
                </p>
                <Link href="/artworks">
                  <Button size="lg">Browse All Artworks</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
