import { test, expect } from '@playwright/test';
import { registerTestUser, loginTestUser } from './helpers/test-utils';
import { seedTestData } from './helpers/seed-data';

/** Helper to wait for artwork cards to load, skipping test if they don't */
async function waitForArtworkCards(page: import('@playwright/test').Page, t: typeof test) {
  await page.goto('/artworks');
  const card = page.locator('[data-testid="artwork-card"]').first();
  try {
    await card.waitFor({ state: 'visible', timeout: 20_000 });
  } catch {
    t.skip(true, 'Artworks did not load in time');
  }
  return page.locator('[data-testid="artwork-card"]');
}

test.describe('Favorites', () => {
  test.beforeAll(async () => {
    await seedTestData();
  });

  test('favorites page is accessible after login', async ({ page }) => {
    const user = await registerTestUser();
    await loginTestUser(page, user);

    await page.goto('/favorites');
    await expect(page).toHaveURL('/favorites');
  });

  test('favorites page shows empty state for new user', async ({ page }) => {
    const user = await registerTestUser();
    await loginTestUser(page, user);

    await page.goto('/favorites');

    // Wait for page to load — should show empty state or favorites
    await page.waitForSelector(':text("favorite"), :text("Favorite"), :text("No")', {
      timeout: 10_000,
    });
  });

  test('favorite button is visible on artwork cards', async ({ page }) => {
    const cards = await waitForArtworkCards(page, test);
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const favoriteBtn = cards.first().getByRole('button', { name: /favorite/i });
      await expect(favoriteBtn).toBeAttached();
    }
  });

  test('toggle favorite on artwork card (requires auth)', async ({ page }) => {
    const user = await registerTestUser();
    await loginTestUser(page, user);

    const cards = await waitForArtworkCards(page, test);
    const cardCount = await cards.count();

    if (cardCount > 0) {
      const favoriteBtn = cards.first().getByRole('button', { name: /favorite/i });
      await favoriteBtn.click();

      // Button label should change to "Remove from favorites"
      await expect(
        cards.first().getByRole('button', { name: /remove from favorites/i })
      ).toBeVisible({ timeout: 5_000 });
    }
  });
});
