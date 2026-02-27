import { Router } from 'express';
import { collectionController } from '../controllers/collection.controller';
import { authenticate, authorize } from '../middleware/auth';

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
router.post('/', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), collectionController.createCollection.bind(collectionController));

// PUT /collections/:id - Update collection
router.put('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), collectionController.updateCollection.bind(collectionController));

// DELETE /collections/:id - Delete collection
router.delete('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), collectionController.deleteCollection.bind(collectionController));

// POST /collections/:id/artworks - Add artworks to collection
router.post('/:id/artworks', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), collectionController.addArtworks.bind(collectionController));

// DELETE /collections/:id/artworks/:artworkId - Remove artwork from collection
router.delete('/:id/artworks/:artworkId', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), collectionController.removeArtwork.bind(collectionController));

export default router;
