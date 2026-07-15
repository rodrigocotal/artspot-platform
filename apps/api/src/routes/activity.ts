import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, activityController.createEvent.bind(activityController));

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  activityController.listEvents.bind(activityController)
);

router.get(
  '/summary',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  activityController.getSummary.bind(activityController)
);

export default router;
