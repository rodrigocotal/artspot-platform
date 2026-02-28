import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/article.service';
import { listArticlesQuerySchema } from '../validators/article.validator';
import { AppError } from '../middleware/error-handler';

export class ArticleController {
  /**
   * GET /articles
   * List articles with pagination, category filter, search
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listArticlesQuerySchema.parse(req.query);
      const result = await articleService.list(query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /articles/featured
   * Get featured articles
   */
  async featured(req: Request, res: Response, next: NextFunction) {
    try {
      const limitParam = typeof req.query.limit === 'string' ? req.query.limit : '6';
      const limit = parseInt(limitParam, 10);
      const articles = await articleService.getFeatured(limit);

      res.json({
        success: true,
        data: articles,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /articles/:slug
   * Get single article by slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const article = await articleService.getBySlug(slug);

      if (!article) {
        return next(new AppError('Article not found', 404));
      }

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
