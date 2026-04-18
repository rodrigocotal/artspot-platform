'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import type { ImageFieldValue } from '@/lib/seo';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

export interface ImageFieldProps {
  value: ImageFieldValue | null | undefined;
  onChange: (value: ImageFieldValue | null) => void;
  allowLink?: boolean;
  allowCaption?: boolean;
  allowVisibility?: boolean;
}

export function ImageField({
  value,
  onChange,
  allowLink = true,
  allowCaption = true,
  allowVisibility = true,
}: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const image = value ?? null;

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await apiClient.uploadCmsImage(file);
      onChange({
        url: res.image.url,
        publicId: res.image.publicId,
        width: res.image.width,
        height: res.image.height,
        alt: image?.alt ?? '',
        caption: image?.caption,
        linkUrl: image?.linkUrl,
        visible: image?.visible ?? true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const update = (patch: Partial<ImageFieldValue>) => {
    if (!image) return;
    onChange({ ...image, ...patch });
  };

  // Accessibility warning: if a link is set but alt is empty, the wrapping
  // <a> in <HeroImage> will have no accessible name (WCAG 2.4.4).
  const altWarning =
    image?.linkUrl && !image?.alt?.trim()
      ? 'Alt text is required when a link is set (accessibility).'
      : null;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-32 h-20 rounded border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.alt ?? ''} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-neutral-300" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading…' : image?.url ? 'Replace' : 'Upload'}
            </button>
            {image?.url && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 text-neutral-600"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-error-700">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {image?.url && (
        <div className="space-y-2 pl-36">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Alt text <span className="text-error-600">*</span>
            </label>
            <Input
              value={image.alt ?? ''}
              onChange={(e) => update({ alt: e.target.value })}
              placeholder="Describe the image for screen readers"
            />
            {altWarning && <p className="mt-1 text-xs text-warning-700">{altWarning}</p>}
          </div>
          {allowCaption && (
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Caption</label>
              <Input
                value={image.caption ?? ''}
                onChange={(e) => update({ caption: e.target.value })}
                placeholder="Optional caption shown below the image"
              />
            </div>
          )}
          {allowLink && (
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Link URL</label>
              <Input
                value={image.linkUrl ?? ''}
                onChange={(e) => update({ linkUrl: e.target.value })}
                placeholder="/collections/spring  or  https://..."
              />
            </div>
          )}
          {allowVisibility && (
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={image.visible !== false}
                onChange={(e) => update({ visible: e.target.checked })}
              />
              Visible on public page
            </label>
          )}
        </div>
      )}
    </div>
  );
}
