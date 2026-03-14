'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiClient, type CreateArticleInput, type ArticleCategory } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'ARTIST_SPOTLIGHT', label: 'Artist Spotlight' },
  { value: 'EXHIBITION', label: 'Exhibition' },
  { value: 'BEHIND_THE_SCENES', label: 'Behind the Scenes' },
  { value: 'NEWS', label: 'News' },
  { value: 'GUIDE', label: 'Guide' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewArticlePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

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

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleBlur = () => {
    if (!slugEdited && form.title) {
      updateField('slug', slugify(form.title));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const data: CreateArticleInput = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        featured: form.featured,
      };
      if (form.excerpt) data.excerpt = form.excerpt;
      if (form.coverImageUrl) data.coverImageUrl = form.coverImageUrl;
      if (form.author) data.author = form.author;
      if (form.category) data.category = form.category as ArticleCategory;
      if (form.publishedDate) data.publishedDate = form.publishedDate;

      await apiClient.createArticle(data);
      router.push('/admin/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="text-display font-serif text-neutral-900 mb-2">New Article</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              onBlur={handleTitleBlur}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug *</label>
            <Input
              value={form.slug}
              onChange={(e) => {
                updateField('slug', e.target.value);
                setSlugEdited(true);
              }}
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

        <div className="pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Create Article
          </Button>
        </div>
      </form>
    </div>
  );
}
