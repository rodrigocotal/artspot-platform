import { Request, Response, NextFunction } from 'express';
import { pageContentService } from '../services/page-content.service';
import { AppError } from '../middleware/error-handler';

export class PageContentController {
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const page = await pageContentService.getBySlug(slug);

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
