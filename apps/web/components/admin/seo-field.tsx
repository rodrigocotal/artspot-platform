'use client';

import { Input } from '@/components/ui';
import { ImageField } from './image-field';
import type { ImageFieldValue } from '@/lib/seo';

interface SeoFieldValue {
  title?: string;
  description?: string;
  image?: ImageFieldValue | null;
  siteName?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultImage?: ImageFieldValue | null;
}

interface SeoFieldProps {
  value: SeoFieldValue | null | undefined;
  onChange: (value: SeoFieldValue) => void;
  variant?: 'page' | 'site-defaults';
}

export function SeoField({ value, onChange, variant = 'page' }: SeoFieldProps) {
  const seo = value ?? {};

  const update = (patch: Partial<SeoFieldValue>) => onChange({ ...seo, ...patch });

  if (variant === 'site-defaults') {
    return (
      <div className="space-y-4 bg-neutral-50 p-4 rounded border border-neutral-200">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Site Name</label>
          <Input
            value={seo.siteName ?? ''}
            onChange={(e) => update({ siteName: e.target.value })}
            placeholder="ArtAldo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Default Title</label>
          <Input
            value={seo.defaultTitle ?? ''}
            onChange={(e) => update({ defaultTitle: e.target.value })}
            placeholder="ArtAldo — Museum-Quality Art"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Used when a page has no explicit SEO title and no headline.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Default Description</label>
          <textarea
            value={seo.defaultDescription ?? ''}
            onChange={(e) => update({ defaultDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Default Social Image</label>
          <ImageField
            value={seo.defaultImage}
            onChange={(v) => update({ defaultImage: v })}
            allowLink={false}
            allowCaption={false}
            allowVisibility={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-neutral-50 p-4 rounded border border-neutral-200">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">SEO Title</label>
        <Input
          value={seo.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Leave blank to use page headline"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">SEO Description</label>
        <textarea
          value={seo.description ?? ''}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
          placeholder="Leave blank to use page subtitle"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Social Image (OG)</label>
        <ImageField
          value={seo.image}
          onChange={(v) => update({ image: v })}
          allowLink={false}
          allowCaption={false}
          allowVisibility={false}
        />
      </div>
    </div>
  );
}
