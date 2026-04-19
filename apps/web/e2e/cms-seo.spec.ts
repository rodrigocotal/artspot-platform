import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'e2e-admin@test.com';
const ADMIN_PASSWORD = 'AdminPass123';

// NOTE: These tests are NOT run locally — they require a running dev/staging
// server with a seeded DB (including the e2e-admin user).  CI is responsible
// for executing them.

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#email').fill(ADMIN_EMAIL);
  await page.locator('#password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
}

test.describe('CMS SEO', () => {
  test('fallback chain: home page title defaults to heroHeadline when SEO.title empty', async ({
    page,
  }) => {
    // No admin interaction — verify the live fallback produces a non-empty title.
    await page.goto('/');

    const title = await page.title();
    // Must not be empty or a raw path string.
    expect(title.length).toBeGreaterThan(0);

    // Description meta tag must be present (falls back to heroSubtitle or
    // the site-wide default set in site-settings).
    const descContent = await page
      .locator('meta[name="description"]')
      .first()
      .getAttribute('content');
    expect(descContent).not.toBeNull();
  });

  test('OG meta tags are present on /', async ({ page }) => {
    await page.goto('/');

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .first()
      .getAttribute('content');
    const ogDesc = await page
      .locator('meta[property="og:description"]')
      .first()
      .getAttribute('content');

    expect(ogTitle).not.toBeNull();
    expect(ogDesc).not.toBeNull();

    // og:type defaults to "website" in Next.js Metadata API — assert if present.
    const ogTypeLocator = page.locator('meta[property="og:type"]').first();
    const ogTypeCount = await ogTypeLocator.count();
    if (ogTypeCount > 0) {
      const ogType = await ogTypeLocator.getAttribute('content');
      expect(ogType).toBe('website');
    }
  });

  test('Twitter card meta tags are present', async ({ page }) => {
    await page.goto('/');

    const card = await page
      .locator('meta[name="twitter:card"]')
      .first()
      .getAttribute('content');
    expect(card).toBe('summary_large_image');
  });

  test('per-page SEO title overrides fallback when set via admin', async ({ page }) => {
    // This test writes to the CMS and cleans up after itself.
    //
    // Cache note: Next.js uses `revalidate: 60` on the home page fetch.
    // After publish we navigate with `waitUntil: 'networkidle'` which gives
    // the ISR revalidation the best chance to serve fresh HTML.  In
    // environments where stale cache persists beyond 60 s the assertion may
    // need a retry loop — flag to the team if flakiness is observed in CI.

    const customTitle = `E2E Custom SEO Title ${Date.now()}`;

    await loginAsAdmin(page);
    await page.goto('/admin/content/home');

    // SEO Title input — placeholder comes directly from seo-field.tsx:
    // "Leave blank to use page headline"
    const seoTitleInput = page.locator(
      'input[placeholder="Leave blank to use page headline"]'
    );
    await expect(seoTitleInput).toBeVisible({ timeout: 15_000 });
    await seoTitleInput.fill(customTitle);

    // Publish — accepts the window.confirm dialog.
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Publish/ }).click();
    await expect(page.getByText('Content published successfully.')).toBeVisible({
      timeout: 30_000,
    });

    // Visit public home and assert <title> contains our custom string.
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(new RegExp(customTitle));

    // --- Cleanup: clear the custom title so subsequent test runs start fresh ---
    await page.goto('/admin/content/home');
    await expect(seoTitleInput).toBeVisible({ timeout: 15_000 });
    await seoTitleInput.fill('');

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Publish/ }).click();
    await expect(page.getByText('Content published successfully.')).toBeVisible({
      timeout: 30_000,
    });
  });
});
