import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { addToCartSchema, removeFromCartSchema } from '../validators/cart.validator';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const cart = await cartService.getOrCreateCart(userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async getCartCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const count = await cartService.getItemCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { artworkId } = addToCartSchema.parse(req.body);
      const cart = await cartService.addItem(userId, artworkId);
      res.status(201).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { artworkId } = removeFromCartSchema.parse(req.params);
      const cart = await cartService.removeItem(userId, artworkId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const cart = await cartService.clearCart(userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
