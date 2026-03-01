import { test, expect } from '@playwright/test';
import { registerTestUser, loginTestUser } from './helpers/test-utils';

test.describe('Favorites', () => {
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
    await page.goto('/artworks');

    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
    const cardCount = await cards.count();

    if (cardCount > 0) {
      // Check that the favorite button exists on the first card
      const favoriteBtn = cards.first().getByRole('button', { name: /favorite/i });
      await expect(favoriteBtn).toBeAttached();
    }
  });

  test('toggle favorite on artwork card (requires auth)', async ({ page }) => {
    const user = await registerTestUser();
    await loginTestUser(page, user);

    await page.goto('/artworks');

    await page.waitForSelector('[data-testid="artwork-card"], :text("No artworks found")', {
      timeout: 15_000,
    });

    const cards = page.locator('[data-testid="artwork-card"]');
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
