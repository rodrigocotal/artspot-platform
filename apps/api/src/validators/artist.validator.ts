import { z } from 'zod';

/**
 * Validation schemas for artist endpoints
 */

// Create artist schema
export const createArtistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  bio: z.string().optional(),
  statement: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  profileImageUrl: z.string().url('Invalid URL').optional().nullable(),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
  displayOrder: z.number().int().optional().nullable(),
});

// Update artist schema (all fields optional)
export const updateArtistSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  bio: z.string().optional().nullable(),
  statement: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  profileImageUrl: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  displayOrder: z.number().int().optional().nullable(),
});

// Query parameters for listing artists
export const listArtistsQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),

  // Filtering
  featured: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),

  // Search
  search: z.string().optional(),

  // Sorting
  sortBy: z.enum(['name', 'createdAt', 'displayOrder']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type CreateArtistInput = z.infer<typeof createArtistSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
export type ListArtistsQuery = z.infer<typeof listArtistsQuerySchema>;
