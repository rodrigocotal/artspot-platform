'use client';

import { useState, useEffect } from 'react';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork/artwork-card';
import {
  SearchInput,
  FilterGroup,
  FilterCheckbox,
  FilterTag,
  SortDropdown,
  type SortOption,
  Button,
} from '@/components/ui';
import { apiClient, type Artwork, type ArtworkFilters } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const sortOptions: SortOption[] = [
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year', label: 'Year' },
  { value: 'title', label: 'Title: A-Z' },
];

const mediumOptions = [
  { id: 'PAINTING', label: 'Painting' },
  { id: 'SCULPTURE', label: 'Sculpture' },
  { id: 'PHOTOGRAPHY', label: 'Photography' },
  { id: 'PRINT', label: 'Works on Paper' },
  { id: 'DRAWING', label: 'Drawing' },
  { id: 'MIXED_MEDIA', label: 'Mixed Media' },
];

const styleOptions = [
  { id: 'ABSTRACT', label: 'Abstract' },
  { id: 'CONTEMPORARY', label: 'Contemporary' },
  { id: 'FIGURATIVE', label: 'Figurative' },
  { id: 'MINIMALIST', label: 'Minimalist' },
  { id: 'REALISM', label: 'Realism' },
];

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
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
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState('createdAt');

  // Fetch artworks
  const fetchArtworks = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const filters: ArtworkFilters = {
        page,
        limit: 20,
        status: 'AVAILABLE',
      };

      // Apply filters
      if (search) filters.search = search;
      if (selectedMediums.length > 0) filters.medium = selectedMediums[0]; // API supports single medium for now
      if (selectedStyles.length > 0) filters.style = selectedStyles[0];

      // Parse sort value
      if (sortValue.includes('-')) {
        const [field, order] = sortValue.split('-');
        filters.sortBy = field as any;
        filters.sortOrder = order as 'asc' | 'desc';
      } else {
        filters.sortBy = sortValue as any;
        filters.sortOrder = 'desc';
      }

      const response = await apiClient.getArtworks(filters);
      setArtworks(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch on filter changes
  useEffect(() => {
    fetchArtworks(1);
  }, [search, selectedMediums, selectedStyles, sortValue]);

  // Handle medium filter
  const handleMediumChange = (id: string, checked: boolean) => {
    setSelectedMediums((prev) =>
      checked ? [...prev, id] : prev.filter((m) => m !== id)
    );
  };

  // Handle style filter
  const handleStyleChange = (id: string, checked: boolean) => {
    setSelectedStyles((prev) =>
      checked ? [...prev, id] : prev.filter((s) => s !== id)
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setSelectedMediums([]);
    setSelectedStyles([]);
  };

  // Active filters for tags
  const activeFilters = [
    ...selectedMediums.map((id) => ({
      type: 'medium' as const,
      id,
      label: mediumOptions.find((m) => m.id === id)?.label ?? id,
    })),
    ...selectedStyles.map((id) => ({
      type: 'style' as const,
      id,
      label: styleOptions.find((s) => s.id === id)?.label ?? id,
    })),
  ];

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-display font-serif text-neutral-900 mb-2">
              Explore Artworks
            </h1>
            <p className="text-body-lg text-neutral-600">
              Discover museum-quality art from exceptional artists
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 space-y-6 sticky top-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-heading-4 font-serif text-neutral-900">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <FilterGroup title="Medium" defaultOpen>
                  {mediumOptions.map((option) => (
                    <FilterCheckbox
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      checked={selectedMediums.includes(option.id)}
                      onChange={(checked) => handleMediumChange(option.id, checked)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Style" defaultOpen>
                  {styleOptions.map((option) => (
                    <FilterCheckbox
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      checked={selectedStyles.includes(option.id)}
                      onChange={(checked) => handleStyleChange(option.id, checked)}
                    />
                  ))}
                </FilterGroup>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Sort Bar */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search artworks..."
                    className="flex-1"
                  />
                  <SortDropdown
                    options={sortOptions}
                    value={sortValue}
                    onChange={setSortValue}
                  />
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
                    {activeFilters.map((filter) => (
                      <FilterTag
                        key={`${filter.type}-${filter.id}`}
                        label={filter.label}
                        onRemove={() =>
                          filter.type === 'medium'
                            ? handleMediumChange(filter.id, false)
                            : handleStyleChange(filter.id, false)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <p>
                  {loading ? (
                    'Loading...'
                  ) : (
                    <>
                      Showing {artworks.length} of {pagination.total} artworks
                    </>
                  )}
                </p>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              )}

              {/* Artwork Grid */}
              {!loading && !error && (
                <>
                  {artworks.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-neutral-600">No artworks found matching your filters.</p>
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {artworks.map((artwork, index) => (
                        <ArtworkCard
                          key={artwork.id}
                          artwork={artwork}
                          priority={index < 6}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                      <Button
                        variant="outline"
                        onClick={() => fetchArtworks(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <span className="px-4 text-sm text-neutral-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => fetchArtworks(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
