'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type Article, type ArticleCategory } from '@/lib/api-client';
import { Newspaper, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'ARTIST_SPOTLIGHT', label: 'Artist Spotlight' },
  { value: 'EXHIBITION', label: 'Exhibition' },
  { value: 'BEHIND_THE_SCENES', label: 'Behind the Scenes' },
  { value: 'NEWS', label: 'News' },
  { value: 'GUIDE', label: 'Guide' },
];

const CATEGORY_STYLES: Record<string, string> = {
  ARTIST_SPOTLIGHT: 'bg-purple-100 text-purple-800 border-purple-300',
  EXHIBITION: 'bg-blue-100 text-blue-800 border-blue-300',
  BEHIND_THE_SCENES: 'bg-amber-100 text-amber-800 border-amber-300',
  NEWS: 'bg-green-100 text-green-800 border-green-300',
  GUIDE: 'bg-rose-100 text-rose-800 border-rose-300',
};

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return null;
  const label = CATEGORIES.find((c) => c.value === category)?.label || category;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        CATEGORY_STYLES[category] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
      )}
    >
      {label}
    </span>
  );
}

export default function AdminArticlesPage() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (categoryFilter) params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getArticles(params);
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
    if (session?.accessToken) {
      fetchArticles(1);
    }
  }, [session?.accessToken, categoryFilter]);

  const handleSearch = () => fetchArticles(1);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.deleteArticle(id);
      fetchArticles(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-serif text-neutral-900 mb-2">Articles</h1>
          <p className="text-body-lg text-neutral-600">Manage editorial content</p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={categoryFilter === cat.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" size="md" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {!loading && articles.length > 0 && (
        <p className="text-sm text-neutral-600 mb-4">
          {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
        </p>
      )}

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">No articles found</h2>
              <p className="text-neutral-600">
                {categoryFilter ? 'No articles in this category.' : 'Create your first article to get started.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {article.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                          <span className="font-medium text-neutral-900">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={article.category} />
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{article.author || '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {article.publishedDate
                          ? new Date(article.publishedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id, article.title)}
                          >
                            <Trash2 className="w-4 h-4 text-error-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
    </div>
  );
}
