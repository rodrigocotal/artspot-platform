import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';

export default async function globalSetup() {
  // Load test environment variables
  dotenv.config({ path: path.join(__dirname, '../../.env.test') });

  console.log('\n🧪 Global setup: Resetting test database...');

  // Reset test database schema
  execSync('npx prisma db push --force-reset --accept-data-loss', {
    cwd: path.join(__dirname, '../..'),
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
      // Prisma AI safety guard consent for test database reset
      PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes',
    },
    stdio: 'pipe',
  });

  console.log('✓ Test database ready\n');
}
