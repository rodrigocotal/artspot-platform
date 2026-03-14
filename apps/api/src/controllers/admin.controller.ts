import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import {
  listAdminOrdersQuerySchema,
  updateOrderStatusSchema,
  listAdminUsersQuerySchema,
  updateUserRoleSchema,
} from '../validators/admin.validator';
import { AppError } from '../middleware/error-handler';

export class AdminController {
  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listAdminOrdersQuerySchema.parse(req.query);
      const result = await adminService.getAllOrders(query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id as string;
      const data = updateOrderStatusSchema.parse(req.body);
      const order = await adminService.updateOrderStatus(orderId, data);
      res.json({ success: true, data: order });
    } catch (error) {
      if (error instanceof AppError) return next(error);
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listAdminUsersQuerySchema.parse(req.query);
      const result = await adminService.getAllUsers(query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;
      const requestingUserId = (req as any).userId as string;
      const data = updateUserRoleSchema.parse(req.body);
      const user = await adminService.updateUserRole(userId, data, requestingUserId);
      res.json({ success: true, data: user });
    } catch (error) {
      if (error instanceof AppError) return next(error);
      next(error);
    }
  }
}

export const adminController = new AdminController();
