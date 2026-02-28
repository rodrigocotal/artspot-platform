import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';

const router = Router();

// Submit inquiry (guest or authenticated)
// POST /inquiries  { artworkId, name, email, phone?, message }
router.post('/', optionalAuth, inquiryController.create.bind(inquiryController));

// List authenticated user's own inquiries
// GET /inquiries?page=1&limit=20&status=PENDING
router.get('/', authenticate, inquiryController.listUserInquiries.bind(inquiryController));

// List all inquiries (admin/staff only)
// GET /inquiries/admin?page=1&limit=20&status=PENDING&search=john
router.get(
  '/admin',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  inquiryController.listAll.bind(inquiryController)
);

// Respond to or update inquiry status (admin/staff only)
// PATCH /inquiries/:id  { response?, status? }
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'GALLERY_STAFF'),
  inquiryController.respond.bind(inquiryController)
);

export default router;
