import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /orders/checkout — create Stripe checkout session from cart
router.post('/checkout', authenticate, orderController.createCheckout.bind(orderController));

// POST /orders/payment-link — staff creates a payment link for an inquiry
router.post(
  '/payment-link',
  authenticate,
  authorize('GALLERY_STAFF', 'ADMIN'),
  orderController.createPaymentLink.bind(orderController)
);

// GET /orders — list user's orders
router.get('/', authenticate, orderController.listOrders.bind(orderController));

// GET /orders/by-session/:sessionId — resolve the order for a Stripe checkout session
router.get('/by-session/:sessionId', authenticate, orderController.getOrderBySession.bind(orderController));

// GET /orders/:id — get single order
router.get('/:id', authenticate, orderController.getOrder.bind(orderController));

// POST /orders/:id/cancel — user cancels their own pending checkout (releases reservation)
router.post('/:id/cancel', authenticate, orderController.cancelOrder.bind(orderController));

export default router;
