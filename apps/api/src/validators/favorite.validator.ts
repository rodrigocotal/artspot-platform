import { z } from 'zod';

export const addFavoriteSchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
});

export const listFavoritesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type ListFavoritesQuery = z.infer<typeof listFavoritesQuerySchema>;
