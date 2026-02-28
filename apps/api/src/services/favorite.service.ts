import { prisma } from '../config/database';
import type { ListFavoritesQuery } from '../validators/favorite.validator';

export class FavoriteService {
  /**
   * Toggle favorite — add if not favorited, remove if already favorited.
   * Returns the new favorited state.
   */
  async toggleFavorite(userId: string, artworkId: string) {
    // Verify artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      select: { id: true },
    });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    const favorite = await prisma.favorite.create({
      data: { userId, artworkId },
    });

    return { favorited: true, id: favorite.id };
  }

  /**
   * List a user's favorited artworks with pagination.
   */
  async listUserFavorites(userId: string, query: ListFavoritesQuery) {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          artwork: {
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
                select: { favorites: true },
              },
            },
          },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Remove a specific favorite by its ID (must belong to the user).
   */
  async removeFavorite(userId: string, favoriteId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    if (favorite.userId !== userId) {
      throw new Error('Forbidden');
    }

    await prisma.favorite.delete({ where: { id: favoriteId } });
  }

  /**
   * Check whether a user has favorited a specific artwork.
   */
  async isFavorited(userId: string, artworkId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_artworkId: { userId, artworkId } },
      select: { id: true },
    });
    return !!favorite;
  }

  /**
   * Batch-check favorites for a list of artwork IDs (used to annotate artwork lists).
   */
  async batchCheckFavorites(userId: string, artworkIds: string[]): Promise<Set<string>> {
    const favorites = await prisma.favorite.findMany({
      where: { userId, artworkId: { in: artworkIds } },
      select: { artworkId: true },
    });
    return new Set(favorites.map((f) => f.artworkId));
  }
}

export const favoriteService = new FavoriteService();
