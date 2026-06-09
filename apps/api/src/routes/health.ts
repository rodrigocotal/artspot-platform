import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router: Router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  res.status(200).json({
    success: true,
    message: 'ArtAldo API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
  });
});

/**
 * @route   GET /health/db
 * @desc    Database health check
 * @access  Public
 */
router.get('/db', async (_req: Request, res: Response) => {
  try {
    // Query database to verify connection
    await prisma.$queryRaw`SELECT 1`;

    // This is a public, unauthenticated endpoint — do not disclose row counts
    // or other internal stats here.
    res.status(200).json({
      success: true,
      message: 'Database connection healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        provider: 'postgresql',
      },
    });
  } catch (error) {
    // Log the detail server-side; return a generic message so a public caller
    // can't read raw DB errors (which may include connection-string fragments).
    console.error('[health/db] database health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

export default router;
