import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type {
  CreateCollectionInput,
  UpdateCollectionInput,
  AddArtworksToCollectionInput,
  ListCollectionsQuery,
} from '../validators/collection.validator';

/**
 * Collection service - Business logic for collection CRUD operations
 */

export class CollectionService {
  /**
   * List collections with filtering, pagination, and sorting
   */
  async listCollections(query: ListCollectionsQuery) {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CollectionWhereInput = {};

    // Apply filters
    if (filters.featured !== undefined) where.featured = filters.featured;

    // Text search (title, description)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query with pagination
    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          artworks: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
            include: {
              artwork: {
                include: {
                  images: {
                    where: { type: 'MAIN' },
                    take: 1,
                  },
                },
              },
            },
          },
          _count: {
            select: {
              artworks: true,
            },
          },
        },
      }),
      prisma.collection.count({ where }),
    ]);

    return {
      data: collections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get collection by ID or slug
   */
  async getCollection(identifier: string) {
    // Check if identifier is a CUID or slug
    const isCuid = identifier.startsWith('c');

    const collection = await prisma.collection.findUnique({
      where: isCuid ? { id: identifier } : { slug: identifier },
      include: {
        artworks: {
          orderBy: { displayOrder: 'asc' },
          include: {
            artwork: {
              include: {
                artist: true,
                images: {
                  where: { type: 'MAIN' },
                  take: 1,
                },
              },
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

    if (!collection) {
      throw new Error('Collection not found');
    }

    return collection;
  }

  /**
   * Get featured collections
   */
  async getFeaturedCollections(limit = 6) {
    return prisma.collection.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { displayOrder: 'asc' },
      include: {
        artworks: {
          orderBy: { displayOrder: 'asc' },
          take: 4,
          include: {
            artwork: {
              include: {
                images: {
                  where: { type: 'MAIN' },
                  take: 1,
                },
              },
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

  /**
   * Create new collection
   */
  async createCollection(data: CreateCollectionInput) {
    // Check slug uniqueness
    const existingCollection = await prisma.collection.findUnique({
      where: { slug: data.slug },
    });

    if (existingCollection) {
      throw new Error('Collection with this slug already exists');
    }

    return prisma.collection.create({
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
   * Update collection
   */
  async updateCollection(id: string, data: UpdateCollectionInput) {
    // Verify collection exists
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) {
      throw new Error('Collection not found');
    }

    // If slug is being updated, check uniqueness
    if (data.slug && data.slug !== collection.slug) {
      const existingCollection = await prisma.collection.findUnique({
        where: { slug: data.slug },
      });
      if (existingCollection) {
        throw new Error('Collection with this slug already exists');
      }
    }

    return prisma.collection.update({
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
   * Delete collection
   */
  async deleteCollection(id: string) {
    // Verify collection exists
    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // CollectionArtwork entries will be cascade deleted
    return prisma.collection.delete({ where: { id } });
  }

  /**
   * Add artworks to collection
   */
  async addArtworksToCollection(
    collectionId: string,
    data: AddArtworksToCollectionInput
  ) {
    // Verify collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Get current max displayOrder
    const maxOrder = await prisma.collectionArtwork.aggregate({
      where: { collectionId },
      _max: { displayOrder: true },
    });

    const startOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    // Create collection artwork entries
    const collectionArtworks = data.artworkIds.map((artworkId, index) => ({
      collectionId,
      artworkId,
      displayOrder: startOrder + index,
    }));

    // Use createMany with skipDuplicates to avoid errors if artwork is already in collection
    await prisma.collectionArtwork.createMany({
      data: collectionArtworks,
      skipDuplicates: true,
    });

    return this.getCollection(collectionId);
  }

  /**
   * Remove artwork from collection
   */
  async removeArtworkFromCollection(collectionId: string, artworkId: string) {
    // Verify collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Delete the collection artwork entry
    const deleted = await prisma.collectionArtwork.deleteMany({
      where: {
        collectionId,
        artworkId,
      },
    });

    if (deleted.count === 0) {
      throw new Error('Artwork not found in collection');
    }

    return this.getCollection(collectionId);
  }

  /**
   * Reorder artworks in collection
   */
  async reorderArtworks(
    collectionId: string,
    artworkOrders: { artworkId: string; displayOrder: number }[]
  ) {
    // Verify collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new Error('Collection not found');
    }

    // Update display orders in a transaction
    await prisma.$transaction(
      artworkOrders.map(({ artworkId, displayOrder }) =>
        prisma.collectionArtwork.updateMany({
          where: {
            collectionId,
            artworkId,
          },
          data: { displayOrder },
        })
      )
    );

    return this.getCollection(collectionId);
  }
}

export const collectionService = new CollectionService();
