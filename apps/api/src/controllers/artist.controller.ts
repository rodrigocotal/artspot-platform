import { Request, Response, NextFunction } from 'express';
import { artistService } from '../services/artist.service';
import {
  createArtistSchema,
  updateArtistSchema,
  listArtistsQuerySchema,
} from '../validators/artist.validator';
import { AppError } from '../middleware/error-handler';

/**
 * Artist controller - HTTP request handlers
 */

export class ArtistController {
  /**
   * GET /artists
   * List artists with filtering and pagination
   */
  async listArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listArtistsQuerySchema.parse(req.query);
      const result = await artistService.listArtists(query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /artists/featured
   * Get featured artists
   */
  async getFeaturedArtists(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const artists = await artistService.getFeaturedArtists(limit);

      res.json({
        success: true,
        data: artists,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /artists/:id
   * Get artist by ID or slug
   */
  async getArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const artist = await artistService.getArtist(id);

      res.json({
        success: true,
        data: artist,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artist not found') {
        return next(new AppError('Artist not found', 404));
      }
      next(error);
    }
  }

  /**
   * POST /artists
   * Create new artist
   */
  async createArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createArtistSchema.parse(req.body);
      const artist = await artistService.createArtist(data);

      res.status(201).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return next(new AppError(error.message, 409));
      }
      next(error);
    }
  }

  /**
   * PUT /artists/:id
   * Update artist
   */
  async updateArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = updateArtistSchema.parse(req.body);
      const artist = await artistService.updateArtist(id, data);

      res.json({
        success: true,
        data: artist,
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
   * DELETE /artists/:id
   * Delete artist
   */
  async deleteArtist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await artistService.deleteArtist(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Artist not found') {
          return next(new AppError('Artist not found', 404));
        }
        if (error.message.includes('existing artworks')) {
          return next(new AppError(error.message, 400));
        }
      }
      next(error);
    }
  }
}

export const artistController = new ArtistController();
