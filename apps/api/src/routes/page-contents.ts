import { Router } from 'express';
import { pageContentController } from '../controllers/page-content.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// List all page contents (admin/staff only)
// GET /pages
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.listAll.bind(pageContentController)
);

// Get draft content by slug (admin/staff only) — used by the editor preview
// GET /pages/:slug/draft
router.get(
  '/:slug/draft',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  pageContentController.getDraftBySlug.bind(pageContentController)
);

// Get published page content by slug (public). Never returns draft content.
// GET /pages/:slug
router.get('/:slug', pageContentController.getBySlug.bind(pageContentController));

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
