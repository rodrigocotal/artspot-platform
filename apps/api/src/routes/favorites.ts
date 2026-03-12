import { Router } from 'express';
import { favoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Toggle favorite (add/remove)
// POST /favorites  { artworkId: string }
router.post('/', authenticate, favoriteController.toggleFavorite.bind(favoriteController));

// List user's favorites
// GET /favorites?page=1&limit=20&sortBy=createdAt&sortOrder=desc
router.get('/', authenticate, favoriteController.listFavorites.bind(favoriteController));

// Remove a favorite by ID
// DELETE /favorites/:id
router.delete('/:id', authenticate, favoriteController.removeFavorite.bind(favoriteController));

export default router;
