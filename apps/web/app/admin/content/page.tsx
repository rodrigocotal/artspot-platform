'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type PageContent } from '@/lib/api-client';
import { FileText } from 'lucide-react';

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

function formatSlug(slug: string): string {
  return SLUG_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminContentPage() {
  const { data: session } = useSession();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchPages = async () => {
      try {
        apiClient.setAccessToken(session.accessToken as string);
        const response = await apiClient.listPageContents();
        setPages(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [session?.accessToken]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-serif text-neutral-900 mb-2">Content Management</h1>
        <p className="text-body-lg text-neutral-600">Edit page content and site settings</p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/admin/content/${page.slug}`}
              className="bg-white rounded-lg border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900 group-hover:text-primary-700">
                      {formatSlug(page.slug)}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        page.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          page.status === 'DRAFT' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                      {page.status === 'DRAFT' ? 'Draft' : 'Published'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    Last updated{' '}
                    {new Date(page.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {pages.length === 0 && (
            <div className="col-span-full text-center py-20">
              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">No pages found</h2>
              <p className="text-neutral-600">No page content has been created yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
