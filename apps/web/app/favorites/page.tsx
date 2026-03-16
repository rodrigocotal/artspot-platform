'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork/artwork-card';
import { Button } from '@/components/ui';
import { ArtworkGridSkeleton } from '@/components/ui/skeleton';
import { useFavoritesQuery } from '@/hooks/use-favorites-query';
import { apiClient } from '@/lib/api-client';
import { Heart } from 'lucide-react';

const CMS_DEFAULTS = {
  headline: 'Your Favorites',
  subtitle: 'Artworks you\'ve saved for later',
};

export default function FavoritesPage() {
  const [cmsContent, setCmsContent] = useState(CMS_DEFAULTS);

  useEffect(() => {
    apiClient.getPageContent('favorites')
      .then((res) => setCmsContent({ ...CMS_DEFAULTS, ...res.data.content }))
      .catch(() => {});
  }, []);
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFavoritesQuery({ page, limit: 20 });

  const favorites = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display font-serif text-neutral-900 mb-2">
            {cmsContent.headline}
          </h1>
          <p className="text-body-lg text-neutral-600">
            {cmsContent.subtitle}
          </p>
        </div>

        {/* Results Summary */}
        {!isLoading && favorites.length > 0 && (
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-6">
            <p>
              {pagination.total} {pagination.total === 1 ? 'artwork' : 'artworks'} saved
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
            {error instanceof Error ? error.message : 'Failed to load favorites'}
          </div>
        )}

        {/* Loading State — Skeleton Grid */}
        {isLoading && <ArtworkGridSkeleton count={8} />}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {favorites.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-6">
                  <Heart className="w-8 h-8 text-neutral-400" />
                </div>
                <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">
                  No favorites yet
                </h2>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Start exploring our collection and save the artworks that inspire you.
                </p>
                <Button asChild>
                  <Link href="/artworks">Discover Artworks</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favorites.map((favorite, index) => (
                  <ArtworkCard
                    key={favorite.id}
                    artwork={{ ...favorite.artwork, isFavorited: true }}
                    priority={index < 8}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 text-sm text-neutral-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
