'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type PageContent } from '@/lib/api-client';
import { FileText, Search, Settings, Home, Layers, PenLine } from 'lucide-react';

const SLUG_LABELS: Record<string, string> = {
  home: 'Home Page',
  contact: 'Contact Page',
  'collector-services': 'Collector Services',
  discover: 'Discover Page',
  'site-settings': 'Header & Site Settings',
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

const SLUG_DESCRIPTIONS: Record<string, string> = {
  home: 'Hero, homepage artworks, highlights, advisory, design, and about sections.',
  contact: 'Contact page copy, image, address, hours, and form messaging.',
  'collector-services': 'Collector services page sections and call-to-action.',
  discover: 'Discover landing page cards and featured story copy.',
  'site-settings': 'Logo, navigation, and site-wide SEO defaults.',
  artists: 'Browse artists page heading and empty state.',
  'artists-featured': 'Featured artists page heading and empty state.',
  artworks: 'Browse artworks page heading and empty state.',
  collections: 'Browse collections page heading and empty state.',
  footer: 'Footer logo, description, newsletter label, and footer navigation.',
};

const CONTENT_GROUPS = [
  {
    label: 'Core Pages',
    icon: Home,
    slugs: ['home', 'contact', 'collector-services', 'discover'],
  },
  {
    label: 'Site Chrome',
    icon: Settings,
    slugs: ['site-settings', 'footer'],
  },
  {
    label: 'Catalog Pages',
    icon: Layers,
    slugs: [
      'artists',
      'artists-featured',
      'artworks',
      'collections',
      'collections-new-arrivals',
      'collections-museum-quality',
      'collections-online-projects-and-exhibitions',
      'collections-featured-art',
      'collections-public-art',
      'collections-corporate-decorative-art',
      'favorites',
    ],
  },
  {
    label: 'Editorial',
    icon: PenLine,
    slugs: ['editorial', 'inspiration', 'exhibitions'],
  },
];

function formatSlug(slug: string): string {
  return SLUG_LABELS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminContentPage() {
  const { data: session } = useSession();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [search, setSearch] = useState('');
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

  const pagesBySlug = new Map(pages.map((p) => [p.slug, p]));
  const normalizedSearch = search.trim().toLowerCase();
  const filteredGroups = useMemo(
    () =>
      CONTENT_GROUPS.map((group) => ({
        ...group,
        slugs: group.slugs.filter((slug) => {
          const label = formatSlug(slug).toLowerCase();
          const description = (SLUG_DESCRIPTIONS[slug] || '').toLowerCase();
          return !normalizedSearch || label.includes(normalizedSearch) || slug.includes(normalizedSearch) || description.includes(normalizedSearch);
        }),
      })).filter((group) => group.slugs.length > 0),
    [normalizedSearch]
  );

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-display font-serif text-neutral-900 mb-2">Content Studio</h1>
            <p className="text-body-lg text-neutral-600">
              Edit site copy, navigation, SEO, homepage selections, and page-level content.
            </p>
          </div>
          <label className="relative block w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pages or settings"
              className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            />
          </label>
        </div>
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
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <section key={group.label}>
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-primary-50 p-2">
                  <group.icon className="h-4 w-4 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">{group.label}</h2>
                <span className="text-sm text-neutral-400">{group.slugs.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.slugs.map((slug) => {
                  const page = pagesBySlug.get(slug);
                  return (
                    <Link
                      key={slug}
                      href={`/admin/content/${slug}`}
                      className="group rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 text-neutral-400 group-hover:text-primary-500" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-neutral-900 group-hover:text-primary-700">
                              {formatSlug(slug)}
                            </h3>
                            {page ? (
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
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                Not created
                              </span>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                            {SLUG_DESCRIPTIONS[slug] || 'Edit page headline, copy, empty state, and SEO fields.'}
                          </p>
                          <p className="mt-4 text-xs text-neutral-400">
                            {page
                              ? `Updated ${new Date(page.updatedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}`
                              : 'Click to add content'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
          {filteredGroups.length === 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
              No editable pages match “{search}”.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
