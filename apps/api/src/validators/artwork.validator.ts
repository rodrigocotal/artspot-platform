import { z } from 'zod';
import { ArtworkMedium, ArtworkStyle, AvailabilityStatus } from '@prisma/client';

/**
 * Validation schemas for artwork endpoints
 */

// Enums as Zod enums
const artworkMediumEnum = z.nativeEnum(ArtworkMedium);
const artworkStyleEnum = z.nativeEnum(ArtworkStyle);
const availabilityStatusEnum = z.nativeEnum(AvailabilityStatus);

// Create artwork schema
export const createArtworkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  artistId: z.string().cuid('Invalid artist ID'),
  medium: artworkMediumEnum,
  style: artworkStyleEnum.optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').default('USD'),
  status: availabilityStatusEnum.default('AVAILABLE'),
  featured: z.boolean().default(false),
  edition: z.string().optional(),
  materials: z.string().optional(),
  signature: z.string().optional(),
  certificate: z.boolean().default(false),
  framed: z.boolean().default(false),
  displayOrder: z.number().int().optional(),
});

// Update artwork schema (all fields optional except required ones)
export const updateArtworkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  artistId: z.string().cuid().optional(),
  medium: artworkMediumEnum.optional(),
  style: artworkStyleEnum.optional().nullable(),
  year: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional().nullable(),
  width: z.number().positive().optional().nullable(),
  height: z.number().positive().optional().nullable(),
  depth: z.number().positive().optional().nullable(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  status: availabilityStatusEnum.optional(),
  featured: z.boolean().optional(),
  edition: z.string().optional().nullable(),
  materials: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
  certificate: z.boolean().optional(),
  framed: z.boolean().optional(),
  displayOrder: z.number().int().optional().nullable(),
});

// Query parameters for listing artworks
export const listArtworksQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),

  // Filtering
  artistId: z.string().cuid().optional(),
  medium: artworkMediumEnum.optional(),
  style: artworkStyleEnum.optional(),
  status: availabilityStatusEnum.optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),

  // Search
  search: z.string().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'price', 'year', 'title', 'views', 'displayOrder']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateArtworkInput = z.infer<typeof createArtworkSchema>;
export type UpdateArtworkInput = z.infer<typeof updateArtworkSchema>;
export type ListArtworksQuery = z.infer<typeof listArtworksQuerySchema>;
