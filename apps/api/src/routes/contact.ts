import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Submit a contact message (public)
// POST /contact  { name, email, subject?, message }
router.post('/', contactController.create.bind(contactController));

// List all contact messages (admin/staff only)
// GET /contact/admin?page=1&limit=20&status=NEW&search=jane
router.get(
  '/admin',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  contactController.listAll.bind(contactController)
);

// Update a contact message's status (admin/staff only)
// PATCH /contact/:id  { status }
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  contactController.updateStatus.bind(contactController)
);

export default router;
