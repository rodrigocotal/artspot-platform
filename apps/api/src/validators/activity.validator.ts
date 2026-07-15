import { z } from 'zod';

export const activityEventTypes = [
  'page_view',
  'page_exit',
  'engagement',
  'click',
  'artwork_view',
  'collection_view',
  'form_start',
  'form_submit',
] as const;

export const createActivityEventSchema = z.object({
  eventType: z.enum(activityEventTypes),
  sessionId: z.string().trim().min(8).max(120),
  visitorId: z.string().trim().min(8).max(120).optional(),
  path: z.string().trim().min(1).max(500),
  title: z.string().trim().max(300).optional(),
  referrer: z.string().trim().max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const listActivityEventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
  eventType: z.enum(activityEventTypes).optional(),
  path: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  sessionId: z.string().trim().optional(),
  visitorId: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type CreateActivityEventInput = z.infer<typeof createActivityEventSchema>;
export type ListActivityEventsQuery = z.infer<typeof listActivityEventsQuerySchema>;
