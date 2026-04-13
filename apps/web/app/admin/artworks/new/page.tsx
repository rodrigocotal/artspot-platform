'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { apiClient, type Artist, type UploadedImage } from '@/lib/api-client';
import { ArrowLeft, Save, Upload, X, ImageIcon } from 'lucide-react';
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

interface StagedImage {
  file: File;
  preview: string;
  uploading?: boolean;
  uploaded?: UploadedImage;
  error?: string;
}

export default function NewArtworkPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [images, setImages] = useState<StagedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dimUnit, setDimUnit] = useState<'cm' | 'in'>('in');

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
    apiClient.setAccessToken(session.accessToken as string);
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

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken as string);
      }

      // 1. Upload all images to Cloudinary
      const uploadedImages: UploadedImage[] = [];
      for (let i = 0; i < images.length; i++) {
        setImages((prev) =>
          prev.map((img, idx) => (idx === i ? { ...img, uploading: true } : img))
        );
        try {
          const result = await apiClient.uploadArtworkImage(images[i].file);
          uploadedImages.push(result.image);
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i ? { ...img, uploading: false, uploaded: result.image } : img
            )
          );
        } catch (err) {
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i
                ? { ...img, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' }
                : img
            )
          );
          throw new Error(`Failed to upload image ${i + 1}`);
        }
      }

      // 2. Create the artwork
      const data: any = {
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
      const toCm = (v: string) => {
        const n = parseFloat(v);
        return dimUnit === 'in' ? Math.round(n * 2.54 * 100) / 100 : n;
      };
      if (form.width) data.width = toCm(form.width);
      if (form.height) data.height = toCm(form.height);
      if (form.depth) data.depth = toCm(form.depth);
      if (form.edition) data.edition = form.edition;
      if (form.materials) data.materials = form.materials;
      if (form.signature) data.signature = form.signature;

      const artworkRes = await apiClient.createArtwork(data);

      // 3. Link uploaded images to the artwork
      for (let i = 0; i < uploadedImages.length; i++) {
        const img = uploadedImages[i];
        await apiClient.addArtworkImage(artworkRes.data.id, {
          publicId: img.publicId,
          url: img.url,
          secureUrl: img.url,
          width: img.width,
          height: img.height,
          format: img.format,
          size: img.size,
          type: i === 0 ? 'MAIN' : 'ALTERNATE',
        });
      }

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
        {/* Images */}
        <fieldset>
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Images</legend>
          <div className="flex flex-wrap gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-200 group">
                <img
                  src={img.preview}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {img.uploaded && (
                  <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                    &#10003;
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <span className="text-white text-xs px-1 text-center">{img.error}</span>
                  </div>
                )}
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-400 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-primary-500 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs">Add Image</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <p className="text-xs text-neutral-500 mt-2">
            First image will be the main image. Supports JPG, PNG, WebP up to 50MB.
          </p>
        </fieldset>

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
          <legend className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
            Dimensions
            <span className="ml-3 inline-flex items-center rounded-lg border border-neutral-300 overflow-hidden text-xs font-normal">
              <button
                type="button"
                onClick={() => setDimUnit('cm')}
                className={`px-3 py-1 transition-colors ${dimUnit === 'cm' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => setDimUnit('in')}
                className={`px-3 py-1 transition-colors ${dimUnit === 'in' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
              >
                in
              </button>
            </span>
          </legend>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Width ({dimUnit})</label>
              <Input type="number" step="0.01" value={form.width} onChange={(e) => updateField('width', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Height ({dimUnit})</label>
              <Input type="number" step="0.01" value={form.height} onChange={(e) => updateField('height', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Depth ({dimUnit})</label>
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
            {images.length > 0 ? `Upload ${images.length} Image${images.length > 1 ? 's' : ''} & Create Artwork` : 'Create Artwork'}
          </Button>
        </div>
      </form>
    </div>
  );
}
