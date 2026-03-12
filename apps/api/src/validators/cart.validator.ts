import { z } from 'zod';

export const addToCartSchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
});

export const removeFromCartSchema = z.object({
  artworkId: z.string().cuid('Invalid artwork ID'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
