'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { ImageZoom } from '@/components/ui';
import { ArtworkCard, InquiryForm } from '@/components/artwork';
import { AddToCartButton } from '@/components/artwork/add-to-cart-button';
import { Button } from '@/components/ui';
import { apiClient, type Artwork } from '@/lib/api-client';
import { formatTaxonomyLabel } from '@/lib/artwork-taxonomy';
import { useFavorite } from '@/hooks/use-favorite';
import { ArrowLeft, Heart, Share2, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [shareConfirm, setShareConfirm] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = artwork?.title ?? 'Artwork';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled share — ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareConfirm(true);
      setTimeout(() => setShareConfirm(false), 2000);
    }
  };

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
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
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
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/artworks" className="hover:text-neutral-900 transition-colors">Artworks</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 truncate">{artwork.title}</span>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="xl">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Artworks
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
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
                        'relative aspect-square rounded-md overflow-hidden border transition-colors',
                        selectedImageIndex === index
                          ? 'border-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-400'
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
            <div className="lg:pl-6 space-y-10">
              {/* Availability eyebrow */}
              <div className="flex items-center gap-2">
                {isAvailable ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden="true" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-green-700">
                      Available
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                    {artwork.status === 'SOLD' ? 'Sold' : artwork.status.replace('_', ' ')}
                  </span>
                )}
              </div>

              {/* Title and Artist — gallery label */}
              <div>
                <h1 className="font-serif italic text-4xl md:text-5xl leading-[1.1] text-neutral-900">
                  {artwork.title}
                </h1>
                <p className="mt-4 font-serif text-lg text-neutral-600">
                  <Link
                    href={`/artists/${artwork.artist.slug}`}
                    className="text-neutral-800 hover:text-primary-600 transition-colors"
                  >
                    {artwork.artist.name}
                  </Link>
                  {artwork.year && <span className="text-neutral-500">{`, ${artwork.year}`}</span>}
                </p>
              </div>

              {/* Price — gallery label */}
              <div className="border-y border-neutral-200 py-6">
                <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-2">
                  Price
                </p>
                <p className="text-3xl font-serif text-neutral-900 tabular-nums">
                  {formatPrice(artwork.price, artwork.currency)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isAvailable ? (
                  <>
                    {artwork.purchaseMode === 'DIRECT' && (
                      <AddToCartButton artworkId={artwork.id} className="flex-1" />
                    )}
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
                    {artwork.status === 'RESERVED' ? 'Reserved' : 'Not Available'}
                  </Button>
                )}
                <Button size="lg" variant="ghost" onClick={handleShare} title="Share artwork">
                  {shareConfirm ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Inquiry Form */}
              {showInquiryForm && isAvailable && (
                <InquiryForm artworkId={artwork.id} />
              )}

              {/* Details — editorial spec list */}
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-1">
                  Details
                </h2>
                <dl className="border-t border-neutral-200">
                  <DetailRow label="Medium" value={artwork.medium.replace('_', ' ')} />
                  {artwork.category && (
                    <DetailRow label="Category" value={formatTaxonomyLabel(artwork.category)} />
                  )}
                  {(artwork.width || artwork.height) && (
                    <DetailRow
                      label="Dimensions"
                      value={formatDimensions(artwork.width, artwork.height, artwork.depth)}
                    />
                  )}
                  {artwork.style && <DetailRow label="Style" value={artwork.style.replace('_', ' ')} />}
                  {artwork.year && <DetailRow label="Year" value={String(artwork.year)} />}
                  {artwork.edition && <DetailRow label="Edition" value={artwork.edition} />}
                  {artwork.materials && <DetailRow label="Materials" value={artwork.materials} />}
                  {artwork.signature && <DetailRow label="Signature" value={artwork.signature} />}
                  {artwork.framed && <DetailRow label="Framing" value="Framed" />}
                  {artwork.certificate && (
                    <DetailRow
                      label="Certificate"
                      value={
                        <span className="inline-flex items-center gap-1.5 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Included
                        </span>
                      }
                    />
                  )}
                </dl>
              </div>

              {/* Description */}
              {artwork.description && (
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-4">
                    About the Work
                  </h2>
                  <p className="text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                    {artwork.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <Section spacing="lg" background="neutral">
          <Container size="xl">
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-3">
              Gallery
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-10">
              Related Works
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

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3 border-b border-neutral-200">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 shrink-0">{label}</dt>
      <dd className="text-sm text-neutral-900 text-right">{value}</dd>
    </div>
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
