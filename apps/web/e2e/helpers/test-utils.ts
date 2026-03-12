import type { Page } from '@playwright/test';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let userCounter = 0;

/** Generate a unique test email */
function uniqueEmail(): string {
  return `e2e-user-${Date.now()}-${++userCounter}@test.com`;
}

/** Register a fresh test user via the API and return credentials */
export async function registerTestUser(overrides?: {
  name?: string;
  email?: string;
  password?: string;
}) {
  const name = overrides?.name ?? 'E2E Test User';
  const email = overrides?.email ?? uniqueEmail();
  const password = overrides?.password ?? 'TestPass123';

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to register test user: ${res.status} ${body}`);
  }

  return { name, email, password };
}

/** Log in a test user via the UI (fills form and submits) */
export async function loginTestUser(
  page: Page,
  credentials: { email: string; password: string }
) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect away from login page
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 10_000,
  });
}
