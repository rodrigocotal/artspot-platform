import { test, expect } from '@playwright/test';
import { seedTestData } from './helpers/seed-data';

test.describe('Browse & Navigation', () => {
  test.beforeAll(async () => {
    await seedTestData();
  });

  test('home page loads with header and logo', async ({ page }) => {
    await page.goto('/');
    // Use first() since logo link appears in both desktop and mobile nav
    await expect(page.getByRole('link', { name: 'ArtSpot' }).first()).toBeVisible();
  });

  test('header navigation links are visible on desktop', async ({ page, browserName }) => {
    // Skip on mobile viewports — nav links are in hamburger menu
    test.skip(browserName !== 'chromium' && page.viewportSize()!.width < 768, 'Desktop-only test');

    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    // Artworks is a top-level nav item (dropdown parent)
    await expect(page.getByRole('link', { name: 'Artworks' }).first()).toBeVisible();
  });

  test('artworks page loads and shows heading', async ({ page }) => {
    await page.goto('/artworks');
    await expect(page.getByRole('heading', { name: 'Explore Artworks' })).toBeVisible();
  });

  test('artworks page shows filter sidebar on desktop', async ({ page }) => {
    // Filters sidebar may be hidden on mobile
    test.skip(page.viewportSize()!.width < 768, 'Desktop-only test');

    await page.goto('/artworks');
    await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible();
    await expect(page.getByText('Painting')).toBeVisible();
  });

  test('search input accepts text', async ({ page }) => {
    await page.goto('/artworks');
    const searchInput = page.getByPlaceholder('Search artworks...');
    await searchInput.fill('abstract');
    await expect(searchInput).toHaveValue('abstract');
  });

  test('artwork card links to detail page', async ({ page }) => {
    await page.goto('/artworks');

    // Wait for cards to load (either cards appear or "No artworks found")
    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const firstCard = cards.first();
      const href = await firstCard.getAttribute('href');
      expect(href).toMatch(/^\/artworks\//);
    }
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL('/contact');
  });
});
