import express, { Express, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { errorHandler } from './middleware/error-handler';
import healthRouter from './routes/health';
import pagePublicRouter from './routes/page-public';
import { authLimiter, inquiryLimiter, contactLimiter, generalLimiter } from './middleware/rate-limit';

const app: Express = express();

const lazyRoute = (loadRouter: () => Promise<{ default: RequestHandler }>): RequestHandler => {
  return async (req, res, next) => {
    try {
      const router = await loadRouter();
      return router.default(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};

// Trust the App Runner / load-balancer proxy so req.ip is the real client IP
// (from X-Forwarded-For), not the proxy's link-local address. Without this,
// per-IP rate limiting buckets ALL users together. '1' = trust one proxy hop.
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration. With an explicit allow-list we reflect the origin and
// allow credentials. With wildcard ('*') we must NOT allow credentials —
// reflecting any origin + credentials would let any site make credentialed
// cross-origin requests. (The API is Bearer-token based, so this is safe.)
const corsWildcard = config.allowedOrigins === '*';
app.use(
  cors({
    origin: corsWildcard ? true : config.allowedOrigins,
    credentials: !corsWildcard,
  })
);

// Stripe webhook needs raw body for signature verification — must be before express.json()
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (skip in test environment)
if (config.nodeEnv !== 'test') {
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }
}

// Rate limiting (skip in test environment)
if (config.nodeEnv !== 'test') {
  app.use('/auth', authLimiter);
  app.use('/inquiries', inquiryLimiter);
  app.use('/contact', contactLimiter);
  app.use(generalLimiter);
}

// Routes
app.use('/docs', lazyRoute(() => import('./routes/docs')));
app.use('/health', healthRouter);
app.use('/auth', lazyRoute(() => import('./routes/auth')));
app.use('/upload', lazyRoute(() => import('./routes/upload')));
app.use('/artworks', lazyRoute(() => import('./routes/artworks')));
app.use('/artists', lazyRoute(() => import('./routes/artists')));
app.use('/collections', lazyRoute(() => import('./routes/collections')));
app.use('/favorites', lazyRoute(() => import('./routes/favorites')));
app.use('/inquiries', lazyRoute(() => import('./routes/inquiries')));
app.use('/contact', lazyRoute(() => import('./routes/contact')));
app.use('/webhooks', lazyRoute(() => import('./routes/webhooks')));
app.use('/articles', lazyRoute(() => import('./routes/articles')));
app.use('/activity', lazyRoute(() => import('./routes/activity')));
app.use('/pages', pagePublicRouter);
app.use('/pages', lazyRoute(() => import('./routes/page-contents')));
app.use('/cart', lazyRoute(() => import('./routes/cart')));
app.use('/orders', lazyRoute(() => import('./routes/orders')));
app.use('/admin', lazyRoute(() => import('./routes/admin')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
