import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { CreateArtworkInput, UpdateArtworkInput, ListArtworksQuery } from '../validators/artwork.validator';

/**
 * Artwork service - Business logic for artwork CRUD operations
 */

export class ArtworkService {
  /**
   * List artworks with filtering, pagination, and sorting
   */
  async listArtworks(query: ListArtworksQuery) {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ArtworkWhereInput = {};

    // Apply filters
    if (filters.artistId) where.artistId = filters.artistId;
    if (filters.medium) where.medium = filters.medium;
    if (filters.style) where.style = filters.style;
    if (filters.status) where.status = filters.status;
    if (filters.featured !== undefined) where.featured = filters.featured;

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    // Year range
    if (filters.minYear !== undefined || filters.maxYear !== undefined) {
      where.year = {};
      if (filters.minYear !== undefined) where.year.gte = filters.minYear;
      if (filters.maxYear !== undefined) where.year.lte = filters.maxYear;
    }

    // Text search (title or description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query with pagination
    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              slug: true,
              profileImageUrl: true,
            },
          },
          images: {
            where: { type: 'MAIN' },
            take: 1,
            orderBy: { displayOrder: 'asc' },
          },
          _count: {
            select: {
              favorites: true,
              inquiries: true,
            },
          },
        },
      }),
      prisma.artwork.count({ where }),
    ]);

    return {
      data: artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get artwork by ID or slug
   */
  async getArtwork(identifier: string) {
    // Check if identifier is a CUID or slug
    const isCuid = identifier.startsWith('c');

    const artwork = await prisma.artwork.findUnique({
      where: isCuid ? { id: identifier } : { slug: identifier },
      include: {
        artist: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        collectionItems: {
          include: {
            collection: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          },
        },
      },
    });

    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // Increment view count
    await prisma.artwork.update({
      where: { id: artwork.id },
      data: { views: { increment: 1 } },
    });

    return artwork;
  }

  /**
   * Create new artwork
   */
  async createArtwork(data: CreateArtworkInput) {
    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: data.artistId },
    });

    if (!artist) {
      throw new Error('Artist not found');
    }

    // Check slug uniqueness
    const existingArtwork = await prisma.artwork.findUnique({
      where: { slug: data.slug },
    });

    if (existingArtwork) {
      throw new Error('Artwork with this slug already exists');
    }

    return prisma.artwork.create({
      data,
      include: {
        artist: true,
        images: true,
      },
    });
  }

  /**
   * Update artwork
   */
  async updateArtwork(id: string, data: UpdateArtworkInput) {
    // Verify artwork exists
    const artwork = await prisma.artwork.findUnique({ where: { id } });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // If artistId is being updated, verify new artist exists
    if (data.artistId && data.artistId !== artwork.artistId) {
      const artist = await prisma.artist.findUnique({
        where: { id: data.artistId },
      });
      if (!artist) {
        throw new Error('Artist not found');
      }
    }

    // If slug is being updated, check uniqueness
    if (data.slug && data.slug !== artwork.slug) {
      const existingArtwork = await prisma.artwork.findUnique({
        where: { slug: data.slug },
      });
      if (existingArtwork) {
        throw new Error('Artwork with this slug already exists');
      }
    }

    return prisma.artwork.update({
      where: { id },
      data,
      include: {
        artist: true,
        images: true,
      },
    });
  }

  /**
   * Delete artwork
   */
  async deleteArtwork(id: string) {
    // Verify artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // TODO: Delete images from Cloudinary
    // for (const image of artwork.images) {
    //   await deleteImage(image.publicId);
    // }

    return prisma.artwork.delete({ where: { id } });
  }

  /**
   * Get related artworks (same artist or medium)
   */
  async getRelatedArtworks(artworkId: string, limit = 6) {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      select: { artistId: true, medium: true },
    });

    if (!artwork) {
      throw new Error('Artwork not found');
    }

    return prisma.artwork.findMany({
      where: {
        id: { not: artworkId },
        status: 'AVAILABLE',
        OR: [
          { artistId: artwork.artistId },
          { medium: artwork.medium },
        ],
      },
      take: limit,
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { type: 'MAIN' },
          take: 1,
        },
      },
    });
  }
}

export const artworkService = new ArtworkService();
