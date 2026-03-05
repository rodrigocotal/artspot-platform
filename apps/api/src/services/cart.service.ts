import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';

export class CartService {
  async getOrCreateCart(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async addItem(userId: string, artworkId: string) {
    // Validate artwork exists, is AVAILABLE, and has DIRECT purchase mode
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
      select: { id: true, status: true, purchaseMode: true },
    });

    if (!artwork) {
      throw new AppError('Artwork not found', 404);
    }
    if (artwork.status !== 'AVAILABLE') {
      throw new AppError('Artwork is not available for purchase', 400);
    }
    if (artwork.purchaseMode !== 'DIRECT') {
      throw new AppError('This artwork is inquiry-only and cannot be added to cart', 400);
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Check if already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_artworkId: { cartId: cart.id, artworkId } },
    });

    if (existing) {
      throw new AppError('Artwork is already in your cart', 409);
    }

    await prisma.cartItem.create({
      data: { cartId: cart.id, artworkId },
    });

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, artworkId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const item = await prisma.cartItem.findUnique({
      where: { cartId_artworkId: { cartId: cart.id, artworkId } },
    });

    if (!item) {
      throw new AppError('Item not found in cart', 404);
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async getItemCount(userId: string): Promise<number> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { _count: { select: { items: true } } },
    });

    return cart?._count?.items ?? 0;
  }

  async validateCartItems(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    const invalidItems: string[] = [];

    for (const item of cart.items) {
      if (item.artwork.status !== 'AVAILABLE' || item.artwork.purchaseMode !== 'DIRECT') {
        invalidItems.push(item.artwork.title);
      }
    }

    return { cart, invalidItems };
  }
}

export const cartService = new CartService();
