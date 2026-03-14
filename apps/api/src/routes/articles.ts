import { Router } from 'express';
import { articleController } from '../controllers/article.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// List articles with pagination, category filter, search
// GET /articles?page=1&limit=20&category=NEWS&search=modern
router.get('/', articleController.list.bind(articleController));

// Get featured articles
// GET /articles/featured?limit=6
router.get('/featured', articleController.featured.bind(articleController));

// Get single article by ID (admin)
// GET /articles/id/:id
router.get('/id/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), articleController.getById.bind(articleController));

// Create article (admin)
// POST /articles
router.post('/', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), articleController.create.bind(articleController));

// Update article (admin)
// PUT /articles/:id
router.put('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), articleController.update.bind(articleController));

// Delete article (admin)
// DELETE /articles/:id
router.delete('/:id', authenticate, authorize('ADMIN', 'GALLERY_STAFF'), articleController.delete.bind(articleController));

// Get single article by slug (public)
// GET /articles/:slug
router.get('/:slug', articleController.getBySlug.bind(articleController));

export default router;
