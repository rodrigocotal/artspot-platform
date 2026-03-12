'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork';
import { Button } from '@/components/ui';
import { apiClient, type Collection } from '@/lib/api-client';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collection details
  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getCollection(slug);
        setCollection(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollection();
    }
  }, [slug]);

  if (loading) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        </Container>
      </Section>
    );
  }

  if (error || !collection) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">{error || 'Collection not found'}</p>
            <Button onClick={() => router.push('/collections')}>
              Browse Collections
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  // Use cover image if available, otherwise use first artwork's main image
  const coverImage = collection.coverImageUrl ||
    collection.artworks?.[0]?.artwork?.images?.[0]?.secureUrl ||
    collection.artworks?.[0]?.artwork?.images?.[0]?.url;

  const artworkCount = collection._count?.artworks || 0;
  const artworks = collection.artworks?.map((item) => item.artwork) || [];

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="white" className="border-b border-neutral-200">
        <Container size="xl">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-neutral-900">Collections</Link>
            <span>/</span>
            <span className="text-neutral-900">{collection.title}</span>
          </div>
        </Container>
      </Section>

      {/* Hero Section */}
      {coverImage && (
        <Section spacing="md" background="neutral">
          <Container size="xl">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[21/9]">
              <Image
                src={coverImage}
                alt={collection.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />

              {/* Collection info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-display font-serif">{collection.title}</h1>
                      {collection.featured && (
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <Star className="w-5 h-5 fill-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-white/90 max-w-3xl">
                      {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="xl">
          {!coverImage && (
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collections
            </Link>
          )}

          {!coverImage && (
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-4">
                <h1 className="text-display font-serif text-neutral-900 flex-1">
                  {collection.title}
                </h1>
                {collection.featured && (
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                )}
              </div>
              <p className="text-lg text-neutral-600">
                {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
              </p>
            </div>
          )}

          {/* Description */}
          {collection.description && (
            <div className="max-w-3xl mb-12">
              <p className="text-body-lg text-neutral-700 leading-relaxed whitespace-pre-line">
                {collection.description}
              </p>
            </div>
          )}

          {/* Artworks Grid */}
          {artworks.length > 0 ? (
            <div>
              <h2 className="text-heading-2 font-serif text-neutral-900 mb-8">
                Artworks in This Collection
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {artworks.map((artwork, index) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    priority={index < 8}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-600">
                This collection does not have any artworks yet.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Back to Collections */}
      <Section spacing="sm" background="neutral">
        <Container size="xl">
          <div className="text-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Collections
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
