import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database';
import { getSquare } from '../config/square';
import { config } from '../config/environment';
import { AppError } from '../middleware/error-handler';
import { cartService } from './cart.service';
import type { CreatePaymentLinkInput, ListOrdersQuery } from '../validators/order.validator';
import crypto from 'crypto';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export class OrderService {
  /**
   * Create a Square Payment Link from the user's cart.
   * Atomically reserves artworks to prevent double-selling.
   */
  async createCheckoutSession(userId: string) {
    const square = getSquare();

    // Validate cart
    const { cart, invalidItems } = await cartService.validateCartItems(userId);

    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    if (invalidItems.length > 0) {
      throw new AppError(
        `The following items are no longer available: ${invalidItems.join(', ')}`,
        400
      );
    }

    // Atomically reserve artworks using a transaction
    const artworkIds = cart.items.map((item) => item.artworkId);

    const order = await prisma.$transaction(async (tx) => {
      // Lock and check availability
      for (const artworkId of artworkIds) {
        const artwork = await tx.artwork.findUnique({
          where: { id: artworkId },
          select: { id: true, status: true, title: true },
        });

        if (!artwork || artwork.status !== 'AVAILABLE') {
          throw new AppError(
            `"${artwork?.title || artworkId}" is no longer available`,
            409
          );
        }

        // Reserve the artwork
        await tx.artwork.update({
          where: { id: artworkId },
          data: { status: 'RESERVED' },
        });
      }

      // Get user info
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate subtotal
      const subtotal = cart.items.reduce(
        (sum, item) => sum + parseFloat(item.artwork.price.toString()),
        0
      );

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          subtotal: new Decimal(subtotal),
          currency: cart.items[0]?.artwork.currency || 'USD',
          status: 'PENDING',
          customerEmail: user.email,
          customerName: user.name,
          items: {
            create: cart.items.map((item) => ({
              artworkId: item.artworkId,
              price: item.artwork.price,
              currency: item.artwork.currency,
              title: item.artwork.title,
              artistName: item.artwork.artist.name,
            })),
          },
        },
        include: { items: true },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Create Square Payment Link
    const currency = order.currency.toUpperCase();
    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: config.square.locationId,
        referenceId: order.id,
        lineItems: order.items.map((item) => ({
          name: item.title,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(Math.round(parseFloat(item.price.toString()) * 100)),
            currency,
          },
          note: `By ${item.artistName}`,
        })),
      },
      checkoutOptions: {
        redirectUrl: `${config.square.successUrl}?orderId=${order.id}`,
      },
      paymentNote: `Order ${order.orderNumber}`,
    });

    const paymentLink = response.paymentLink;

    // Store payment link ID on order
    await prisma.order.update({
      where: { id: order.id },
      data: { squarePaymentLinkId: paymentLink?.id },
    });

    return { checkoutUrl: paymentLink?.url || paymentLink?.longUrl, orderId: order.id, orderNumber: order.orderNumber };
  }

  /**
   * Staff creates a payment link for an inquiry.
   */
  async createPaymentLinkForInquiry(data: CreatePaymentLinkInput, staffUserId: string) {
    const square = getSquare();

    const artwork = await prisma.artwork.findUnique({
      where: { id: data.artworkId },
      include: { artist: { select: { name: true } } },
    });

    if (!artwork) {
      throw new AppError('Artwork not found', 404);
    }

    if (artwork.status !== 'AVAILABLE') {
      throw new AppError('Artwork is not available', 400);
    }

    // Reserve the artwork
    await prisma.artwork.update({
      where: { id: data.artworkId },
      data: { status: 'RESERVED' },
    });

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: staffUserId,
        subtotal: artwork.price,
        currency: artwork.currency,
        status: 'PENDING',
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        inquiryId: data.inquiryId,
        items: {
          create: {
            artworkId: data.artworkId,
            price: artwork.price,
            currency: artwork.currency,
            title: artwork.title,
            artistName: artwork.artist.name,
          },
        },
      },
    });

    // Create Square Payment Link
    const currency = artwork.currency.toUpperCase();
    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: config.square.locationId,
        referenceId: order.id,
        lineItems: [
          {
            name: artwork.title,
            quantity: '1',
            basePriceMoney: {
              amount: BigInt(Math.round(parseFloat(artwork.price.toString()) * 100)),
              currency,
            },
            note: `By ${artwork.artist.name}`,
          },
        ],
      },
      checkoutOptions: {
        redirectUrl: `${config.square.successUrl}?orderId=${order.id}`,
      },
      paymentNote: `Order ${order.orderNumber} — Inquiry Payment`,
    });

    const paymentLink = response.paymentLink;

    await prisma.order.update({
      where: { id: order.id },
      data: { squarePaymentLinkId: paymentLink?.id },
    });

    return { checkoutUrl: paymentLink?.url || paymentLink?.longUrl, orderId: order.id, orderNumber: order.orderNumber };
  }

  /**
   * Handle Square payment.updated webhook — payment completed.
   */
  async handlePaymentCompleted(paymentId: string, squareOrderId: string) {
    // Find order by Square order reference (we stored our order ID as referenceId)
    // We need to look up the Square order to get the referenceId
    const square = getSquare();

    let internalOrderId: string | undefined;

    try {
      const squareOrder = await square.orders.get({
        orderId: squareOrderId,
      });
      internalOrderId = squareOrder.order?.referenceId || undefined;
    } catch {
      console.error(`Could not retrieve Square order: ${squareOrderId}`);
    }

    if (!internalOrderId) {
      console.error(`No referenceId found for Square order: ${squareOrderId}`);
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: internalOrderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`Order not found for internal ID: ${internalOrderId}`);
      return;
    }

    if (order.status === 'PAID') {
      return; // Already processed (idempotent)
    }

    await prisma.$transaction(async (tx) => {
      // Mark order as paid
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          squarePaymentId: paymentId,
        },
      });

      // Mark artworks as sold
      for (const item of order.items) {
        await tx.artwork.update({
          where: { id: item.artworkId },
          data: { status: 'SOLD' },
        });
      }
    });
  }

  /**
   * Handle Square payment.updated webhook — payment failed/cancelled.
   */
  async handlePaymentFailed(squareOrderId: string) {
    const square = getSquare();

    let internalOrderId: string | undefined;

    try {
      const squareOrder = await square.orders.get({
        orderId: squareOrderId,
      });
      internalOrderId = squareOrder.order?.referenceId || undefined;
    } catch {
      console.error(`Could not retrieve Square order: ${squareOrderId}`);
    }

    if (!internalOrderId) {
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: internalOrderId },
      include: { items: true },
    });

    if (!order || order.status !== 'PENDING') {
      return;
    }

    await prisma.$transaction(async (tx) => {
      // Cancel the order
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });

      // Un-reserve artworks
      for (const item of order.items) {
        await tx.artwork.update({
          where: { id: item.artworkId },
          data: { status: 'AVAILABLE' },
        });
      }
    });
  }

  /**
   * Get orders for a user.
   */
  async getUserOrders(userId: string, query: ListOrdersQuery) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              artwork: {
                include: {
                  images: { where: { type: 'MAIN' }, take: 1 },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single order by ID (must belong to user).
   */
  async getOrder(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            artwork: {
              include: {
                images: { where: { type: 'MAIN' }, take: 1 },
                artist: { select: { id: true, name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export const orderService = new OrderService();
