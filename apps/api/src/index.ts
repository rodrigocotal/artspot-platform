import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST before any other imports
// Use process.cwd() which is the directory where the command was run
dotenv.config({ path: path.join(process.cwd(), '.env') });

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { disconnectDatabase } from './config/database';
import { errorHandler } from './middleware/error-handler';
import healthRouter from './routes/health';
import uploadRouter from './routes/upload';
import artworksRouter from './routes/artworks';
import artistsRouter from './routes/artists';
import collectionsRouter from './routes/collections';
import { initializeCloudinary } from './config/cloudinary';

// Initialize Cloudinary AFTER env vars are loaded
initializeCloudinary();

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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/health', healthRouter);
app.use('/upload', uploadRouter);
app.use('/artworks', artworksRouter);
app.use('/artists', artistsRouter);
app.use('/collections', collectionsRouter);

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

// Start server
const server = app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎨 ArtSpot API Server                              ║
║                                                       ║
║   Environment: ${config.nodeEnv.padEnd(37)}║
║   Port:        ${config.port.toString().padEnd(37)}║
║   URL:         ${config.apiUrl.padEnd(37)}║
║                                                       ║
║   Status:      ✓ Running                             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await disconnectDatabase();
    console.log('Database disconnected');
  });
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await disconnectDatabase();
    console.log('Database disconnected');
    process.exit(0);
  });
});

export default app;
