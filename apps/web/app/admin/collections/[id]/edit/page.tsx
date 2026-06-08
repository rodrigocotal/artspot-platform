'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient, type Collection, type Artwork } from '@/lib/api-client';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { ArrowLeft, Save, Trash2, Plus, X, Search } from 'lucide-react';
import Link from 'next/link';

export default function EditCollectionPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    coverImageUrl: '',
    featured: false,
  });

  // Artwork picker state
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Artwork[]>([]);
  const [searching, setSearching] = useState(false);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  const loadCollection = useCallback(async () => {
    if (!session?.accessToken || !id) return;
    try {
      apiClient.setAccessToken(session.accessToken);
      const response = await apiClient.getCollection(id);
      const c = response.data;
      setCollection(c);
      setForm({
        title: c.title,
        slug: c.slug,
        description: c.description || '',
        coverImageUrl: c.coverImageUrl || '',
        featured: c.featured,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, id]);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

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

      await apiClient.updateCollection(id, {
        title: form.title,
        slug: form.slug,
        featured: form.featured,
        description: form.description || null,
        coverImageUrl: form.coverImageUrl || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this collection? This cannot be undone.')) return;
    try {
      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }
      await apiClient.deleteCollection(id);
      router.push('/admin/collections');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete collection');
    }
  };

  const handleSearchArtworks = async () => {
    setSearching(true);
    setArtworkError(null);
    try {
      apiClient.setAccessToken(session?.accessToken ?? null);
      const res = await apiClient.getArtworks({
        search: search.trim() || undefined,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setResults(res.data);
    } catch (err) {
      setArtworkError(err instanceof Error ? err.message : 'Failed to search artworks');
    } finally {
      setSearching(false);
    }
  };

  const currentArtworkIds = new Set(
    collection?.artworks?.map((item) => item.artwork.id) ?? []
  );

  const handleAddArtwork = async (artworkId: string) => {
    setArtworkError(null);
    try {
      apiClient.setAccessToken(session?.accessToken ?? null);
      const res = await apiClient.addArtworksToCollection(id, [artworkId]);
      setCollection(res.data);
    } catch (err) {
      setArtworkError(err instanceof Error ? err.message : 'Failed to add artwork');
    }
  };

  const handleRemoveArtwork = async (artworkId: string) => {
    setArtworkError(null);
    try {
      apiClient.setAccessToken(session?.accessToken ?? null);
      const res = await apiClient.removeArtworkFromCollection(id, artworkId);
      setCollection(res.data);
    } catch (err) {
      setArtworkError(err instanceof Error ? err.message : 'Failed to remove artwork');
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

  const collectionArtworks = collection?.artworks?.map((item) => item.artwork) ?? [];

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </Link>
        <h1 className="text-display font-serif text-neutral-900 mb-2">Edit Collection</h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 text-success-700 mb-6">
          Collection updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Image</label>
          <ImageUploadField
            value={form.coverImageUrl}
            onChange={(url) => updateField('coverImageUrl', url)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
            className="rounded border-neutral-300"
          />
          <label htmlFor="featured" className="text-sm font-medium text-neutral-700">Featured</label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-error-500" />
            Delete Collection
          </Button>
        </div>
      </form>

      {/* Artwork management */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 mt-8">
        <h2 className="text-heading-3 font-serif text-neutral-900 mb-1">Artworks</h2>
        <p className="text-sm text-neutral-600 mb-6">
          {collectionArtworks.length} {collectionArtworks.length === 1 ? 'artwork' : 'artworks'} in this collection
        </p>

        {artworkError && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-3 text-error-700 mb-4 text-sm">
            {artworkError}
          </div>
        )}

        {/* Current artworks */}
        {collectionArtworks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {collectionArtworks.map((artwork) => {
              const img = artwork.images?.[0];
              return (
                <div key={artwork.id} className="relative group border border-neutral-200 rounded-lg overflow-hidden">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.secureUrl || img.url}
                      alt={artwork.title}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-neutral-100" />
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium text-neutral-900 truncate">{artwork.title}</p>
                    <p className="text-xs text-neutral-500 truncate">{artwork.artist?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveArtwork(artwork.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-error-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${artwork.title}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 mb-8">No artworks yet. Search below to add some.</p>
        )}

        {/* Add artworks */}
        <div className="border-t border-neutral-200 pt-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Add Artworks</label>
          <div className="flex gap-2 mb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artworks by title or description..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchArtworks())}
            />
            <Button type="button" variant="outline" onClick={handleSearchArtworks} loading={searching}>
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((artwork) => {
                const img = artwork.images?.[0];
                const alreadyIn = currentArtworkIds.has(artwork.id);
                return (
                  <div key={artwork.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.secureUrl || img.url}
                        alt={artwork.title}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-neutral-100" />
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-neutral-900 truncate">{artwork.title}</p>
                      <p className="text-xs text-neutral-500 truncate mb-2">{artwork.artist?.name}</p>
                      <Button
                        type="button"
                        size="sm"
                        variant={alreadyIn ? 'outline' : 'primary'}
                        className="w-full"
                        disabled={alreadyIn}
                        onClick={() => handleAddArtwork(artwork.id)}
                      >
                        {alreadyIn ? 'Added' : (<><Plus className="w-3 h-3" /> Add</>)}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
