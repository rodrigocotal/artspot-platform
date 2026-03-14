import { z } from 'zod';

export const listAdminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
  search: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['CANCELLED', 'REFUNDED']),
});

export const listAdminUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  role: z.enum(['COLLECTOR', 'GALLERY_STAFF', 'ADMIN']).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['COLLECTOR', 'GALLERY_STAFF', 'ADMIN']),
});

export type ListAdminOrdersQuery = z.infer<typeof listAdminOrdersQuerySchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ListAdminUsersQuery = z.infer<typeof listAdminUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
