'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { SearchInput, Button } from '@/components/ui';
import {
  apiClient,
  type Article,
  type ArticleCategory,
  type ArticleFilters,
} from '@/lib/api-client';
import { Loader2, Calendar, User, ArrowRight } from 'lucide-react';

const categoryOptions: { value: ArticleCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ARTIST_SPOTLIGHT', label: 'Artist Spotlight' },
  { value: 'EXHIBITION', label: 'Exhibition' },
  { value: 'BEHIND_THE_SCENES', label: 'Behind the Scenes' },
  { value: 'NEWS', label: 'News' },
  { value: 'GUIDE', label: 'Guide' },
];

const categoryColors: Record<ArticleCategory, string> = {
  ARTIST_SPOTLIGHT: 'bg-purple-100 text-purple-800',
  EXHIBITION: 'bg-blue-100 text-blue-800',
  BEHIND_THE_SCENES: 'bg-amber-100 text-amber-800',
  NEWS: 'bg-green-100 text-green-800',
  GUIDE: 'bg-teal-100 text-teal-800',
};

const categoryLabels: Record<ArticleCategory, string> = {
  ARTIST_SPOTLIGHT: 'Artist Spotlight',
  EXHIBITION: 'Exhibition',
  BEHIND_THE_SCENES: 'Behind the Scenes',
  NEWS: 'News',
  GUIDE: 'Guide',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EditorialPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'ALL'>('ALL');

  // Fetch featured article on mount
  useEffect(() => {
    apiClient
      .getFeaturedArticles(1)
      .then((res) => {
        if (res.data.length > 0) {
          setFeaturedArticle(res.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch articles
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const filters: ArticleFilters & { page: number; limit: number } = {
        page,
        limit: 12,
        sortBy: 'publishedDate',
        sortOrder: 'desc',
      };

      if (search) filters.search = search;
      if (selectedCategory !== 'ALL') filters.category = selectedCategory;

      const response = await apiClient.getArticles(filters);
      setArticles(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, [search, selectedCategory]);

  return (
    <>
      {/* Hero — Featured Article */}
      {featuredArticle && (
        <div>
          <Link
            href={`/discover/editorial/${featuredArticle.slug}`}
            className="group block relative h-[400px] md:h-[500px] overflow-hidden"
          >
            {featuredArticle.coverImageUrl ? (
              <Image
                src={featuredArticle.coverImageUrl}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-200" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <Container size="xl">
                <div className="max-w-2xl">
                  {featuredArticle.category && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${categoryColors[featuredArticle.category]}`}
                    >
                      {categoryLabels[featuredArticle.category]}
                    </span>
                  )}
                  <h2 className="text-display font-serif text-white mb-3">
                    {featuredArticle.title}
                  </h2>
                  {featuredArticle.excerpt && (
                    <p className="text-body-lg text-white/80 mb-4 line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    {featuredArticle.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredArticle.author}
                      </span>
                    )}
                    {featuredArticle.publishedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredArticle.publishedDate)}
                      </span>
                    )}
                  </div>
                </div>
              </Container>
            </div>
          </Link>
        </div>
      )}

      <Section spacing="lg" background="neutral">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-display font-serif text-neutral-900 mb-2">Editorial</h1>
            <p className="text-body-lg text-neutral-600">
              Stories, spotlights, and insights from the art world
            </p>
          </div>

          {/* Search & Category Filters */}
          <div className="bg-white rounded-lg p-4 space-y-4 mb-8">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search articles..."
            />
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-6">
            <p>
              {loading ? (
                'Loading...'
              ) : (
                <>
                  Showing {articles.length} of {pagination.total} articles
                </>
              )}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          )}

          {/* Article Grid */}
          {!loading && !error && (
            <>
              {articles.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-neutral-600">No articles found.</p>
                  {(search || selectedCategory !== 'ALL') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('ALL');
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => fetchArticles(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm text-neutral-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchArticles(pagination.page + 1)}
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
    </>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/discover/editorial/${article.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {article.category && (
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3 ${categoryColors[article.category]}`}
          >
            {categoryLabels[article.category]}
          </span>
        )}

        <h3 className="text-heading-4 font-serif text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-body text-neutral-600 line-clamp-3 mb-4">{article.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-neutral-500">
          <div className="flex items-center gap-3">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
            )}
            {article.publishedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedDate)}
              </span>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}
