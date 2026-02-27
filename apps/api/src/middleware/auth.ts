import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { prisma } from '../config/database';
import { AppError } from './error-handler';

/**
 * Authenticate middleware — verifies JWT access token from Authorization header.
 * Sets req.userId and req.userRole on success.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = header.slice(7);

  try {
    const payload = authService.verifyAccessToken(token);
    (req as any).userId = payload.sub;
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}

/**
 * Authorize middleware — checks that the authenticated user has one of the allowed roles.
 * Must be used AFTER authenticate middleware.
 */
export function authorize(...roles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    if (!userId) {
      return next(new AppError('Authentication required', 401));
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (!roles.includes(user.role)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      (req as any).userRole = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
}
