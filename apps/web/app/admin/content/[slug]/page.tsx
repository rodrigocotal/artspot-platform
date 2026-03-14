'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { JsonArrayEditor, type FieldConfig } from '@/components/admin/json-array-editor';
import { NavEditor } from '@/components/admin/nav-editor';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

type FieldType = 'text' | 'textarea' | 'json-array' | 'nav';

interface FormField {
  key: string;
  label: string;
  type: FieldType;
  itemFields?: FieldConfig[];
  addLabel?: string;
}

const FIELD_CONFIGS: Record<string, FormField[]> = {
  home: [
    { key: 'heroBadgeText', label: 'Hero Badge Text', type: 'text' },
    { key: 'heroHeadline', label: 'Hero Headline', type: 'text' },
    { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'heroCtaText', label: 'Hero CTA Text', type: 'text' },
    { key: 'heroCtaLink', label: 'Hero CTA Link', type: 'text' },
    { key: 'heroSecondaryCtaText', label: 'Secondary CTA Text', type: 'text' },
    { key: 'heroSecondaryCtaLink', label: 'Secondary CTA Link', type: 'text' },
    { key: 'featuresHeadline', label: 'Features Headline', type: 'text' },
    { key: 'featuresSubtitle', label: 'Features Subtitle', type: 'textarea' },
    {
      key: 'features',
      label: 'Features',
      type: 'json-array',
      itemFields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon Name', type: 'text' },
      ],
      addLabel: 'Add Feature',
    },
  ],
  contact: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'businessHours', label: 'Business Hours', type: 'textarea' },
    { key: 'formHeadline', label: 'Form Headline', type: 'text' },
    { key: 'formSubtitle', label: 'Form Subtitle', type: 'text' },
  ],
  'collector-services': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'introContent', label: 'Intro Content', type: 'textarea' },
    {
      key: 'services',
      label: 'Services',
      type: 'json-array',
      itemFields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon Name', type: 'text' },
      ],
      addLabel: 'Add Service',
    },
  ],
  discover: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
  ],
  'site-settings': [
    { key: 'logoText', label: 'Logo Text', type: 'text' },
    { key: 'navigation', label: 'Navigation', type: 'nav' },
  ],
};

const SLUG_LABELS: Record<string, string> = {
  home: 'Home Page',
  contact: 'Contact Page',
  'collector-services': 'Collector Services',
  discover: 'Discover Page',
  'site-settings': 'Site Settings',
};

export default function EditContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fields = FIELD_CONFIGS[slug] || [];
  const pageLabel = SLUG_LABELS[slug] || slug;

  useEffect(() => {
    if (!session?.accessToken || !slug) return;

    const fetchContent = async () => {
      try {
        apiClient.setAccessToken(session.accessToken);
        const response = await apiClient.getPageContent(slug);
        setContent(response.data.content as Record<string, any>);
      } catch {
        // Page may not exist yet — start with empty content
        setContent({});
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [session?.accessToken, slug]);

  const updateField = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      await apiClient.updatePageContent(slug, content);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
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
          href="/admin/content"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">Edit {pageLabel}</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-success-700 mb-6">
          Content saved successfully.
        </div>
      )}

      {fields.length === 0 ? (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 text-warning-700">
          No field configuration defined for this page. You can add one in the FIELD_CONFIGS map.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {field.label}
              </label>

              {field.type === 'text' && (
                <Input
                  value={content[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={content[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              )}

              {field.type === 'json-array' && (
                <JsonArrayEditor
                  value={content[field.key] || []}
                  onChange={(val) => updateField(field.key, val)}
                  itemFields={field.itemFields || []}
                  addLabel={field.addLabel}
                />
              )}

              {field.type === 'nav' && (
                <NavEditor
                  value={
                    content[field.key]?.items
                      ? content[field.key].items
                      : Array.isArray(content[field.key])
                        ? content[field.key]
                        : []
                  }
                  onChange={(val) => updateField(field.key, { items: val })}
                />
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-neutral-200">
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
