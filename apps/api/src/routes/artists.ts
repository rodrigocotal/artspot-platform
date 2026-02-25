import { Router } from 'express';
import { artistController } from '../controllers/artist.controller';

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
router.post('/', artistController.createArtist.bind(artistController));

// PUT /artists/:id - Update artist
router.put('/:id', artistController.updateArtist.bind(artistController));

// DELETE /artists/:id - Delete artist
router.delete('/:id', artistController.deleteArtist.bind(artistController));

export default router;
