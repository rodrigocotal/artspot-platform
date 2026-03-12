import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /cart — get user's cart with items
router.get('/', authenticate, cartController.getCart.bind(cartController));

// GET /cart/count — get item count (lightweight)
router.get('/count', authenticate, cartController.getCartCount.bind(cartController));

// POST /cart/items — add artwork to cart
router.post('/items', authenticate, cartController.addItem.bind(cartController));

// DELETE /cart/items/:artworkId — remove artwork from cart
router.delete('/items/:artworkId', authenticate, cartController.removeItem.bind(cartController));

// DELETE /cart — clear all items
router.delete('/', authenticate, cartController.clearCart.bind(cartController));

export default router;
