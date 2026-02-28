import { Router } from 'express';
import { articleController } from '../controllers/article.controller';

const router = Router();

// List articles with pagination, category filter, search
// GET /articles?page=1&limit=20&category=NEWS&search=modern
router.get('/', articleController.list.bind(articleController));

// Get featured articles
// GET /articles/featured?limit=6
router.get('/featured', articleController.featured.bind(articleController));

// Get single article by slug
// GET /articles/:slug
router.get('/:slug', articleController.getBySlug.bind(articleController));

export default router;
