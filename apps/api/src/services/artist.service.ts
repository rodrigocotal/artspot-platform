import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { CreateArtistInput, UpdateArtistInput, ListArtistsQuery } from '../validators/artist.validator';

/**
 * Artist service - Business logic for artist CRUD operations
 */

export class ArtistService {
  /**
   * List artists with filtering, pagination, and sorting
   */
  async listArtists(query: ListArtistsQuery) {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ArtistWhereInput = {};

    // Apply filters
    if (filters.featured !== undefined) where.featured = filters.featured;
    if (filters.verified !== undefined) where.verified = filters.verified;

    // Text search (name, bio, location)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query with pagination
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              artworks: true,
            },
          },
        },
      }),
      prisma.artist.count({ where }),
    ]);

    return {
      data: artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get artist by ID or slug
   */
  async getArtist(identifier: string) {
    // Check if identifier is a CUID or slug
    const isCuid = identifier.startsWith('c');

    const artist = await prisma.artist.findUnique({
      where: isCuid ? { id: identifier } : { slug: identifier },
      include: {
        artworks: {
          where: { status: 'AVAILABLE' },
          take: 12,
          orderBy: { createdAt: 'desc' },
          include: {
            images: {
              where: { type: 'MAIN' },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            artworks: true,
          },
        },
      },
    });

    if (!artist) {
      throw new Error('Artist not found');
    }

    return artist;
  }

  /**
   * Create new artist
   */
  async createArtist(data: CreateArtistInput) {
    // Check slug uniqueness
    const existingArtist = await prisma.artist.findUnique({
      where: { slug: data.slug },
    });

    if (existingArtist) {
      throw new Error('Artist with this slug already exists');
    }

    return prisma.artist.create({
      data,
      include: {
        _count: {
          select: {
            artworks: true,
          },
        },
      },
    });
  }

  /**
   * Update artist
   */
  async updateArtist(id: string, data: UpdateArtistInput) {
    // Verify artist exists
    const artist = await prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new Error('Artist not found');
    }

    // If slug is being updated, check uniqueness
    if (data.slug && data.slug !== artist.slug) {
      const existingArtist = await prisma.artist.findUnique({
        where: { slug: data.slug },
      });
      if (existingArtist) {
        throw new Error('Artist with this slug already exists');
      }
    }

    return prisma.artist.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            artworks: true,
          },
        },
      },
    });
  }

  /**
   * Delete artist
   */
  async deleteArtist(id: string) {
    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            artworks: true,
          },
        },
      },
    });

    if (!artist) {
      throw new Error('Artist not found');
    }

    // Check if artist has artworks
    if (artist._count.artworks > 0) {
      throw new Error('Cannot delete artist with existing artworks');
    }

    return prisma.artist.delete({ where: { id } });
  }

  /**
   * Get featured artists
   */
  async getFeaturedArtists(limit = 6) {
    return prisma.artist.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { displayOrder: 'asc' },
      include: {
        artworks: {
          where: { status: 'AVAILABLE' },
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            images: {
              where: { type: 'MAIN' },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            artworks: true,
          },
        },
      },
    });
  }
}

export const artistService = new ArtistService();
