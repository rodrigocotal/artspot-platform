import { Request, Response, NextFunction } from 'express';
import { pageContentService } from '../services/page-content.service';
import { AppError } from '../middleware/error-handler';
import { isValidCmsSlug } from '../config/cms-slugs';
import { updatePageContentSchema } from '../validators/page-content.validator';

export class PageContentController {
  /**
   * GET /pages/:slug — public. Returns published content only (never draft).
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;

      const page = await pageContentService.getBySlug(slug, false);

      if (!page) {
        return next(new AppError('Page not found', 404));
      }

      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pages/:slug/draft — admin/staff only. Returns draftContent for preview.
   */
  async getDraftBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;

      if (!isValidCmsSlug(slug)) {
        return next(new AppError('Invalid page slug', 400));
      }

      const page = await pageContentService.getBySlug(slug, true);

      if (!page) {
        return next(new AppError('Page not found', 404));
      }

      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  }

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const pages = await pageContentService.listAll();
      res.json({ success: true, data: pages });
    } catch (error) {
      next(error);
    }
  }

  async updateBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;

      if (!isValidCmsSlug(slug)) {
        return next(new AppError('Invalid page slug', 400));
      }

      const { content } = updatePageContentSchema.parse(req.body);
      const page = await pageContentService.saveDraft(slug, content);
      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  }

  async publishBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;

      if (!isValidCmsSlug(slug)) {
        return next(new AppError('Invalid page slug', 400));
      }

      const page = await pageContentService.publishBySlug(slug);

      if (!page) {
        return next(new AppError('Page not found', 404));
      }

      res.json({ success: true, data: page });
    } catch (error) {
      next(error);
    }
  }
}

export const pageContentController = new PageContentController();
