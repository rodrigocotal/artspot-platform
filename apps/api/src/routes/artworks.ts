import { Router } from 'express';
import { artworkController } from '../controllers/artwork.controller';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';

const router = Router();

/**
 * Artwork routes
 * Base path: /artworks
 */

// List artworks with filtering and pagination (optionalAuth adds isFavorited for logged-in users)
// GET /artworks?page=1&limit=20&medium=PAINTING&status=AVAILABLE&sortBy=price&sortOrder=asc
router.get('/', optionalAuth, artworkController.listArtworks.bind(artworkController));

// Get artwork by ID or slug (optionalAuth adds isFavorited for logged-in users)
// GET /artworks/:id
router.get('/:id', optionalAuth, artworkController.getArtwork.bind(artworkController));

// Get related artworks
// GET /artworks/:id/related?limit=6
router.get('/:id/related', artworkController.getRelatedArtworks.bind(artworkController));

// Create new artwork
// POST /artworks
router.post('/', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artworkController.createArtwork.bind(artworkController));

// Update artwork
// PUT /artworks/:id
router.put('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artworkController.updateArtwork.bind(artworkController));

// Delete artwork
// DELETE /artworks/:id
router.delete('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artworkController.deleteArtwork.bind(artworkController));

export default router;
