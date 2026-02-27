import { Router } from 'express';
import { artistController } from '../controllers/artist.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * Artist Routes
 * Base path: /artists
 */

// GET /artists - List artists with filtering and pagination
router.get('/', artistController.listArtists.bind(artistController));

// GET /artists/featured - Get featured artists
router.get('/featured', artistController.getFeaturedArtists.bind(artistController));

// GET /artists/:id - Get artist by ID or slug
router.get('/:id', artistController.getArtist.bind(artistController));

// POST /artists - Create new artist
router.post('/', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artistController.createArtist.bind(artistController));

// PUT /artists/:id - Update artist
router.put('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artistController.updateArtist.bind(artistController));

// DELETE /artists/:id - Delete artist
router.delete('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), artistController.deleteArtist.bind(artistController));

export default router;
