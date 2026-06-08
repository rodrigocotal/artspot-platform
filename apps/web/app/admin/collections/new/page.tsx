'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiClient, type CreateCollectionInput } from '@/lib/api-client';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewCollectionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    coverImageUrl: '',
    featured: false,
  });

  useEffect(() => {
    if (session?.accessToken) {
      apiClient.setAccessToken(session.accessToken);
    }
  }, [session?.accessToken]);

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

      const data: CreateCollectionInput = {
        title: form.title,
        slug: form.slug,
        featured: form.featured,
      };
      if (form.description) data.description = form.description;
      if (form.coverImageUrl) data.coverImageUrl = form.coverImageUrl;

      const res = await apiClient.createCollection(data);
      // Go straight to edit so artworks can be added.
      router.push(`/admin/collections/${res.data.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">New Collection</h1>
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
              placeholder="lowercase-with-hyphens"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image</label>
          <ImageUploadField
            value={form.coverImageUrl}
            onChange={(url) => updateField('coverImageUrl', url)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
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
          <label htmlFor="featured" className="text-sm font-medium text-neutral-700">Featured</label>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Create Collection
          </Button>
          <p className="text-xs text-neutral-500 mt-2">
            You&apos;ll be able to add artworks after creating the collection.
          </p>
        </div>
      </form>
    </div>
  );
}
