import { z } from 'zod';

export const createContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
});

export const updateContactMessageSchema = z.object({
  status: z.enum(['NEW', 'READ', 'ARCHIVED']),
});

export const listContactMessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['NEW', 'READ', 'ARCHIVED']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
export type ListContactMessagesQuery = z.infer<typeof listContactMessagesQuerySchema>;
