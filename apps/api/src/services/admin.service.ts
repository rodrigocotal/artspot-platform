import { prisma } from '../config/database';
import { AppError } from '../middleware/error-handler';
import type {
  ListAdminOrdersQuery,
  UpdateOrderStatusInput,
  ListAdminUsersQuery,
  UpdateUserRoleInput,
} from '../validators/admin.validator';

export class AdminService {
  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalArtworks,
      pendingInquiries,
      totalOrders,
      revenue,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.artwork.count(),
      prisma.inquiry.count({ where: { status: 'PENDING' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { subtotal: true },
        where: { status: 'PAID' },
      }),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]);

    return {
      totalUsers,
      totalArtworks,
      pendingInquiries,
      totalOrders,
      totalRevenue: revenue._sum.subtotal?.toString() || '0',
      recentOrders,
      recentUsers,
    };
  }

  async getAllOrders(query: ListAdminOrdersQuery) {
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

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
          user: { select: { id: true, email: true, name: true } },
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

  async updateOrderStatus(orderId: string, data: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Validate transitions
    if (data.status === 'CANCELLED' && order.status !== 'PENDING') {
      throw new AppError('Only pending orders can be cancelled', 400);
    }
    if (data.status === 'REFUNDED' && order.status !== 'PAID') {
      throw new AppError('Only paid orders can be refunded', 400);
    }

    const updated = await prisma.$transaction(async (tx: any) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: data.status },
        include: {
          items: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });

      // Un-reserve artworks on cancel (same pattern as handleCheckoutExpired)
      if (data.status === 'CANCELLED') {
        for (const item of order.items) {
          await tx.artwork.update({
            where: { id: item.artworkId },
            data: { status: 'AVAILABLE' },
          });
        }
      }

      return updatedOrder;
    });

    return updated;
  }

  async getAllUsers(query: ListAdminUsersQuery) {
    const { page, limit, search, role } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { orders: true, inquiries: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, data: UpdateUserRoleInput, requestingUserId: string) {
    if (userId === requestingUserId) {
      throw new AppError('Cannot change your own role', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: data.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true, inquiries: true } },
      },
    });

    return updated;
  }
}

export const adminService = new AdminService();
