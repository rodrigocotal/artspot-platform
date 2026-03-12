import { Request, Response, NextFunction } from 'express';
import { inquiryService } from '../services/inquiry.service';
import {
  createInquirySchema,
  respondInquirySchema,
  listInquiriesQuerySchema,
} from '../validators/inquiry.validator';
import { AppError } from '../middleware/error-handler';

export class InquiryController {
  /**
   * POST /inquiries
   * Submit an inquiry (guest or authenticated)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId as string | undefined;
      const data = createInquirySchema.parse(req.body);

      const inquiry = await inquiryService.create(data, userId);

      res.status(201).json({
        success: true,
        data: inquiry,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Artwork not found') {
        return next(new AppError('Artwork not found', 404));
      }
      next(error);
    }
  }

  /**
   * GET /inquiries
   * List the authenticated user's own inquiries
   */
  async listUserInquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId as string;
      const query = listInquiriesQuerySchema.parse(req.query);

      const result = await inquiryService.listUserInquiries(userId, query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /inquiries/admin
   * List all inquiries (admin/staff only) with filters
   */
  async listAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listInquiriesQuerySchema.parse(req.query);

      const result = await inquiryService.listAll(query);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /inquiries/:id
   * Respond to or close an inquiry (admin/staff only)
   */
  async respond(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiryId = req.params.id as string;
      const staffUserId = (req as any).userId as string;
      const data = respondInquirySchema.parse(req.body);

      const inquiry = await inquiryService.respond(inquiryId, staffUserId, data);

      res.json({
        success: true,
        data: inquiry,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Inquiry not found') {
          return next(new AppError('Inquiry not found', 404));
        }
        if (error.message.startsWith('Cannot transition')) {
          return next(new AppError(error.message, 400));
        }
      }
      next(error);
    }
  }
}

export const inquiryController = new InquiryController();
