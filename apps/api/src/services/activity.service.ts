import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { CreateActivityEventInput, ListActivityEventsQuery } from '../validators/activity.validator';

export class ActivityService {
  async createEvent(data: CreateActivityEventInput, userId: string | undefined, userAgent: string | undefined) {
    return prisma.activityEvent.create({
      data: {
        userId,
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        eventType: data.eventType,
        path: data.path,
        title: data.title,
        referrer: data.referrer,
        userAgent,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
      select: {
        id: true,
        eventType: true,
        path: true,
        createdAt: true,
      },
    });
  }

  async listEvents(query: ListActivityEventsQuery) {
    const { page, limit, eventType, path, userId, sessionId, visitorId, from, to } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityEventWhereInput = {};
    if (eventType) where.eventType = eventType;
    if (userId) where.userId = userId;
    if (sessionId) where.sessionId = sessionId;
    if (visitorId) where.visitorId = visitorId;
    if (path) where.path = { contains: path, mode: 'insensitive' };
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    const [events, total] = await Promise.all([
      prisma.activityEvent.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityEvent.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSummary() {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalEvents, pageViews, uniqueSessions, topPages, topEvents] = await Promise.all([
      prisma.activityEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.activityEvent.count({ where: { eventType: 'page_view', createdAt: { gte: since } } }),
      prisma.activityEvent.findMany({
        where: { createdAt: { gte: since } },
        distinct: ['sessionId'],
        select: { sessionId: true },
      }),
      prisma.activityEvent.groupBy({
        by: ['path'],
        where: { eventType: 'page_view', createdAt: { gte: since } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 8,
      }),
      prisma.activityEvent.groupBy({
        by: ['eventType'],
        where: { createdAt: { gte: since } },
        _count: { eventType: true },
        orderBy: { _count: { eventType: 'desc' } },
      }),
    ]);

    return {
      windowDays: 30,
      totalEvents,
      pageViews,
      uniqueSessions: uniqueSessions.length,
      topPages: topPages.map((item) => ({ path: item.path, count: item._count.path })),
      topEvents: topEvents.map((item) => ({ eventType: item.eventType, count: item._count.eventType })),
    };
  }
}

export const activityService = new ActivityService();
