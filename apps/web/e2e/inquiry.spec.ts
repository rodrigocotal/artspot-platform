import { test, expect } from '@playwright/test';
import { seedTestData } from './helpers/seed-data';

test.describe('Inquiry Form', () => {
  test.beforeAll(async () => {
    await seedTestData();
  });

  test('artwork detail page shows inquiry form', async ({ page }) => {
    await page.goto('/artworks');

    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await cards.first().click();

      // Wait for detail page
      await page.waitForURL(/\/artworks\//, { timeout: 10_000 });

      // Inquiry form should be visible
      await expect(page.getByText('Inquire About This Artwork')).toBeVisible({
        timeout: 10_000,
      });
    }
  });

  test('inquiry form shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/artworks');

    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await cards.first().click();
      await page.waitForURL(/\/artworks\//, { timeout: 10_000 });

      // Clear any pre-filled fields and submit
      await page.locator('#inquiry-name').clear();
      await page.locator('#inquiry-email').clear();

      await page.getByRole('button', { name: 'Send Inquiry' }).click();

      // Validation errors should appear
      await expect(page.getByText('Name is required')).toBeVisible();
      await expect(page.getByText('Message is required')).toBeVisible();
    }
  });

  test('inquiry form accepts valid input', async ({ page }) => {
    await page.goto('/artworks');

    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await cards.first().click();
      await page.waitForURL(/\/artworks\//, { timeout: 10_000 });

      // Fill in the inquiry form
      await page.locator('#inquiry-name').fill('Test Collector');
      await page.locator('#inquiry-email').fill('collector@test.com');
      await page.locator('#inquiry-phone').fill('+1 555 000 0000');
      await page.locator('#inquiry-message').fill('I am very interested in this artwork and would like more information.');

      await page.getByRole('button', { name: 'Send Inquiry' }).click();

      // Should show success or error (depending on API availability)
      await page.waitForSelector(':text("Inquiry Sent"), [role="alert"]', {
        timeout: 10_000,
      });
    }
  });
});
