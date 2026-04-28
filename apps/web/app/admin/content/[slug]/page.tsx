'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { JsonArrayEditor, type FieldConfig } from '@/components/admin/json-array-editor';
import { NavEditor } from '@/components/admin/nav-editor';
import { ImageField } from '@/components/admin/image-field';
import { SeoField } from '@/components/admin/seo-field';
import { PREVIEW_COMPONENTS, DEFAULT_PREVIEW } from '@/components/admin/previews';
import { ArrowLeft, Save, Upload, Eye, Pencil } from 'lucide-react';
import Link from 'next/link';

type FieldType = 'text' | 'textarea' | 'json-array' | 'nav' | 'image' | 'seo';

interface FormField {
  key: string;
  label: string;
  type: FieldType;
  itemFields?: FieldConfig[];
  addLabel?: string;
  seoVariant?: 'page' | 'site-defaults';
}

const FIELD_CONFIGS: Record<string, FormField[]> = {
  home: [
    { key: 'heroBadgeText', label: 'Hero Badge Text', type: 'text' },
    { key: 'heroHeadline', label: 'Hero Headline', type: 'text' },
    { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'heroImage', label: 'Hero Image', type: 'image' },
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
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  contact: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'contactImage', label: 'Contact Image', type: 'image' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'businessHours', label: 'Business Hours', type: 'textarea' },
    { key: 'formHeadline', label: 'Form Headline', type: 'text' },
    { key: 'formSubtitle', label: 'Form Subtitle', type: 'text' },
    { key: '_seo', label: 'SEO', type: 'seo' },
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
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  discover: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'site-settings': [
    { key: 'logoText', label: 'Logo Text', type: 'text' },
    { key: 'navigation', label: 'Navigation', type: 'nav' },
    { key: '_seo', label: 'Site-wide SEO Defaults', type: 'seo', seoVariant: 'site-defaults' },
  ],
  artists: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'artists-featured': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  artworks: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  collections: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-new-arrivals': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-museum-quality': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-online-projects-and-exhibitions': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'heroImage', label: 'Hero Image', type: 'image' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-featured-art': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'heroImage', label: 'Hero Image', type: 'image' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-public-art': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'heroImage', label: 'Hero Image', type: 'image' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  'collections-corporate-decorative-art': [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'heroImage', label: 'Hero Image', type: 'image' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  editorial: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  inspiration: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  exhibitions: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  favorites: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: '_seo', label: 'SEO', type: 'seo' },
  ],
  footer: [
    { key: 'brandName', label: 'Brand Name', type: 'text' },
    { key: 'brandDescription', label: 'Brand Description', type: 'textarea' },
    { key: 'newsletterLabel', label: 'Newsletter Label', type: 'text' },
    { key: 'copyrightName', label: 'Copyright Name', type: 'text' },
  ],
};

const SLUG_LABELS: Record<string, string> = {
  home: 'Home Page',
  contact: 'Contact Page',
  'collector-services': 'Collector Services',
  discover: 'Discover Page',
  'site-settings': 'Site Settings',
  artists: 'Browse Artists',
  'artists-featured': 'Featured Artists',
  artworks: 'Browse Artworks',
  collections: 'Browse Collections',
  'collections-new-arrivals': 'New Arrivals',
  'collections-museum-quality': 'Museum Quality',
  'collections-online-projects-and-exhibitions': 'Online Projects & Exhibitions',
  'collections-featured-art': 'Featured Art',
  'collections-public-art': 'Public Art',
  'collections-corporate-decorative-art': 'Corporate / Decorative Art',
  editorial: 'Editorial',
  inspiration: 'Inspiration',
  exhibitions: 'Exhibitions',
  favorites: 'Favorites',
  footer: 'Footer',
};

export default function EditContentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const [content, setContent] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  const fields = FIELD_CONFIGS[slug] || [];
  const pageLabel = SLUG_LABELS[slug] || slug;
  const PreviewComponent = PREVIEW_COMPONENTS[slug] || DEFAULT_PREVIEW;

  useEffect(() => {
    if (!session?.accessToken || !slug) return;

    const fetchContent = async () => {
      try {
        apiClient.setAccessToken(session.accessToken as string);
        const response = await apiClient.getPageContentDraft(slug);
        const page = response.data;
        const editContent = (page.draftContent as Record<string, any>) ?? (page.content as Record<string, any>);
        setContent(editContent);
        setStatus(page.status || 'PUBLISHED');
      } catch {
        setContent({});
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [session?.accessToken, slug]);

  const updateField = (key: string, value: any) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSuccess(null);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken as string);
      }

      const response = await apiClient.updatePageContent(slug, content);
      setStatus(response.data.status || 'DRAFT');
      setSuccess('Draft saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this content? It will become visible on the public site.')) return;

    setPublishing(true);
    setError(null);
    setSuccess(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken as string);
      }

      await apiClient.updatePageContent(slug, content);
      const response = await apiClient.publishPageContent(slug);
      setStatus(response.data.status || 'PUBLISHED');
      setSuccess('Content published successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
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
      <div className="mb-6">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Content
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-display font-serif text-neutral-900">Edit {pageLabel}</h1>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'DRAFT' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
            {status === 'DRAFT' ? 'Draft' : 'Published'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-success-700 mb-6">
          {success}
        </div>
      )}

      {fields.length === 0 ? (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 text-warning-700">
          No field configuration defined for this page. You can add one in the FIELD_CONFIGS map.
        </div>
      ) : (
        <>
          {/* Mobile tab toggle */}
          <div className="flex lg:hidden mb-4 border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setMobileTab('edit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mobileTab === 'edit'
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-white text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mobileTab === 'preview'
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-white text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <div className="lg:flex lg:gap-6">
            {/* Form (left panel) */}
            <div
              className={`lg:w-1/2 ${
                mobileTab === 'edit' ? 'block' : 'hidden lg:block'
              }`}
            >
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

                    {field.type === 'image' && (
                      <ImageField
                        value={content[field.key] ?? null}
                        onChange={(val) => updateField(field.key, val)}
                      />
                    )}

                    {field.type === 'seo' && (
                      <SeoField
                        value={content[field.key] ?? null}
                        onChange={(val) => updateField(field.key, val)}
                        variant={field.seoVariant}
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-neutral-200 flex gap-3">
                  <Button onClick={handleSaveDraft} loading={saving} variant="outline">
                    <Save className="w-4 h-4" />
                    Save Draft
                  </Button>
                  <Button onClick={handlePublish} loading={publishing}>
                    <Upload className="w-4 h-4" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview (right panel) */}
            <div
              className={`lg:w-1/2 ${
                mobileTab === 'preview' ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="sticky top-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-500">Live Preview</span>
                </div>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="overflow-hidden">
                    <div className="scale-[0.55] origin-top-left w-[180%]">
                      <PreviewComponent content={content} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
