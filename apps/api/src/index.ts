import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST before any other imports
// Use process.cwd() which is the directory where the command was run
dotenv.config({ path: path.join(process.cwd(), '.env') });

import app from './app';
import { config } from './config/environment';
import { disconnectDatabase } from './config/database';

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
