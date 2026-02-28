import { z } from 'zod';

export const listArticlesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z
    .enum(['ARTIST_SPOTLIGHT', 'EXHIBITION', 'BEHIND_THE_SCENES', 'NEWS', 'GUIDE'])
    .optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sortBy: z.enum(['publishedDate', 'createdAt', 'title']).default('publishedDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
