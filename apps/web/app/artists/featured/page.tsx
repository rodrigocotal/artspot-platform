'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { ArtistCard } from '@/components/artist';
import { Button } from '@/components/ui';
import { apiClient, type Artist } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const CMS_DEFAULTS = {
  headline: 'Featured Artists',
  subtitle: 'Exceptional artists hand-selected by our curatorial team',
};

export default function FeaturedArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [cmsContent, setCmsContent] = useState(CMS_DEFAULTS);

  const fetchArtists = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getArtists({
        featured: true,
        page,
        limit: 20,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
      });
      setArtists(response.data);
      if (response.pagination) setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists(1);
    apiClient.getPageContent('artists-featured')
      .then((res) => setCmsContent({ ...CMS_DEFAULTS, ...res.data.content }))
      .catch(() => {});
  }, []);

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-display font-serif text-neutral-900 mb-2">{cmsContent.headline}</h1>
          <p className="text-body-lg text-neutral-600">
            {cmsContent.subtitle}
          </p>
        </div>

        {error && (
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">{error}</p>
            <Button onClick={() => fetchArtists(pagination.page)}>Try Again</Button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600">No featured artists yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {artists.map((artist, index) => (
                <ArtistCard key={artist.id} artist={artist} priority={index < 6} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchArtists(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-neutral-600 px-4">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchArtists(pagination.page + 1)}
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
