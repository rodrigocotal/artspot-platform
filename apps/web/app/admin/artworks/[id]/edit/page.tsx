'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type Artist } from '@/lib/api-client';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
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

export default function EditArtworkPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
    if (!session?.accessToken || !id) return;

    const fetchData = async () => {
      try {
        apiClient.setAccessToken(session.accessToken);
        const [artworkRes, artistsRes] = await Promise.all([
          apiClient.getArtwork(id),
          apiClient.getArtists({ limit: 100 }),
        ]);
        setArtists(artistsRes.data);

        const a = artworkRes.data;
        setForm({
          title: a.title,
          slug: a.slug,
          description: a.description || '',
          artistId: a.artist?.id || '',
          medium: a.medium,
          style: a.style || '',
          year: a.year != null ? String(a.year) : '',
          width: a.width != null ? String(a.width) : '',
          height: a.height != null ? String(a.height) : '',
          depth: a.depth != null ? String(a.depth) : '',
          price: String(a.price),
          currency: a.currency,
          status: a.status,
          purchaseMode: a.purchaseMode,
          featured: a.featured,
          edition: a.edition || '',
          materials: a.materials || '',
          signature: a.signature || '',
          certificate: a.certificate,
          framed: a.framed,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        artistId: form.artistId,
        medium: form.medium,
        price: parseFloat(form.price),
        currency: form.currency,
        status: form.status,
        purchaseMode: form.purchaseMode,
        featured: form.featured,
        certificate: form.certificate,
        framed: form.framed,
        description: form.description || null,
        style: form.style || null,
        year: form.year ? parseInt(form.year, 10) : null,
        width: form.width ? parseFloat(form.width) : null,
        height: form.height ? parseFloat(form.height) : null,
        depth: form.depth ? parseFloat(form.depth) : null,
        edition: form.edition || null,
        materials: form.materials || null,
        signature: form.signature || null,
      };

      await apiClient.updateArtwork(id, data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update artwork');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this artwork? This cannot be undone.')) return;

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.deleteArtwork(id);
      router.push('/admin/artworks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete artwork');
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
          href="/admin/artworks"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artworks
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">Edit Artwork</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-success-700 mb-6">
          Artwork updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
        {/* Basic Info */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Basic Info</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title *</label>
              <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Slug *</label>
              <Input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} required />
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
              <Input type="number" value={form.year} onChange={(e) => updateField('year', e.target.value)} min={1000} max={new Date().getFullYear() + 1} />
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

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-error-500" />
            Delete Artwork
          </Button>
        </div>
      </form>
    </div>
  );
}
