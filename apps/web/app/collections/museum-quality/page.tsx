'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { CollectionCard } from '@/components/collection';
import { Button } from '@/components/ui';
import { apiClient, type Collection } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

export default function MuseumQualityPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchCollections = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCollections({
        featured: true,
        page,
        limit: 20,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
      });
      setCollections(response.data);
      if (response.pagination) setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections(1);
  }, []);

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-display font-serif text-neutral-900 mb-2">Museum-Quality Works</h1>
          <p className="text-body-lg text-neutral-600">
            Our finest curated collections, selected to institutional standards
          </p>
        </div>

        {error && (
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">{error}</p>
            <Button onClick={() => fetchCollections(pagination.page)}>Try Again</Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600">No museum-quality collections yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <CollectionCard key={collection.id} collection={collection} priority={index < 6} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchCollections(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-neutral-600 px-4">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchCollections(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
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
