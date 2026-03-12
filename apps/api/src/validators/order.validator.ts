import { z } from 'zod';

export const createCheckoutSchema = z.object({
  // No body required — checkout is always from the user's cart
});

export const createPaymentLinkSchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
  inquiryId: z.string().cuid('Invalid inquiry ID').optional(),
  customerEmail: z.string().email('Invalid email'),
  customerName: z.string().min(1, 'Customer name is required').optional(),
});

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
});

export type CreatePaymentLinkInput = z.infer<typeof createPaymentLinkSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;
