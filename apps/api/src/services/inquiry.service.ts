import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type { CreateInquiryInput, RespondInquiryInput, ListInquiriesQuery } from '../validators/inquiry.validator';
import { emailService } from './email.service';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['RESPONDED', 'CLOSED'],
  RESPONDED: ['CLOSED'],
  CLOSED: [],
};

export class InquiryService {
  /**
   * Create a new inquiry on an artwork.
   * userId is optional — guests can submit without an account.
   */
  async create(data: CreateInquiryInput, userId?: string) {
    // Verify artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id: data.artworkId },
      select: { id: true, title: true },
    });
    if (!artwork) {
      throw new Error('Artwork not found');
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        artworkId: data.artworkId,
        userId: userId || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
      include: {
        artwork: { select: { id: true, title: true, slug: true } },
      },
    });

    // Fire-and-forget email notification to staff
    void emailService
      .sendNewInquiryNotification({
        inquiryId: inquiry.id,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        message: data.message,
        artworkTitle: artwork.title,
        artworkSlug: inquiry.artwork.slug,
      })
      .catch((err) => console.error('Email notification failed:', err));

    return inquiry;
  }

  /**
   * List inquiries for an authenticated user (their own).
   */
  async listUserInquiries(userId: string, query: ListInquiriesQuery) {
    const { page, limit, status, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InquiryWhereInput = { userId };
    if (status) where.status = status;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          artwork: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: { where: { type: 'MAIN' }, take: 1, orderBy: { displayOrder: 'asc' } },
            },
          },
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return {
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * List all inquiries (admin/staff). Supports filtering by status and search.
   */
  async listAll(query: ListInquiriesQuery) {
    const { page, limit, status, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InquiryWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          artwork: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: { where: { type: 'MAIN' }, take: 1, orderBy: { displayOrder: 'asc' } },
            },
          },
          user: { select: { id: true, email: true, name: true } },
        },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return {
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Respond to or update an inquiry (admin/staff).
   * Validates status transitions: PENDING→RESPONDED, PENDING→CLOSED, RESPONDED→CLOSED.
   */
  async respond(inquiryId: string, staffUserId: string, data: RespondInquiryInput) {
    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }

    // Determine target status
    const targetStatus = data.status || (data.response ? 'RESPONDED' : inquiry.status);

    // Validate transition
    const allowed = VALID_TRANSITIONS[inquiry.status] || [];
    if (targetStatus !== inquiry.status && !allowed.includes(targetStatus)) {
      throw new Error(`Cannot transition from ${inquiry.status} to ${targetStatus}`);
    }

    const updateData: Prisma.InquiryUpdateInput = {};
    if (data.response) {
      updateData.response = data.response;
      updateData.respondedAt = new Date();
      updateData.respondedBy = staffUserId;
    }
    if (targetStatus !== inquiry.status) {
      updateData.status = targetStatus;
    }

    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: updateData,
      include: {
        artwork: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Fire-and-forget email notification to customer when staff responds
    if (data.response) {
      void emailService
        .sendInquiryResponseNotification({
          inquiryId: updated.id,
          customerName: inquiry.name,
          customerEmail: inquiry.email,
          customerPhone: inquiry.phone,
          message: inquiry.message,
          artworkTitle: updated.artwork.title,
          artworkSlug: updated.artwork.slug,
          response: data.response,
        })
        .catch((err) => console.error('Response notification failed:', err));
    }

    return updated;
  }
}

export const inquiryService = new InquiryService();
