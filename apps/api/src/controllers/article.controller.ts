import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/article.service';
import { listArticlesQuerySchema, createArticleSchema, updateArticleSchema } from '../validators/article.validator';
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

  /**
   * GET /articles/id/:id
   * Get single article by ID (admin)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await articleService.getById(req.params.id as string);

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

  /**
   * POST /articles
   * Create a new article (admin)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createArticleSchema.parse(req.body);
      const article = await articleService.create(data);

      res.status(201).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /articles/:id
   * Update an article (admin)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const existing = await articleService.getById(id);

      if (!existing) {
        return next(new AppError('Article not found', 404));
      }

      const data = updateArticleSchema.parse(req.body);
      const article = await articleService.update(id, data);

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /articles/:id
   * Delete an article (admin)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const existing = await articleService.getById(id);

      if (!existing) {
        return next(new AppError('Article not found', 404));
      }

      await articleService.delete(id);

      res.json({
        success: true,
        data: { message: 'Article deleted' },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();
