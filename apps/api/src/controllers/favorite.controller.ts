import { Request, Response, NextFunction } from 'express';
import { favoriteService } from '../services/favorite.service';
import { addFavoriteSchema, listFavoritesQuerySchema } from '../validators/favorite.validator';
import { AppError } from '../middleware/error-handler';

export class FavoriteController {
  /**
   * POST /favorites
   * Toggle favorite on an artwork
   */
  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { artworkId } = addFavoriteSchema.parse(req.body);

      const result = await favoriteService.toggleFavorite(userId, artworkId);

      res.status(result.favorited ? 201 : 200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        return next(new AppError('Artwork not found', 404));
      }
      next(error);
    }
  }

  /**
   * GET /favorites
   * List the authenticated user's favorites
   */
  async listFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const query = listFavoritesQuerySchema.parse(req.query);

      const result = await favoriteService.listUserFavorites(userId, query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /favorites/:id
   * Remove a specific favorite by ID
   */
  async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const favoriteId = req.params.id as string;

      await favoriteService.removeFavorite(userId, favoriteId);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Favorite not found') {
          return next(new AppError('Favorite not found', 404));
        }
        if (error.message === 'Forbidden') {
          return next(new AppError('Insufficient permissions', 403));
        }
      }
      next(error);
    }
  }
}

export const favoriteController = new FavoriteController();
