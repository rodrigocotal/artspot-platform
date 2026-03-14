'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type Artwork } from '@/lib/api-client';
import { Image, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const MEDIUMS = [
  '', 'PAINTING', 'SCULPTURE', 'PHOTOGRAPHY', 'PRINT', 'DRAWING',
  'MIXED_MEDIA', 'DIGITAL', 'INSTALLATION', 'TEXTILE', 'CERAMICS',
  'GLASS', 'METAL', 'WOOD', 'OTHER',
];

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-success-100 text-success-800 border-success-300',
  SOLD: 'bg-error-100 text-error-800 border-error-300',
  RESERVED: 'bg-warning-100 text-warning-800 border-warning-300',
  NOT_FOR_SALE: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  ON_LOAN: 'bg-info-100 text-info-800 border-info-300',
};

function formatMedium(medium: string): string {
  return medium.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminArtworksPage() {
  const { data: session } = useSession();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mediumFilter, setMediumFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchArtworks = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      const params: Record<string, any> = { page, limit: 20 };
      if (mediumFilter) params.medium = mediumFilter;
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const response = await apiClient.getArtworks(params);
      setArtworks(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchArtworks(1);
    }
  }, [session?.accessToken, mediumFilter, statusFilter]);

  const handleSearch = () => fetchArtworks(1);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.deleteArtwork(id);
      fetchArtworks(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete artwork');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-serif text-neutral-900 mb-2">Artworks</h1>
          <p className="text-body-lg text-neutral-600">Manage gallery artworks</p>
        </div>
        <Link href="/admin/artworks/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Artwork
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3 flex-wrap">
          <select
            value={mediumFilter}
            onChange={(e) => setMediumFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Mediums</option>
            {MEDIUMS.filter(Boolean).map((m) => (
              <option key={m} value={m}>{formatMedium(m)}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            {['AVAILABLE', 'SOLD', 'RESERVED', 'NOT_FOR_SALE', 'ON_LOAN'].map((s) => (
              <option key={s} value={s}>{formatMedium(s)}</option>
            ))}
          </select>
          <div className="flex gap-2 flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline" size="md" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>

      {!loading && artworks.length > 0 && (
        <p className="text-sm text-neutral-600 mb-4">
          {pagination.total} {pagination.total === 1 ? 'artwork' : 'artworks'} found
        </p>
      )}

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {artworks.length === 0 ? (
            <div className="text-center py-20">
              <Image className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-heading-3 font-serif text-neutral-900 mb-2">No artworks found</h2>
              <p className="text-neutral-600">Create your first artwork to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Artwork
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Artist
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Medium
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {artworks.map((artwork) => (
                    <tr key={artwork.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {artwork.images?.[0] ? (
                            <img
                              src={artwork.images[0].secureUrl || artwork.images[0].url}
                              alt={artwork.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-neutral-200 flex items-center justify-center">
                              <Image className="w-5 h-5 text-neutral-400" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              {artwork.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                              <span className="font-medium text-neutral-900">{artwork.title}</span>
                            </div>
                            <p className="text-xs text-neutral-500">{artwork.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{artwork.artist?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{formatMedium(artwork.medium)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                        ${parseFloat(artwork.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            STATUS_STYLES[artwork.status] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
                          )}
                        >
                          {formatMedium(artwork.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/artworks/${artwork.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(artwork.id, artwork.title)}
                          >
                            <Trash2 className="w-4 h-4 text-error-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => fetchArtworks(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-neutral-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => fetchArtworks(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
