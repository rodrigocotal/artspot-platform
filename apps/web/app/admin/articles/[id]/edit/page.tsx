'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type ArticleCategory } from '@/lib/api-client';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'ARTIST_SPOTLIGHT', label: 'Artist Spotlight' },
  { value: 'EXHIBITION', label: 'Exhibition' },
  { value: 'BEHIND_THE_SCENES', label: 'Behind the Scenes' },
  { value: 'NEWS', label: 'News' },
  { value: 'GUIDE', label: 'Guide' },
];

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImageUrl: '',
    author: '',
    category: '' as string,
    publishedDate: '',
    featured: false,
  });

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    const fetchArticle = async () => {
      try {
        apiClient.setAccessToken(session.accessToken);
        const response = await apiClient.getArticleById(id);
        const a = response.data;
        setForm({
          title: a.title,
          slug: a.slug,
          content: a.content,
          excerpt: a.excerpt || '',
          coverImageUrl: a.coverImageUrl || '',
          author: a.author || '',
          category: a.category || '',
          publishedDate: a.publishedDate ? a.publishedDate.slice(0, 10) : '',
          featured: a.featured,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [session?.accessToken, id]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const data: Record<string, any> = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        featured: form.featured,
      };
      if (form.excerpt) data.excerpt = form.excerpt;
      if (form.coverImageUrl) data.coverImageUrl = form.coverImageUrl;
      if (form.author) data.author = form.author;
      if (form.category) data.category = form.category;
      if (form.publishedDate) data.publishedDate = form.publishedDate;

      await apiClient.updateArticle(id, data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return;

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.deleteArticle(id);
      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">Edit Article</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-success-700 mb-6">
          Article updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug *</label>
            <Input
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">None</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Author</label>
            <Input value={form.author} onChange={(e) => updateField('author', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Published Date</label>
            <input
              type="date"
              value={form.publishedDate}
              onChange={(e) => updateField('publishedDate', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image URL</label>
          <Input
            value={form.coverImageUrl}
            onChange={(e) => updateField('coverImageUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Content *</label>
          <textarea
            value={form.content}
            onChange={(e) => updateField('content', e.target.value)}
            rows={12}
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
            className="rounded border-neutral-300"
          />
          <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
            Featured article
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-error-500" />
            Delete Article
          </Button>
        </div>
      </form>
    </div>
  );
}
