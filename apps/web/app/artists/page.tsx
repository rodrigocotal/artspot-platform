'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { ArtistCard } from '@/components/artist';
import {
  SearchInput,
  FilterGroup,
  FilterCheckbox,
  FilterTag,
  SortDropdown,
  type SortOption,
  Button,
} from '@/components/ui';
import { apiClient, type Artist, type ArtistFilters } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const sortOptions: SortOption[] = [
  { value: 'name', label: 'Name: A-Z' },
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'displayOrder', label: 'Featured First' },
];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortValue, setSortValue] = useState('name');

  // Fetch artists
  const fetchArtists = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const filters: ArtistFilters = {
        page,
        limit: 20,
        sortBy: sortValue as any,
        sortOrder: 'asc',
      };

      // Apply filters
      if (search) filters.search = search;
      if (featuredOnly) filters.featured = true;
      if (verifiedOnly) filters.verified = true;

      const response = await apiClient.getArtists(filters);
      setArtists(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch on filter changes
  useEffect(() => {
    fetchArtists(1);
  }, [search, featuredOnly, verifiedOnly, sortValue]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setFeaturedOnly(false);
    setVerifiedOnly(false);
  };

  // Active filters for tags
  const activeFilters = [];
  if (featuredOnly) activeFilters.push({ type: 'featured' as const, id: 'featured', label: 'Featured' });
  if (verifiedOnly) activeFilters.push({ type: 'verified' as const, id: 'verified', label: 'Verified' });

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-display font-serif text-neutral-900 mb-2">
              Discover Artists
            </h1>
            <p className="text-body-lg text-neutral-600">
              Meet the exceptional artists behind our curated collection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div>
                <SearchInput
                  value={search}
                  onChange={(value) => setSearch(value)}
                  placeholder="Search artists..."
                />
              </div>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">
                      Active Filters
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <FilterTag
                        key={filter.id}
                        label={filter.label}
                        onRemove={() => {
                          if (filter.type === 'featured') setFeaturedOnly(false);
                          if (filter.type === 'verified') setVerifiedOnly(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              <FilterGroup title="Status">
                <div className="space-y-2">
                  <FilterCheckbox
                    id="featured"
                    label="Featured Artists"
                    checked={featuredOnly}
                    onChange={(checked) => setFeaturedOnly(checked)}
                  />
                  <FilterCheckbox
                    id="verified"
                    label="Verified Artists"
                    checked={verifiedOnly}
                    onChange={(checked) => setVerifiedOnly(checked)}
                  />
                </div>
              </FilterGroup>
            </aside>

            {/* Main content - Artists grid */}
            <main className="lg:col-span-3 space-y-6">
              {/* Results header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-600">
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      Showing {artists.length} of {pagination.total} artist
                      {pagination.total !== 1 ? 's' : ''}
                    </>
                  )}
                </p>

                <SortDropdown
                  options={sortOptions}
                  value={sortValue}
                  onChange={setSortValue}
                />
              </div>

              {/* Artists grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-neutral-600 mb-4">{error}</p>
                  <Button onClick={() => fetchArtists(pagination.page)}>
                    Try Again
                  </Button>
                </div>
              ) : artists.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-neutral-600 mb-4">No artists found</p>
                  {activeFilters.length > 0 && (
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {artists.map((artist, index) => (
                      <ArtistCard
                        key={artist.id}
                        artist={artist}
                        priority={index < 6}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
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
            </main>
          </div>
        </Container>
      </Section>
    </>
  );
}
