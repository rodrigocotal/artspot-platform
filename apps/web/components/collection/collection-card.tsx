import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Collection } from '@/lib/api-client';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
  priority?: boolean;
}

/**
 * Collection card for grid layouts
 * Shows cover image, title, description excerpt, and artwork count
 */
export function CollectionCard({ collection, className, priority = false }: CollectionCardProps) {
  // Use cover image if available, otherwise use first artwork's main image
  const coverImage = collection.coverImageUrl ||
    collection.artworks?.[0]?.artwork?.images?.[0]?.secureUrl ||
    collection.artworks?.[0]?.artwork?.images?.[0]?.url ||
    '/placeholder-collection.jpg';

  const artworkCount = collection._count?.artworks || 0;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn('group block', className)}
    >
      <article className="space-y-4">
        {/* Cover image */}
        <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/3]">
          <Image
            src={coverImage}
            alt={collection.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {/* Featured badge */}
          {collection.featured && (
            <div className="absolute top-3 right-3">
              <div
                className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
                title="Featured Collection"
              >
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          )}

          {/* Artwork count badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-neutral-900/90 text-white text-xs font-medium">
            {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
          </div>
        </div>

        {/* Collection details */}
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {collection.title}
          </h3>

          {/* Description excerpt */}
          {collection.description && (
            <p className="text-sm text-neutral-600 line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
