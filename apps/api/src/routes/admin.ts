import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /admin/stats
router.get(
  '/stats',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  adminController.getStats.bind(adminController)
);

// GET /admin/orders
router.get(
  '/orders',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  adminController.listOrders.bind(adminController)
);

// PATCH /admin/orders/:id/status
router.patch(
  '/orders/:id/status',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  adminController.updateOrderStatus.bind(adminController)
);

// GET /admin/users
router.get(
  '/users',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  adminController.listUsers.bind(adminController)
);

// PATCH /admin/users/:id/role — ADMIN only
router.patch(
  '/users/:id/role',
  authenticate,
  authorize('ADMIN'),
  adminController.updateUserRole.bind(adminController)
);

export default router;
