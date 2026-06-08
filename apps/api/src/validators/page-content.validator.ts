import { z } from 'zod';

/** Cap stored CMS content to a sane size to prevent abuse / DB bloat. */
export const MAX_CONTENT_BYTES = 100_000;

export const updatePageContentSchema = z.object({
  content: z
    .record(z.any())
    .refine(
      (c) => Buffer.byteLength(JSON.stringify(c), 'utf8') <= MAX_CONTENT_BYTES,
      { message: `Content exceeds maximum size of ${MAX_CONTENT_BYTES} bytes` }
    ),
});

export type UpdatePageContentInput = z.infer<typeof updatePageContentSchema>;
