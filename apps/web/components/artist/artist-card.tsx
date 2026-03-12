import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artist } from '@/lib/api-client';

interface ArtistCardProps {
  artist: Artist;
  className?: string;
  priority?: boolean;
}

/**
 * Artist card for grid layouts
 * Shows profile image, name, location, bio excerpt, and artwork count
 */
export function ArtistCard({ artist, className, priority = false }: ArtistCardProps) {
  const profileImageUrl = artist.profileImageUrl || '/placeholder-artist.jpg';
  const artworkCount = artist._count?.artworks || 0;

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className={cn('group block', className)}
    >
      <article className="space-y-4">
        {/* Profile image - circular for artists */}
        <div className="relative overflow-hidden rounded-full bg-neutral-100 aspect-square">
          <Image
            src={profileImageUrl}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />

          {/* Badges */}
          {(artist.featured || artist.verified) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {artist.featured && (
                <div
                  className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center"
                  title="Featured Artist"
                >
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              )}
              {artist.verified && (
                <div
                  className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center"
                  title="Verified Artist"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Artist details */}
        <div className="space-y-2 text-center">
          <h3 className="font-serif text-xl text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {artist.name}
          </h3>

          {/* Location */}
          {artist.location && (
            <div className="flex items-center justify-center gap-1 text-sm text-neutral-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{artist.location}</span>
            </div>
          )}

          {/* Bio excerpt */}
          {artist.bio && (
            <p className="text-sm text-neutral-600 line-clamp-2">
              {artist.bio}
            </p>
          )}

          {/* Artwork count */}
          <p className="text-xs text-neutral-500 pt-1">
            {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'}
          </p>
        </div>
      </article>
    </Link>
  );
}
