import { Router, Request, Response, NextFunction } from 'express';
import { pageContentService } from '../services/page-content.service';

const router = Router();

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const page = await pageContentService.getBySlug(slug, false);

    if (!page) {
      res.status(404).json({
        success: false,
        message: 'Page not found',
      });
      return;
    }

    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
});

export default router;
