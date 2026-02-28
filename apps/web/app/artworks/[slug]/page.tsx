'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { ImageZoom } from '@/components/ui';
import { ArtworkCard, InquiryForm } from '@/components/artwork';
import { Button } from '@/components/ui';
import { apiClient, type Artwork } from '@/lib/api-client';
import { useFavorite } from '@/hooks/use-favorite';
import { ArrowLeft, Heart, Share2, Ruler, Calendar, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // Fetch artwork details — set access token so API returns isFavorited
  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);

      if (session?.accessToken) {
        apiClient.setAccessToken(session.accessToken);
      }

      try {
        const response = await apiClient.getArtwork(slug);
        setArtwork(response.data);

        // Fetch related artworks
        const relatedResponse = await apiClient.getRelatedArtworks(response.data.id, 4);
        setRelatedArtworks(relatedResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artwork');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtwork();
    }
  }, [slug, session?.accessToken]);

  // Format price
  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  // Format dimensions
  const formatDimensions = (width: string | null, height: string | null, depth: string | null) => {
    const parts = [];
    if (height) parts.push(`H ${parseFloat(height).toFixed(1)} cm`);
    if (width) parts.push(`W ${parseFloat(width).toFixed(1)} cm`);
    if (depth) parts.push(`D ${parseFloat(depth).toFixed(1)} cm`);
    return parts.join(' × ');
  };

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

  if (error || !artwork) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">{error || 'Artwork not found'}</p>
            <Button onClick={() => router.push('/artworks')}>
              Browse Artworks
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const selectedImage = artwork.images[selectedImageIndex] || artwork.images[0];
  const isAvailable = artwork.status === 'AVAILABLE';
  const favoriteCount = artwork._count?.favorites ?? 0;

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="white" className="border-b border-neutral-200">
        <Container size="xl">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <span>/</span>
            <Link href="/artworks" className="hover:text-neutral-900">Artworks</Link>
            <span>/</span>
            <span className="text-neutral-900">{artwork.title}</span>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="xl">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Artworks
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              {selectedImage && (
                <ImageZoom
                  src={selectedImage.secureUrl || selectedImage.url}
                  alt={artwork.title}
                  width={selectedImage.width}
                  height={selectedImage.height}
                  maxZoom={3}
                  priority
                />
              )}

              {/* Thumbnail Gallery */}
              {artwork.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {artwork.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                        selectedImageIndex === index
                          ? 'border-primary-500'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <img
                        src={image.secureUrl || image.url}
                        alt={`${artwork.title} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Status Badge */}
              {!isAvailable && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-300">
                  <span className="text-sm font-medium text-neutral-700">
                    {artwork.status === 'SOLD' ? 'Sold' : artwork.status.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Title and Artist */}
              <div>
                <h1 className="text-display font-serif text-neutral-900 mb-2">
                  {artwork.title}
                </h1>
                <Link
                  href={`/artists/${artwork.artist.slug}`}
                  className="text-xl text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {artwork.artist.name}
                </Link>
                {artwork.year && (
                  <p className="text-lg text-neutral-500 mt-1">{artwork.year}</p>
                )}
              </div>

              {/* Price */}
              <div className="py-6 border-y border-neutral-200">
                <p className="text-3xl font-serif text-neutral-900 tabular-nums">
                  {formatPrice(artwork.price, artwork.currency)}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {(artwork.width || artwork.height) && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Dimensions</p>
                      <p className="text-sm text-neutral-900">{formatDimensions(artwork.width, artwork.height, artwork.depth)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Medium</p>
                    <p className="text-sm text-neutral-900">{artwork.medium.replace('_', ' ')}</p>
                  </div>
                </div>

                {artwork.style && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Style</p>
                      <p className="text-sm text-neutral-900">{artwork.style.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}

                {artwork.certificate && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Certificate</p>
                      <p className="text-sm text-neutral-900">Included</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isAvailable ? (
                  <>
                    <Button
                      size="lg"
                      className="flex-1"
                      variant={showInquiryForm ? 'outline' : 'primary'}
                      onClick={() => setShowInquiryForm(!showInquiryForm)}
                    >
                      {showInquiryForm ? 'Close' : 'Inquire'}
                    </Button>
                    <FavoriteButton
                      artworkId={artwork.id}
                      initialFavorited={artwork.isFavorited ?? false}
                      count={favoriteCount}
                    />
                  </>
                ) : (
                  <Button size="lg" variant="outline" className="flex-1" disabled>
                    Not Available
                  </Button>
                )}
                <Button size="lg" variant="ghost">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Inquiry Form */}
              {showInquiryForm && isAvailable && (
                <InquiryForm artworkId={artwork.id} />
              )}

              {/* Description */}
              {artwork.description && (
                <div className="pt-6 border-t border-neutral-200">
                  <h2 className="text-heading-4 font-serif text-neutral-900 mb-3">About This Work</h2>
                  <p className="text-body text-neutral-600 leading-relaxed whitespace-pre-line">
                    {artwork.description}
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="pt-6 border-t border-neutral-200 space-y-3 text-sm">
                {artwork.edition && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Edition</span>
                    <span className="text-neutral-900">{artwork.edition}</span>
                  </div>
                )}
                {artwork.materials && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Materials</span>
                    <span className="text-neutral-900">{artwork.materials}</span>
                  </div>
                )}
                {artwork.signature && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Signature</span>
                    <span className="text-neutral-900">{artwork.signature}</span>
                  </div>
                )}
                {artwork.framed && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Framing</span>
                    <span className="text-neutral-900">Framed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <Section spacing="lg" background="neutral">
          <Container size="xl">
            <h2 className="text-heading-2 font-serif text-neutral-900 mb-8">
              Related Artworks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

function FavoriteButton({
  artworkId,
  initialFavorited,
  count,
}: {
  artworkId: string;
  initialFavorited: boolean;
  count: number;
}) {
  const { favorited, isPending, toggle } = useFavorite({ artworkId, initialFavorited });

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={toggle}
      disabled={isPending}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            'w-5 h-5 transition-colors',
            favorited ? 'text-primary-600 fill-primary-600' : ''
          )}
        />
      )}
      {count > 0 && <span className="text-sm tabular-nums">{count}</span>}
    </Button>
  );
}
