import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
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

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: artwork.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(artwork.price));

  return (
    <Link
      href={`/artworks/${artwork.slug}`}
      className={cn('group block', className)}
    >
      <article className="space-y-3">
        {/* Image container with aspect ratio */}
        <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[3/4]">
          <Image
            src={imageUrl}
            alt={artwork.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {/* Status badge */}
          {artwork.status !== 'AVAILABLE' && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-900/90 text-white text-xs font-medium">
              {artwork.status === 'SOLD' ? 'Sold' : artwork.status}
            </div>
          )}

          {/* Favorite button (placeholder - needs auth) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement favorite functionality
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            aria-label="Add to favorites"
          >
            <Heart className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* Artwork details */}
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {artwork.title}
          </h3>

          <p className="text-sm text-neutral-600 line-clamp-1">
            {artwork.artist.name}
            {artwork.year && `, ${artwork.year}`}
          </p>

          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-medium text-neutral-900 tabular-nums">
              {formattedPrice}
            </p>

            {artwork.medium && (
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                {artwork.medium.replace('_', ' ')}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
