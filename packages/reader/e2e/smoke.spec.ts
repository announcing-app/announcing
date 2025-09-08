import { expect, test } from '@playwright/test';

test('homepage has expected title and screenshot', async ({ page }) => {
  await page.goto('/');

  // Wait for the main title to be visible before taking a screenshot.
  await expect(page.locator('div.container > div.title')).toBeVisible();

  await expect(page).toHaveTitle(/Announcing/);
  await expect(page).toHaveScreenshot();
});
