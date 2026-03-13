import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database';
import { getStripe } from '../config/stripe';
import { config } from '../config/environment';
import { AppError } from '../middleware/error-handler';
import { cartService } from './cart.service';
import { strapiClient } from './strapi-client';
import type { CreatePaymentLinkInput, ListOrdersQuery } from '../validators/order.validator';
import crypto from 'crypto';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export class OrderService {
  /**
   * Create a Stripe Checkout Session from the user's cart.
   * Atomically reserves artworks to prevent double-selling.
   */
  async createCheckoutSession(userId: string) {
    const stripe = getStripe();

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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      line_items: order.items.map((item) => ({
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: {
            name: item.title,
            description: `By ${item.artistName}`,
          },
          unit_amount: Math.round(parseFloat(item.price.toString()) * 100),
        },
        quantity: 1,
      })),
      success_url: `${config.stripe.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.stripe.cancelUrl}?order_id=${order.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    // Store session ID on order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return { checkoutUrl: session.url, orderId: order.id, orderNumber: order.orderNumber };
  }

  /**
   * Staff creates a payment link for an inquiry.
   */
  async createPaymentLinkForInquiry(data: CreatePaymentLinkInput, staffUserId: string) {
    const stripe = getStripe();

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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: data.customerEmail,
      client_reference_id: order.id,
      line_items: [
        {
          price_data: {
            currency: artwork.currency.toLowerCase(),
            product_data: {
              name: artwork.title,
              description: `By ${artwork.artist.name}`,
            },
            unit_amount: Math.round(parseFloat(artwork.price.toString()) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${config.stripe.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: config.stripe.cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return { checkoutUrl: session.url, orderId: order.id, orderNumber: order.orderNumber };
  }

  /**
   * Handle Stripe checkout.session.completed webhook.
   */
  async handleCheckoutCompleted(sessionId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: { items: true },
    });

    if (!order) {
      console.error(`Order not found for session: ${sessionId}`);
      return;
    }

    if (order.status === 'PAID') {
      return; // Already processed (idempotent)
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    await prisma.$transaction(async (tx) => {
      // Mark order as paid
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          stripePaymentIntentId: session.payment_intent as string,
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

    // Send email notifications (fire-and-forget)
    import('./email.service').then(({ emailService }) => {
      const emailData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName || 'Customer',
        customerEmail: order.customerEmail,
        items: order.items.map((item) => ({
          title: item.title, artistName: item.artistName,
          price: item.price.toString(), currency: item.currency,
        })),
        subtotal: order.subtotal.toString(),
        currency: order.currency,
      };
      emailService.sendOrderConfirmationEmail(emailData);
      emailService.sendNewOrderNotification(emailData);
    });

    // Reverse sync to Strapi (fire-and-forget)
    this.syncArtworkStatusToStrapi(order.items.map((i) => i.artworkId), 'SOLD');
  }

  /**
   * Handle Stripe checkout.session.expired webhook.
   */
  async handleCheckoutExpired(sessionId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
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

    // Reverse sync to Strapi (fire-and-forget)
    this.syncArtworkStatusToStrapi(order.items.map((i) => i.artworkId), 'AVAILABLE');
  }

  /**
   * Sync artwork status back to Strapi CMS.
   */
  private async syncArtworkStatusToStrapi(artworkIds: string[], status: string) {
    try {
      const artworks = await prisma.artwork.findMany({
        where: { id: { in: artworkIds }, strapiId: { not: null } },
        select: { strapiId: true },
      });

      for (const artwork of artworks) {
        if (artwork.strapiId) {
          strapiClient.updateArtwork(artwork.strapiId, { status }).catch((err) => {
            console.error(`Failed to reverse-sync artwork strapiId=${artwork.strapiId}:`, err);
          });
        }
      }
    } catch (err) {
      console.error('Failed to reverse-sync artwork status to Strapi:', err);
    }
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
