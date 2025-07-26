import test, { expect } from '@playwright/test';

test('top', async ({ page }) => {
  await page.goto('/');
  await page.waitForURL('/signin');
  await page.locator('.buttons').waitFor();

  await expect(page).toHaveScreenshot();
});
