import { Router } from 'express';
import { pageContentController } from '../controllers/page-content.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// List all page contents (admin only)
// GET /pages
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.listAll.bind(pageContentController)
);

// Get page content by slug (public, optionally with draft for authenticated users)
// GET /pages/:slug?draft=true
router.get('/:slug', optionalAuth, pageContentController.getBySlug.bind(pageContentController));

// Update page content by slug (saves as draft)
// PUT /pages/:slug
router.put(
  '/:slug',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.updateBySlug.bind(pageContentController)
);

// Publish page content by slug
// POST /pages/:slug/publish
router.post(
  '/:slug/publish',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.publishBySlug.bind(pageContentController)
);

export default router;
