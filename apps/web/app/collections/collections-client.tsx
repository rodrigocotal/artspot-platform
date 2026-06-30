'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { CollectionCard } from '@/components/collection';
import {
  SearchInput,
  FilterGroup,
  FilterCheckbox,
  FilterTag,
  SortDropdown,
  type SortOption,
  Button,
} from '@/components/ui';
import { apiClient, type Collection, type CollectionFilters } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const sortOptions: SortOption[] = [
  { value: 'displayOrder', label: 'Featured First' },
  { value: 'title', label: 'Title: A-Z' },
  { value: 'createdAt', label: 'Recently Added' },
];

const CMS_DEFAULTS = {
  label: 'Curated',
  headline: 'Curated Collections',
  subtitle: 'Explore thoughtfully curated selections of exceptional artworks',
  emptyMessage: 'No collections found',
};

export function CollectionsPageClient({ content }: { content: Record<string, any> | null }) {
  const merged = { ...CMS_DEFAULTS, ...(content ?? {}) };
  const [collections, setCollections] = useState<Collection[]>([]);
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
  const [sortValue, setSortValue] = useState('displayOrder');

  // Fetch collections
  const fetchCollections = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const filters: CollectionFilters = {
        page,
        limit: 20,
        sortBy: sortValue as any,
        sortOrder: 'asc',
      };

      // Apply filters
      if (search) filters.search = search;
      if (featuredOnly) filters.featured = true;

      const response = await apiClient.getCollections(filters);
      setCollections(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch on filter changes
  useEffect(() => {
    fetchCollections(1);
  }, [search, featuredOnly, sortValue]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setFeaturedOnly(false);
  };

  // Active filters for tags
  const activeFilters = [];
  if (featuredOnly) activeFilters.push({ type: 'featured' as const, id: 'featured', label: 'Featured' });

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="mb-10 md:mb-14 border-b border-neutral-200 pb-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
              {merged.label}
            </p>
            <h1 className="text-display font-serif text-neutral-900">
              {merged.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-body-lg text-neutral-600">
              {merged.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-10">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-1 space-y-6 sticky top-24 self-start">
              {/* Search */}
              <div>
                <SearchInput
                  value={search}
                  onChange={(value) => setSearch(value)}
                  placeholder="Search collections..."
                />
              </div>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                      Active Filters
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
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
                    label="Featured Collections"
                    checked={featuredOnly}
                    onChange={(checked) => setFeaturedOnly(checked)}
                  />
                </div>
              </FilterGroup>
            </aside>

            {/* Main content - Collections grid */}
            <main className="lg:col-span-3 space-y-8">
              {/* Results header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
                <p className="text-sm text-neutral-500">
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      Showing {collections.length} of {pagination.total} collection
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

              {/* Collections grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-neutral-600 mb-4">{error}</p>
                  <Button onClick={() => fetchCollections(pagination.page)}>
                    Try Again
                  </Button>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-neutral-600 mb-4">{merged.emptyMessage}</p>
                  {activeFilters.length > 0 && (
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                    {collections.map((collection, index) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection}
                        priority={index < 6}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 border-t border-neutral-200 pt-10 mt-4">
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
            </main>
          </div>
        </Container>
      </Section>
    </>
  );
}
