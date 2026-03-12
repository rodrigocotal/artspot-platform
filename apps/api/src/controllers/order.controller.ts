import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { createPaymentLinkSchema, listOrdersQuerySchema } from '../validators/order.validator';

export class OrderController {
  async createCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const result = await orderService.createCheckoutSession(userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createPaymentLink(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const data = createPaymentLinkSchema.parse(req.body);
      const result = await orderService.createPaymentLinkForInquiry(data, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const query = listOrdersQuerySchema.parse(req.query);
      const { orders, pagination } = await orderService.getUserOrders(userId, query);
      res.json({ success: true, data: orders, pagination });
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const order = await orderService.getOrder(String(req.params.id), userId);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
