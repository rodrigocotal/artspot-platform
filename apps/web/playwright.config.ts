import { defineConfig, devices } from '@playwright/test';

const API_PORT = 4000;
const WEB_PORT = 3000;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: [
    {
      command: `pnpm --filter @artspot/api dev`,
      port: API_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        NODE_ENV: 'test',
        ...(process.env.DATABASE_URL && { DATABASE_URL: process.env.DATABASE_URL }),
        ...(process.env.JWT_SECRET && { JWT_SECRET: process.env.JWT_SECRET }),
        ...(process.env.JWT_REFRESH_SECRET && { JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET }),
        ...(process.env.ALLOWED_ORIGINS && { ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS }),
      },
    },
    {
      command: `pnpm --filter @artspot/web dev`,
      port: WEB_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        NEXT_PUBLIC_API_URL: `http://localhost:${API_PORT}`,
        ...(process.env.AUTH_SECRET && { AUTH_SECRET: process.env.AUTH_SECRET }),
        ...(process.env.NEXTAUTH_SECRET && { NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET }),
      },
    },
  ],
});
