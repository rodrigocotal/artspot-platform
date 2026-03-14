'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiClient, type Artist, type CreateArtworkInput } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const MEDIUMS = [
  'PAINTING', 'SCULPTURE', 'PHOTOGRAPHY', 'PRINT', 'DRAWING',
  'MIXED_MEDIA', 'DIGITAL', 'INSTALLATION', 'TEXTILE', 'CERAMICS',
  'GLASS', 'METAL', 'WOOD', 'OTHER',
];

const STYLES = [
  'ABSTRACT', 'CONTEMPORARY', 'FIGURATIVE', 'IMPRESSIONIST', 'MINIMALIST',
  'REALISM', 'EXPRESSIONISM', 'SURREALISM', 'POP_ART', 'CONCEPTUAL',
  'LANDSCAPE', 'PORTRAIT', 'STILL_LIFE', 'OTHER',
];

const STATUSES = ['AVAILABLE', 'SOLD', 'RESERVED', 'NOT_FOR_SALE', 'ON_LOAN'];

function formatLabel(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewArtworkPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    artistId: '',
    medium: 'PAINTING',
    style: '',
    year: '',
    width: '',
    height: '',
    depth: '',
    price: '',
    currency: 'USD',
    status: 'AVAILABLE',
    purchaseMode: 'INQUIRY_ONLY' as 'DIRECT' | 'INQUIRY_ONLY',
    featured: false,
    edition: '',
    materials: '',
    signature: '',
    certificate: false,
    framed: false,
  });

  useEffect(() => {
    if (!session?.accessToken) return;
    apiClient.setAccessToken(session.accessToken);
    apiClient.getArtists({ limit: 100 }).then((res) => setArtists(res.data));
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

      const data: CreateArtworkInput = {
        title: form.title,
        slug: form.slug,
        artistId: form.artistId,
        medium: form.medium,
        price: parseFloat(form.price),
        currency: form.currency,
        status: form.status,
        purchaseMode: form.purchaseMode,
        featured: form.featured,
        certificate: form.certificate,
        framed: form.framed,
      };
      if (form.description) data.description = form.description;
      if (form.style) data.style = form.style;
      if (form.year) data.year = parseInt(form.year, 10);
      if (form.width) data.width = parseFloat(form.width);
      if (form.height) data.height = parseFloat(form.height);
      if (form.depth) data.depth = parseFloat(form.depth);
      if (form.edition) data.edition = form.edition;
      if (form.materials) data.materials = form.materials;
      if (form.signature) data.signature = form.signature;

      await apiClient.createArtwork(data);
      router.push('/admin/artworks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create artwork');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/artworks"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artworks
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">New Artwork</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
        {/* Basic Info */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Basic Info</legend>
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Artist *</label>
            <select
              value={form.artistId}
              onChange={(e) => updateField('artistId', e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select an artist</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </fieldset>

        {/* Classification */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Classification</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Medium *</label>
              <select
                value={form.medium}
                onChange={(e) => updateField('medium', e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {MEDIUMS.map((m) => (
                  <option key={m} value={m}>{formatLabel(m)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Style</label>
              <select
                value={form.style}
                onChange={(e) => updateField('style', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">None</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{formatLabel(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Year</label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                min={1000}
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>
        </fieldset>

        {/* Dimensions */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Dimensions (cm)</legend>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Width</label>
              <Input type="number" step="0.01" value={form.width} onChange={(e) => updateField('width', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Height</label>
              <Input type="number" step="0.01" value={form.height} onChange={(e) => updateField('height', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Depth</label>
              <Input type="number" step="0.01" value={form.depth} onChange={(e) => updateField('depth', e.target.value)} />
            </div>
          </div>
        </fieldset>

        {/* Pricing & Availability */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Pricing & Availability</legend>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price *</label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Currency</label>
              <Input value={form.currency} onChange={(e) => updateField('currency', e.target.value)} maxLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{formatLabel(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Purchase Mode</label>
              <select
                value={form.purchaseMode}
                onChange={(e) => updateField('purchaseMode', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="INQUIRY_ONLY">Inquiry Only</option>
                <option value="DIRECT">Direct Purchase</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Additional Details */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Additional Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Edition</label>
              <Input value={form.edition} onChange={(e) => updateField('edition', e.target.value)} placeholder="e.g., 1/10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Materials</label>
              <Input value={form.materials} onChange={(e) => updateField('materials', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Signature</label>
              <Input value={form.signature} onChange={(e) => updateField('signature', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="rounded border-neutral-300" />
              <label htmlFor="featured" className="text-sm font-medium text-neutral-700">Featured</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="certificate" checked={form.certificate} onChange={(e) => updateField('certificate', e.target.checked)} className="rounded border-neutral-300" />
              <label htmlFor="certificate" className="text-sm font-medium text-neutral-700">Certificate of Authenticity</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="framed" checked={form.framed} onChange={(e) => updateField('framed', e.target.checked)} className="rounded border-neutral-300" />
              <label htmlFor="framed" className="text-sm font-medium text-neutral-700">Framed</label>
            </div>
          </div>
        </fieldset>

        <div className="pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Create Artwork
          </Button>
        </div>
      </form>
    </div>
  );
}
