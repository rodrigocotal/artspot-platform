import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/database';
import { getStripe } from '../config/stripe';
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

    // Guard against mixed currencies (Stripe rejects mixed-currency sessions)
    const currencies = new Set(
      cart.items.map((item) => item.artwork.currency)
    );
    if (currencies.size > 1) {
      throw new AppError('Cart contains mixed currencies', 400);
    }

    // Atomically reserve artworks using a transaction
    const artworkIds = cart.items.map((item) => item.artworkId);

    const order = await prisma.$transaction(async (tx) => {
      // Atomically reserve each artwork: only flips AVAILABLE -> RESERVED.
      // A count !== 1 means it was already reserved/sold by a concurrent
      // checkout, so we throw to roll back the whole transaction.
      for (const artworkId of artworkIds) {
        const reserved = await tx.artwork.updateMany({
          where: { id: artworkId, status: 'AVAILABLE' },
          data: { status: 'RESERVED' },
        });

        if (reserved.count !== 1) {
          throw new AppError('Artwork no longer available', 409);
        }
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

    // Atomically reserve the artwork and create the order in one transaction
    // so a failed order create never leaves the artwork orphaned in RESERVED.
    const order = await prisma.$transaction(async (tx) => {
      const reserved = await tx.artwork.updateMany({
        where: { id: data.artworkId, status: 'AVAILABLE' },
        data: { status: 'RESERVED' },
      });

      if (reserved.count !== 1) {
        throw new AppError('Artwork no longer available', 409);
      }

      return tx.order.create({
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

    // Only fulfill orders still awaiting payment. PAID is idempotent; CANCELLED
    // means the user cancelled (or the session expired) and released the
    // reservation — never resurrect it into PAID/SOLD (would double-sell).
    if (order.status !== 'PENDING') {
      return;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Only fulfill once payment has actually settled. Async payment methods
    // can complete the session while still 'unpaid'/'no_payment_required'.
    if (session.payment_status !== 'paid') {
      return;
    }

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

  }

  /**
   * User cancels their own still-pending checkout (e.g. they backed out of the
   * Stripe page). Releases the reservation immediately instead of waiting the
   * 30-minute session-expiry window, restores their cart, and cancels the order.
   *
   * Race-safe: the atomic PENDING->CANCELLED flip means that if the webhook
   * already marked the order PAID, we do nothing and never release a sold
   * artwork. Combined with the PENDING-only guard in handleCheckoutCompleted,
   * a late payment into a cancelled order is never fulfilled.
   */
  async cancelPendingOrder(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    // Idempotent / no-op for orders that aren't awaiting payment.
    if (order.status !== 'PENDING') {
      return order;
    }

    // Best-effort: expire the Stripe session so it can't be paid after cancel.
    if (order.stripeCheckoutSessionId) {
      try {
        const stripe = getStripe();
        await stripe.checkout.sessions.expire(order.stripeCheckoutSessionId);
      } catch {
        // Session may already be completed/expired — the atomic guard below and
        // the PENDING-only webhook fulfillment keep us safe regardless.
      }
    }

    await prisma.$transaction(async (tx) => {
      // Atomic critical section: only the cancel OR the webhook can flip away
      // from PENDING. count === 0 means the webhook won (order is PAID) — bail
      // without releasing anything.
      const cancelled = await tx.order.updateMany({
        where: { id: order.id, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      });

      if (cancelled.count !== 1) {
        return;
      }

      // Release reserved artworks (only those still RESERVED — never touch SOLD).
      for (const item of order.items) {
        await tx.artwork.updateMany({
          where: { id: item.artworkId, status: 'RESERVED' },
          data: { status: 'AVAILABLE' },
        });
      }

      // Restore the user's cart so they can retry checkout.
      const cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });
      await tx.cartItem.createMany({
        data: order.items.map((item) => ({ cartId: cart.id, artworkId: item.artworkId })),
        skipDuplicates: true,
      });
    });

    return prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
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

  /**
   * Look up the order tied to a specific Stripe checkout session (owner-scoped).
   * Used by the success page so it shows the exact order just paid, instead of
   * guessing "the most recent order".
   */
  async getOrderByCheckoutSession(sessionId: string, userId: string) {
    const order = await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
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

    if (!order || order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export const orderService = new OrderService();
