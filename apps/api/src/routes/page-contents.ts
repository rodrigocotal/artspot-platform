import { Router } from 'express';
import { pageContentController } from '../controllers/page-content.controller';

const router = Router();

// Get page content by slug
// GET /pages/:slug
router.get('/:slug', pageContentController.getBySlug.bind(pageContentController));

export default router;
