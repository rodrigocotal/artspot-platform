import { Router } from 'express';
import { collectionController } from '../controllers/collection.controller';

const router = Router();

/**
 * Collection Routes
 * Base path: /collections
 */

// GET /collections - List collections with filtering and pagination
router.get('/', collectionController.listCollections.bind(collectionController));

// GET /collections/featured - Get featured collections
router.get('/featured', collectionController.getFeaturedCollections.bind(collectionController));

// GET /collections/:id - Get collection by ID or slug
router.get('/:id', collectionController.getCollection.bind(collectionController));

// POST /collections - Create new collection
router.post('/', collectionController.createCollection.bind(collectionController));

// PUT /collections/:id - Update collection
router.put('/:id', collectionController.updateCollection.bind(collectionController));

// DELETE /collections/:id - Delete collection
router.delete('/:id', collectionController.deleteCollection.bind(collectionController));

// POST /collections/:id/artworks - Add artworks to collection
router.post('/:id/artworks', collectionController.addArtworks.bind(collectionController));

// DELETE /collections/:id/artworks/:artworkId - Remove artwork from collection
router.delete('/:id/artworks/:artworkId', collectionController.removeArtwork.bind(collectionController));

export default router;
