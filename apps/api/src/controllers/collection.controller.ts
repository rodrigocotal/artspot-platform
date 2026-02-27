import { Request, Response, NextFunction } from 'express';
import { collectionService } from '../services/collection.service';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addArtworksToCollectionSchema,
  listCollectionsQuerySchema,
} from '../validators/collection.validator';
import { AppError } from '../middleware/error-handler';

/**
 * Collection controller - HTTP request handlers
 */

export class CollectionController {
  /**
   * GET /collections
   * List collections with filtering and pagination
   */
  async listCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listCollectionsQuerySchema.parse(req.query);
      const result = await collectionService.listCollections(query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /collections/featured
   * Get featured collections
   */
  async getFeaturedCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const collections = await collectionService.getFeaturedCollections(limit);

      res.json({
        success: true,
        data: collections,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /collections/:id
   * Get collection by ID or slug
   */
  async getCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const collection = await collectionService.getCollection(id);

      res.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Collection not found') {
        return next(new AppError('Collection not found', 404));
      }
      next(error);
    }
  }

  /**
   * POST /collections
   * Create new collection
   */
  async createCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCollectionSchema.parse(req.body);
      const collection = await collectionService.createCollection(data);

      res.status(201).json({
        success: true,
        data: collection,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return next(new AppError(error.message, 409));
      }
      next(error);
    }
  }

  /**
   * PUT /collections/:id
   * Update collection
   */
  async updateCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = updateCollectionSchema.parse(req.body);
      const collection = await collectionService.updateCollection(id, data);

      res.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Collection not found') {
          return next(new AppError('Collection not found', 404));
        }
        if (error.message.includes('already exists')) {
          return next(new AppError(error.message, 409));
        }
      }
      next(error);
    }
  }

  /**
   * DELETE /collections/:id
   * Delete collection
   */
  async deleteCollection(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await collectionService.deleteCollection(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Collection not found') {
        return next(new AppError('Collection not found', 404));
      }
      next(error);
    }
  }

  /**
   * POST /collections/:id/artworks
   * Add artworks to collection
   */
  async addArtworks(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = addArtworksToCollectionSchema.parse(req.body);
      const collection = await collectionService.addArtworksToCollection(id, data);

      res.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Collection not found') {
        return next(new AppError('Collection not found', 404));
      }
      next(error);
    }
  }

  /**
   * DELETE /collections/:id/artworks/:artworkId
   * Remove artwork from collection
   */
  async removeArtwork(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const artworkId = req.params.artworkId as string;
      const collection = await collectionService.removeArtworkFromCollection(id, artworkId);

      res.json({
        success: true,
        data: collection,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Collection not found') {
          return next(new AppError('Collection not found', 404));
        }
        if (error.message === 'Artwork not found in collection') {
          return next(new AppError('Artwork not found in collection', 404));
        }
      }
      next(error);
    }
  }
}

export const collectionController = new CollectionController();
