import { z } from 'zod';

export const createInquirySchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const respondInquirySchema = z
  .object({
    response: z.string().min(1).max(5000).optional(),
    status: z.enum(['RESPONDED', 'CLOSED']).optional(),
  })
  .refine((data) => data.response || data.status, {
    message: 'At least one of response or status is required',
  });

export const listInquiriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['PENDING', 'RESPONDED', 'CLOSED']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type RespondInquiryInput = z.infer<typeof respondInquirySchema>;
export type ListInquiriesQuery = z.infer<typeof listInquiriesQuerySchema>;
