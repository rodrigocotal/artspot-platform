import { test, expect } from '@playwright/test';
import { registerTestUser, loginTestUser } from './helpers/test-utils';

test.describe('Authentication', () => {
  test('register page loads with form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
  });

  test('login page loads with form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('register a new user and redirect to home', async ({ page }) => {
    const email = `e2e-reg-${Date.now()}@test.com`;

    await page.goto('/register');
    await page.getByLabel('Name').fill('E2E Registration Test');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('TestPass123');
    await page.getByLabel('Confirm Password').fill('TestPass123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should redirect to home or login after registration
    await page.waitForURL((url) => !url.pathname.includes('/register'), {
      timeout: 15_000,
    });
  });

  test('login with valid credentials', async ({ page }) => {
    const user = await registerTestUser();
    await loginTestUser(page, user);

    // Should be on home page after login
    await expect(page).toHaveURL('/');
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('nonexistent@test.com');
    await page.getByLabel('Password').fill('WrongPassword123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Invalid email or password');
  });

  test('protected route redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/favorites');

    // Middleware should redirect to /login with callbackUrl
    await page.waitForURL(/\/login/, { timeout: 10_000 });
  });

  test('navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Create one' }).click();
    await expect(page).toHaveURL('/register');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
  });
});
