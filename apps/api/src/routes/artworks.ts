import { Router } from 'express';
import { artworkController } from '../controllers/artwork.controller';

const router = Router();

/**
 * Artwork routes
 * Base path: /artworks
 */

// List artworks with filtering and pagination
// GET /artworks?page=1&limit=20&medium=PAINTING&status=AVAILABLE&sortBy=price&sortOrder=asc
router.get('/', artworkController.listArtworks.bind(artworkController));

// Get artwork by ID or slug
// GET /artworks/:id
router.get('/:id', artworkController.getArtwork.bind(artworkController));

// Get related artworks
// GET /artworks/:id/related?limit=6
router.get('/:id/related', artworkController.getRelatedArtworks.bind(artworkController));

// Create new artwork (TODO: Add authentication middleware)
// POST /artworks
router.post('/', artworkController.createArtwork.bind(artworkController));

// Update artwork (TODO: Add authentication middleware)
// PUT /artworks/:id
router.put('/:id', artworkController.updateArtwork.bind(artworkController));

// Delete artwork (TODO: Add authentication middleware)
// DELETE /artworks/:id
router.delete('/:id', artworkController.deleteArtwork.bind(artworkController));

export default router;
