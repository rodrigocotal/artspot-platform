'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorite } from '@/hooks/use-favorite';
import type { Artwork } from '@/lib/api-client';

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
}

/**
 * Artwork card for grid/masonry layouts
 * Shows image, title, artist, price with hover effects
 */
export function ArtworkCard({ artwork, className, priority = false }: ArtworkCardProps) {
  const mainImage = artwork.images[0];
  const imageUrl = mainImage?.secureUrl || mainImage?.url || '/placeholder-artwork.jpg';
  const { favorited, isPending, toggle } = useFavorite({
    artworkId: artwork.id,
    initialFavorited: artwork.isFavorited ?? false,
  });

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: artwork.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(artwork.price));

  // Title + year, e.g. "Frida, 2015"
  const titleLine = artwork.year ? `${artwork.title}, ${artwork.year}` : artwork.title;

  // Medium, e.g. "Mixed Media on Wood"
  const mediumLine = artwork.medium ? artwork.medium.replace(/_/g, ' ') : null;

  // Dimensions from width × height (× depth), e.g. "48 × 28 In."
  const dimensionParts = [artwork.width, artwork.height, artwork.depth].filter(
    (value): value is string => Boolean(value)
  );
  const dimensionLine =
    artwork.width && artwork.height ? `${dimensionParts.join(' × ')} In.` : null;

  const isAvailable = artwork.status === 'AVAILABLE';
  const statusLabel = artwork.status.replace(/_/g, ' ');

  return (
    <Link
      href={`/artworks/${artwork.slug}`}
      className={cn('group block', className)}
      data-testid="artwork-card"
    >
      <article>
        {/* Image container with aspect ratio */}
        <div className="relative overflow-hidden rounded-md bg-neutral-100 aspect-[3/4]">
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            priority={priority}
          />

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            disabled={isPending}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              'bg-white/85 backdrop-blur-sm hover:bg-white',
              favorited
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
            )}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'w-4 h-4 transition-colors',
                  favorited ? 'text-primary-600 fill-primary-600' : 'text-neutral-700'
                )}
              />
            )}
          </button>
        </div>

        {/* Artwork details */}
        <div className="mt-4 space-y-1">
          {/* Artist + status */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-base sm:text-lg font-medium text-neutral-900 line-clamp-1">
              {artwork.artist.name}
            </h3>

            <span className="mt-1 flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isAvailable ? 'bg-green-600' : 'bg-neutral-400'
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-[10px] uppercase tracking-wide',
                  isAvailable ? 'text-neutral-500' : 'text-neutral-400'
                )}
              >
                {statusLabel}
              </span>
            </span>
          </div>

          {/* Title + year */}
          <p className="font-serif italic text-sm text-neutral-600 line-clamp-1">
            {titleLine}
          </p>

          {/* Medium */}
          {mediumLine && <p className="text-xs text-neutral-500">{mediumLine}</p>}

          {/* Dimensions */}
          {dimensionLine && (
            <p className="text-xs text-neutral-400 tabular-nums">{dimensionLine}</p>
          )}

          {/* Price */}
          <p className="pt-1 text-sm text-neutral-900 tabular-nums">{formattedPrice}</p>
        </div>
      </article>
    </Link>
  );
}
