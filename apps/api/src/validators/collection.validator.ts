import { z } from 'zod';

/**
 * Validation schemas for collection endpoints
 */

// Create collection schema
export const createCollectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().url('Invalid URL').optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().optional().nullable(),
});

// Update collection schema (all fields optional)
export const updateCollectionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional().nullable(),
});

// Add artworks to collection schema
export const addArtworksToCollectionSchema = z.object({
  artworkIds: z.array(z.string().cuid()).min(1, 'At least one artwork ID is required'),
});

// Remove artwork from collection schema
export const removeArtworkFromCollectionSchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
});

// Query parameters for listing collections
export const listCollectionsQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),

  // Filtering
  featured: z.coerce.boolean().optional(),

  // Search
  search: z.string().optional(),

  // Sorting
  sortBy: z.enum(['title', 'createdAt', 'displayOrder']).default('displayOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type AddArtworksToCollectionInput = z.infer<typeof addArtworksToCollectionSchema>;
export type RemoveArtworkFromCollectionInput = z.infer<typeof removeArtworkFromCollectionSchema>;
export type ListCollectionsQuery = z.infer<typeof listCollectionsQuerySchema>;
