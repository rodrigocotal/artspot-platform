import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { pageContentService } from '../services/page-content.service';
import { AppError } from '../middleware/error-handler';

const updatePageContentSchema = z.object({
  content: z.record(z.any()),
});

export class PageContentController {
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const includeDraft = req.query.draft === 'true';

      if (includeDraft && !(req as any).userId) {
        return next(new AppError('Authentication required to view drafts', 401));
      }

      const page = await pageContentService.getBySlug(slug, includeDraft);

      if (!page) {
        return next(new AppError('Page not found', 404));
      }

      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await pageContentService.listAll();
      res.json({
        success: true,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const { content } = updatePageContentSchema.parse(req.body);
      const page = await pageContentService.saveDraft(slug, content);
      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  async publishBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const page = await pageContentService.publishBySlug(slug);

      if (!page) {
        return next(new AppError('Page not found', 404));
      }

      res.json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pageContentController = new PageContentController();
