'use client';

import { useState } from 'react';
import { Container, Section } from '@/components/layout';
import {
  SearchInput,
  FilterGroup,
  FilterCheckbox,
  FilterTag,
  PriceRangeFilter,
  SortDropdown,
  type SortOption,
} from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'artist-az', label: 'Artist: A-Z' },
];

const mediumOptions = [
  { id: 'painting', label: 'Painting', count: 342 },
  { id: 'sculpture', label: 'Sculpture', count: 128 },
  { id: 'photography', label: 'Photography', count: 256 },
  { id: 'print', label: 'Works on Paper', count: 89 },
];

const styleOptions = [
  { id: 'abstract', label: 'Abstract', count: 198 },
  { id: 'contemporary', label: 'Contemporary', count: 412 },
  { id: 'figurative', label: 'Figurative', count: 156 },
  { id: 'minimalist', label: 'Minimalist', count: 87 },
];

export default function FiltersDemo() {
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('featured');
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();

  const handleMediumChange = (id: string, checked: boolean) => {
    setSelectedMediums((prev) =>
      checked ? [...prev, id] : prev.filter((m) => m !== id)
    );
  };

  const handleStyleChange = (id: string, checked: boolean) => {
    setSelectedStyles((prev) =>
      checked ? [...prev, id] : prev.filter((s) => s !== id)
    );
  };

  const removeFilter = (type: 'medium' | 'style', id: string) => {
    if (type === 'medium') {
      setSelectedMediums((prev) => prev.filter((m) => m !== id));
    } else {
      setSelectedStyles((prev) => prev.filter((s) => s !== id));
    }
  };

  const clearAllFilters = () => {
    setSelectedMediums([]);
    setSelectedStyles([]);
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSearchValue('');
  };

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

  if (priceMin !== undefined) {
    activeFilters.push({
      type: 'medium' as const,
      id: 'price-min',
      label: `Min: $${priceMin.toLocaleString()}`,
    });
  }
  if (priceMax !== undefined) {
    activeFilters.push({
      type: 'medium' as const,
      id: 'price-max',
      label: `Max: $${priceMax.toLocaleString()}`,
    });
  }

  return (
    <>
      <Section spacing="lg" background="neutral">
        <Container size="lg">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="mb-12">
            <h1 className="text-heading-1 font-serif text-neutral-900 mb-4">
              Filter & Search Components
            </h1>
            <p className="text-body-lg text-neutral-600 max-w-3xl">
              Complete filtering and search UI for artwork browsing. Includes search input,
              collapsible filter groups, checkboxes, price range, sort dropdown, and active filter tags.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with filters */}
            <div className="lg:col-span-1">
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

                <FilterGroup title="Medium">
                  {mediumOptions.map((option) => (
                    <FilterCheckbox
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      count={option.count}
                      checked={selectedMediums.includes(option.id)}
                      onChange={(checked) => handleMediumChange(option.id, checked)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Style">
                  {styleOptions.map((option) => (
                    <FilterCheckbox
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      count={option.count}
                      checked={selectedStyles.includes(option.id)}
                      onChange={(checked) => handleStyleChange(option.id, checked)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Price Range">
                  <PriceRangeFilter
                    min={priceMin}
                    max={priceMax}
                    onMinChange={setPriceMin}
                    onMaxChange={setPriceMax}
                  />
                </FilterGroup>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and sort bar */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SearchInput
                    value={searchValue}
                    onChange={setSearchValue}
                    onSearch={(value) => console.log('Search:', value)}
                    className="flex-1"
                  />
                  <SortDropdown
                    options={sortOptions}
                    value={sortValue}
                    onChange={setSortValue}
                  />
                </div>

                {/* Active filters */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-200">
                    {activeFilters.map((filter) => (
                      <FilterTag
                        key={`${filter.type}-${filter.id}`}
                        label={filter.label}
                        onRemove={
                          filter.id.startsWith('price-')
                            ? filter.id === 'price-min'
                              ? () => setPriceMin(undefined)
                              : () => setPriceMax(undefined)
                            : () => removeFilter(filter.type, filter.id)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Results summary */}
              <div className="bg-white rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="text-heading-3 font-serif text-neutral-900 mb-2">
                    Interactive Demo
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Try the filters above to see them in action. Selected filters appear as tags below the search bar.
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">Search:</span>
                      <code className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                        {searchValue || '(empty)'}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">Sort:</span>
                      <code className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                        {sortOptions.find((opt) => opt.value === sortValue)?.label}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">Selected Mediums:</span>
                      <code className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                        {selectedMediums.length > 0 ? selectedMediums.join(', ') : '(none)'}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">Selected Styles:</span>
                      <code className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                        {selectedStyles.length > 0 ? selectedStyles.join(', ') : '(none)'}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">Price Range:</span>
                      <code className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                        {priceMin ?? 'any'} - {priceMax ?? 'any'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
