'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui';
import { apiClient } from '@/lib/api-client';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  /** Current image URL (stored as a plain string). */
  value: string;
  onChange: (url: string) => void;
  /** Tailwind classes for the preview box; defaults to a round avatar. */
  previewClassName?: string;
}

/**
 * Upload control for a single image stored as a URL string (e.g. an artist's
 * profileImageUrl). Uploads the chosen file to Cloudinary via the existing
 * /upload/cms endpoint and stores the returned URL. A manual URL input is kept
 * as a fallback so external URLs still work.
 */
export function ImageUploadField({ value, onChange, previewClassName }: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await apiClient.uploadCmsImage(file);
      onChange(res.image.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div
          className={
            previewClassName ??
            'w-20 h-20 rounded-full border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden flex-shrink-0'
          }
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
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
              {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 text-neutral-600 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-error-700">{error}</p>}
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
          />
        </div>
      </div>

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
  );
}
