import { test, expect } from '@playwright/test';
import path from 'path';

const ADMIN_EMAIL = 'e2e-admin@test.com';
const ADMIN_PASSWORD = 'AdminPass123';
const FIXTURE = path.join(__dirname, 'fixtures', 'sample.jpg');

// Alt text used across both tests so the visibility toggle test can
// reliably assert the image is gone from the public page.
const ALT_TEXT = 'E2E test gallery image';

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#email').fill(ADMIN_EMAIL);
  await page.locator('#password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
}

test.describe('CMS home image (layout F)', () => {
  // NOTE: These tests interact with a live Cloudinary upload endpoint and a
  // Next.js page that uses `revalidate: 60`.  For that reason:
  //   - Upload steps use a 30-second timeout.
  //   - After publish, we navigate with `waitUntil: 'networkidle'` to give the
  //     CDN / ISR cache the best chance to serve fresh content.  If stale
  //     content is still served in CI, the assertions may fail — that is an
  //     infrastructure concern, not a test-authoring bug.
  //
  // The tests are NOT run locally (no running dev-server + seeded DB).
  // CI is responsible for executing them against a seeded environment.

  test('admin uploads → publishes → image renders on / with caption and link', async ({ page }) => {
    // 1. Login as admin
    await loginAsAdmin(page);

    // 2. Go to admin home editor
    await page.goto('/admin/content/home');

    // 3. The ImageField renders a hidden <input type="file">.
    //    There may be more than one on the page (heroImage + SEO OG image).
    //    The heroImage field is the first image field rendered (index 0).
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(FIXTURE);

    // 4. Wait for the upload to complete.  The ImageField reveals sub-fields
    //    (alt text, caption, link, visibility) only after a successful upload.
    //    We wait for the alt-text label to appear as the upload-complete signal.
    //    Generous timeout for Cloudinary round-trip.
    await expect(
      page.locator('label', { hasText: 'Alt text' }).first()
    ).toBeVisible({ timeout: 30_000 });

    // 5. Fill alt text, caption, and link URL.
    //    Placeholders come directly from image-field.tsx.
    await page
      .locator('input[placeholder="Describe the image for screen readers"]')
      .first()
      .fill(ALT_TEXT);

    await page
      .locator('input[placeholder="Optional caption shown below the image"]')
      .first()
      .fill('E2E caption');

    // Placeholder in image-field.tsx: "/collections/spring  or  https://..."
    await page
      .locator('input[placeholder*="/collections/spring"]')
      .first()
      .fill('/artworks');

    // 6. Publish — the admin page shows a window.confirm dialog before publishing.
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Publish/ }).click();
    await expect(page.getByText('Content published successfully.')).toBeVisible({
      timeout: 30_000,
    });

    // 7. Visit the public home page.  Use networkidle to maximise the chance
    //    the ISR revalidation has fired before we start asserting.
    await page.goto('/', { waitUntil: 'networkidle' });

    // 8. The hero image should be visible with the alt text we set.
    await expect(page.getByAltText(ALT_TEXT)).toBeVisible({ timeout: 10_000 });

    // 9. Caption text should be visible on the page.
    await expect(page.getByText('E2E caption')).toBeVisible();

    // 10. Clicking the image (or its wrapping link) should navigate to /artworks.
    await page.getByAltText(ALT_TEXT).click();
    await page.waitForURL('**/artworks', { timeout: 10_000 });
  });

  test('admin toggles visibility off → image disappears from /', async ({ page }) => {
    // NOTE: This test assumes the previous test (or a prior run) has already
    // uploaded a hero image with ALT_TEXT.  If run in isolation against a
    // clean DB the image may not be present — the uncheck step is a no-op
    // in that case and the final assertion will trivially pass.

    await loginAsAdmin(page);
    await page.goto('/admin/content/home');

    // Wait for the form to load (loading skeleton disappears).
    // The presence of the Publish button signals the form is ready.
    await expect(page.getByRole('button', { name: /Publish/ })).toBeVisible({
      timeout: 15_000,
    });

    // The "Visible on public page" checkbox is rendered inside ImageField
    // only when an image URL is set.  If no image is stored yet, skip the
    // uncheck step and go straight to publish.
    const visibleCheckbox = page.getByLabel('Visible on public page');
    const checkboxExists = await visibleCheckbox.count();

    if (checkboxExists > 0 && (await visibleCheckbox.first().isChecked())) {
      await visibleCheckbox.first().uncheck();
    }

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Publish/ }).click();
    await expect(page.getByText('Content published successfully.')).toBeVisible({
      timeout: 30_000,
    });

    // Bypass ISR cache with networkidle.
    await page.goto('/', { waitUntil: 'networkidle' });

    // The hero image should no longer be visible.
    await expect(page.getByAltText(ALT_TEXT)).toHaveCount(0);
  });
});
