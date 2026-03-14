import { Router } from 'express';
import { pageContentController } from '../controllers/page-content.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// List all page contents (admin only)
// GET /pages
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.listAll.bind(pageContentController)
);

// Get page content by slug (public)
// GET /pages/:slug
router.get('/:slug', pageContentController.getBySlug.bind(pageContentController));

// Update page content by slug (admin only)
// PUT /pages/:slug
router.put(
  '/:slug',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.updateBySlug.bind(pageContentController)
);

export default router;
