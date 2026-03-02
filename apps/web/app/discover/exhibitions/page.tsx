'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import { apiClient, type Article } from '@/lib/api-client';
import { Loader2, Calendar, User, ArrowRight } from 'lucide-react';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ExhibitionsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getArticles({
        category: 'EXHIBITION',
        page,
        limit: 12,
        sortBy: 'publishedDate',
        sortOrder: 'desc',
      });
      setArticles(response.data);
      if (response.pagination) setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, []);

  return (
    <Section spacing="lg" background="neutral">
      <Container size="xl">
        <div className="mb-8">
          <h1 className="text-display font-serif text-neutral-900 mb-2">Exhibitions</h1>
          <p className="text-body-lg text-neutral-600">
            Current and upcoming exhibitions featuring our artists
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-600">No exhibition articles yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/discover/editorial/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
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
                  <div className="p-5">
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
              ))}
            </div>

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
  );
}
