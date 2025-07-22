import { test, expect } from '@playwright/test';

test('simple test', async ({ page }) => {
  await page.goto('/');

  // Check initial state
  await expect(page.locator('button', { hasText: '🇫🇷' })).toBeVisible();
});
