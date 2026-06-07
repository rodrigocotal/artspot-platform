import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import type {
  CreateContactMessageInput,
  UpdateContactMessageInput,
  ListContactMessagesQuery,
} from '../validators/contact.validator';
import { emailService } from './email.service';

export class ContactService {
  /**
   * Create a contact message from the public contact form.
   * Persisted first (source of truth), then a best-effort staff email is sent.
   */
  async create(data: CreateContactMessageInput) {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
      },
    });

    // Fire-and-forget email notification to staff. Delivery is best-effort —
    // the message is already persisted and visible in the admin panel.
    void emailService
      .sendContactMessageNotification({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
      .catch((err) => console.error('Contact notification failed:', err));

    return contactMessage;
  }

  /**
   * List all contact messages (admin/staff). Supports filtering by status and search.
   */
  async listAll(query: ListContactMessagesQuery) {
    const { page, limit, status, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactMessageWhereInput = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update a contact message's status (admin/staff).
   */
  async updateStatus(id: string, data: UpdateContactMessageInput) {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Contact message not found');
    }

    return prisma.contactMessage.update({
      where: { id },
      data: { status: data.status },
    });
  }
}

export const contactService = new ContactService();
