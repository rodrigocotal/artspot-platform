import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let seedCounter = 0;

function uniqueSlug(prefix: string) {
  seedCounter++;
  return `${prefix}-${seedCounter}-${Date.now()}`;
}

export async function createTestArtist(overrides: Partial<{
  name: string;
  slug: string;
  bio: string;
  location: string;
  featured: boolean;
}> = {}) {
  return prisma.artist.create({
    data: {
      name: overrides.name || 'Test Artist',
      slug: overrides.slug || uniqueSlug('test-artist'),
      bio: overrides.bio || 'A test artist biography',
      location: overrides.location || 'Test City',
      featured: overrides.featured ?? false,
    },
  });
}

export async function createTestArtwork(
  artistId: string,
  overrides: Partial<{
    title: string;
    slug: string;
    description: string;
    medium: string;
    style: string;
    price: number;
    status: string;
    featured: boolean;
    year: number;
  }> = {}
) {
  return prisma.artwork.create({
    data: {
      title: overrides.title || 'Test Artwork',
      slug: overrides.slug || uniqueSlug('test-artwork'),
      description: overrides.description || 'A test artwork description',
      artistId,
      medium: (overrides.medium as any) || 'PAINTING',
      style: (overrides.style as any) || 'ABSTRACT',
      price: overrides.price || 1000,
      status: (overrides.status as any) || 'AVAILABLE',
      featured: overrides.featured ?? false,
      year: overrides.year || 2024,
      images: {
        create: {
          publicId: uniqueSlug('img'),
          url: 'https://example.com/image.jpg',
          secureUrl: 'https://example.com/image.jpg',
          width: 800,
          height: 600,
          format: 'jpg',
          size: 50000,
          type: 'MAIN',
        },
      },
    },
    include: {
      images: true,
      artist: true,
    },
  });
}
