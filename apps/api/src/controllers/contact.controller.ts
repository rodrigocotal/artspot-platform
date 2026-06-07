import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';
import {
  createContactMessageSchema,
  updateContactMessageSchema,
  listContactMessagesQuerySchema,
} from '../validators/contact.validator';
import { AppError } from '../middleware/error-handler';

export class ContactController {
  /**
   * POST /contact
   * Submit a contact message (public, no auth)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createContactMessageSchema.parse(req.body);

      const message = await contactService.create(data);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /contact/admin
   * List all contact messages (admin/staff only) with filters
   */
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listContactMessagesQuerySchema.parse(req.query);

      const result = await contactService.listAll(query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /contact/:id
   * Update a contact message's status (admin/staff only)
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = updateContactMessageSchema.parse(req.body);

      const message = await contactService.updateStatus(id, data);

      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact message not found') {
        return next(new AppError('Contact message not found', 404));
      }
      next(error);
    }
  }
}

export const contactController = new ContactController();
