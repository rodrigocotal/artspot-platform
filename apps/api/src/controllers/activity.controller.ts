import { Request, Response, NextFunction } from 'express';
import { activityService } from '../services/activity.service';
import { createActivityEventSchema, listActivityEventsQuerySchema } from '../validators/activity.validator';

export class ActivityController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createActivityEventSchema.parse(req.body);
      const userId = (req as any).userId as string | undefined;
      const userAgent = req.headers['user-agent'];
      const event = await activityService.createEvent(data, userId, userAgent);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listActivityEventsQuerySchema.parse(req.query);
      const result = await activityService.listEvents(query);
      res.json({ success: true, data: result.events, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await activityService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
}

export const activityController = new ActivityController();
