import { Request, Response, NextFunction } from 'express';
import { artworkService } from '../services/artwork.service';
import { favoriteService } from '../services/favorite.service';
import {
  createArtworkSchema,
  updateArtworkSchema,
  listArtworksQuerySchema,
} from '../validators/artwork.validator';
import { AppError } from '../middleware/error-handler';

/**
 * Artwork controller - HTTP request handlers
 */

export class ArtworkController {
  /**
   * GET /artworks
   * List artworks with filtering and pagination
   */
  async listArtworks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId as string | undefined;
      const query = listArtworksQuerySchema.parse(req.query);

      const result = await artworkService.listArtworks(query);

      // Annotate with isFavorited for authenticated users
      if (userId) {
        const artworkIds = result.data.map((a: any) => a.id);
        const favoritedSet = await favoriteService.batchCheckFavorites(userId, artworkIds);
        result.data = result.data.map((artwork: any) => ({
          ...artwork,
          isFavorited: favoritedSet.has(artwork.id),
        }));
      }

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /artworks/:id
   * Get artwork by ID or slug
   */
  async getArtwork(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId as string | undefined;
      const id = req.params.id as string;

      const artwork = await artworkService.getArtwork(id);

      // Annotate with isFavorited for authenticated users
      const isFavorited = userId
        ? await favoriteService.isFavorited(userId, artwork.id)
        : undefined;

      res.json({
        success: true,
        data: { ...artwork, ...(isFavorited !== undefined && { isFavorited }) },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        return next(new AppError('Artwork not found', 404));
      }
      next(error);
    }
  }

  /**
   * POST /artworks
   * Create new artwork
   */
  async createArtwork(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const data = createArtworkSchema.parse(req.body);

      const artwork = await artworkService.createArtwork(data);

      res.status(201).json({
        success: true,
        data: artwork,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Artist not found') {
          return next(new AppError('Artist not found', 404));
        }
        if (error.message.includes('already exists')) {
          return next(new AppError(error.message, 409));
        }
      }
      next(error);
    }
  }

  /**
   * PUT /artworks/:id
   * Update artwork
   */
  async updateArtwork(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      // Validate request body
      const data = updateArtworkSchema.parse(req.body);

      const artwork = await artworkService.updateArtwork(id, data);

      res.json({
        success: true,
        data: artwork,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Artwork not found') {
          return next(new AppError('Artwork not found', 404));
        }
        if (error.message === 'Artist not found') {
          return next(new AppError('Artist not found', 404));
        }
        if (error.message.includes('already exists')) {
          return next(new AppError(error.message, 409));
        }
      }
      next(error);
    }
  }

  /**
   * DELETE /artworks/:id
   * Delete artwork
   */
  async deleteArtwork(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      await artworkService.deleteArtwork(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        return next(new AppError('Artwork not found', 404));
      }
      next(error);
    }
  }

  /**
   * GET /artworks/:id/related
   * Get related artworks
   */
  async getRelatedArtworks(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;

      const artworks = await artworkService.getRelatedArtworks(id, limit);

      res.json({
        success: true,
        data: artworks,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        return next(new AppError('Artwork not found', 404));
      }
      next(error);
    }
  }
}

export const artworkController = new ArtworkController();
