import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { errorHandler } from './middleware/error-handler';
import healthRouter from './routes/health';
import uploadRouter from './routes/upload';
import artworksRouter from './routes/artworks';
import artistsRouter from './routes/artists';
import collectionsRouter from './routes/collections';
import authRouter from './routes/auth';
import favoritesRouter from './routes/favorites';
import inquiriesRouter from './routes/inquiries';
import webhooksRouter from './routes/webhooks';
import articlesRouter from './routes/articles';
import pageContentsRouter from './routes/page-contents';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import { initializeCloudinary } from './config/cloudinary';

// Initialize Cloudinary (skip in test environment)
if (config.nodeEnv !== 'test') {
  initializeCloudinary();
}

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration — origin: true reflects the request origin (compatible with credentials)
app.use(
  cors({
    origin: config.allowedOrigins === '*' ? true : config.allowedOrigins,
    credentials: true,
  })
);

// Square webhook needs raw body for signature verification — must be before express.json()
app.use('/webhooks/square', express.raw({ type: 'application/json' }));

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

// Routes
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/artworks', artworksRouter);
app.use('/artists', artistsRouter);
app.use('/collections', collectionsRouter);
app.use('/favorites', favoritesRouter);
app.use('/inquiries', inquiriesRouter);
app.use('/webhooks', webhooksRouter);
app.use('/articles', articlesRouter);
app.use('/pages', pageContentsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

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
