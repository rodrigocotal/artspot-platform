'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { ArtworkCard } from '@/components/artwork';
import { Button } from '@/components/ui';
import { apiClient, type Artist } from '@/lib/api-client';
import { ArrowLeft, MapPin, Globe, Mail, Star, CheckCircle2, Loader2 } from 'lucide-react';

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch artist details
  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getArtist(slug);
        setArtist(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artist');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtist();
    }
  }, [slug]);

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

  if (error || !artist) {
    return (
      <Section spacing="lg">
        <Container>
          <div className="text-center py-20">
            <p className="text-neutral-600 mb-4">{error || 'Artist not found'}</p>
            <Button onClick={() => router.push('/artists')}>
              Browse Artists
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const profileImageUrl = artist.profileImageUrl || '/placeholder-artist.jpg';
  const artworkCount = artist._count?.artworks || 0;

  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="sm" background="white" className="border-b border-neutral-200">
        <Container size="xl">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/artists" className="hover:text-neutral-900 transition-colors">Artists</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 truncate">{artist.name}</span>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container size="xl">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Artists
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Profile */}
            <div className="lg:col-span-1 space-y-8">
              {/* Profile Image */}
              <div className="relative overflow-hidden rounded-md bg-neutral-100 aspect-square border border-neutral-200">
                <Image
                  src={profileImageUrl}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />

                {/* Badges */}
                {(artist.featured || artist.verified) && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {artist.featured && (
                      <div
                        className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center"
                        title="Featured Artist"
                      >
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    {artist.verified && (
                      <div
                        className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center"
                        title="Verified Artist"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                {artist.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-neutral-700">{artist.location}</span>
                  </div>
                )}

                {artist.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-900 hover:text-primary-600 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {artist.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <a
                      href={`mailto:${artist.email}`}
                      className="text-sm text-neutral-900 hover:text-primary-600 transition-colors"
                    >
                      Contact Artist
                    </a>
                  </div>
                )}
              </div>

              {/* Artwork Count */}
              <div className="pt-6 border-t border-neutral-200">
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {artworkCount} {artworkCount === 1 ? 'artwork' : 'artworks'} available
                </p>
              </div>
            </div>

            {/* Right Column - Bio and Works */}
            <div className="lg:col-span-2 space-y-12">
              {/* Artist Name and Bio */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-3">
                  Artist
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 leading-[1.1]">
                  {artist.name}
                </h1>

                {artist.bio && (
                  <div className="mt-8 space-y-4">
                    <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                      Biography
                    </h2>
                    <p className="text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                      {artist.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Artist Statement */}
              {artist.statement && (
                <div className="pt-8 border-t border-neutral-200 space-y-4">
                  <h2 className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                    Artist Statement
                  </h2>
                  <p className="text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                    {artist.statement}
                  </p>
                </div>
              )}

              {/* Artworks */}
              {artist.artworks && artist.artworks.length > 0 && (
                <div className="pt-8 border-t border-neutral-200 space-y-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-500 mb-2">
                        Gallery
                      </p>
                      <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">
                        Selected Works
                      </h2>
                    </div>
                    {artworkCount > artist.artworks.length && (
                      <Link
                        href={`/artworks?artistId=${artist.id}`}
                        className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-neutral-900 font-medium transition-colors whitespace-nowrap"
                      >
                        View All ({artworkCount})
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {artist.artworks.map((artwork) => (
                      <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
