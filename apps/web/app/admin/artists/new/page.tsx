'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiClient, type CreateArtistInput } from '@/lib/api-client';
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

export default function NewArtistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    bio: '',
    statement: '',
    location: '',
    website: '',
    email: '',
    phoneNumber: '',
    profileImageUrl: '',
    featured: false,
    verified: false,
  });

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameBlur = () => {
    if (!slugEdited && form.name) {
      updateField('slug', slugify(form.name));
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

      const data: CreateArtistInput = {
        name: form.name,
        slug: form.slug,
        featured: form.featured,
        verified: form.verified,
      };
      if (form.bio) data.bio = form.bio;
      if (form.statement) data.statement = form.statement;
      if (form.location) data.location = form.location;
      if (form.website) data.website = form.website;
      if (form.email) data.email = form.email;
      if (form.phoneNumber) data.phoneNumber = form.phoneNumber;
      if (form.profileImageUrl) data.profileImageUrl = form.profileImageUrl;

      await apiClient.createArtist(data);
      router.push('/admin/artists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create artist');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/artists"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artists
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">New Artist</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
            <Input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={handleNameBlur}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
            <Input value={form.location} onChange={(e) => updateField('location', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Profile Image URL</label>
            <Input
              value={form.profileImageUrl}
              onChange={(e) => updateField('profileImageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Artist Statement</label>
          <textarea
            value={form.statement}
            onChange={(e) => updateField('statement', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Website</label>
            <Input value={form.website} onChange={(e) => updateField('website', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <Input value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
            <Input value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={form.verified}
              onChange={(e) => updateField('verified', e.target.checked)}
              className="rounded border-neutral-300"
            />
            <label htmlFor="verified" className="text-sm font-medium text-neutral-700">Verified</label>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Create Artist
          </Button>
        </div>
      </form>
    </div>
  );
}
