import { test, expect } from '@playwright/test';

test('language switcher', async ({ page }) => {
  await page.goto('/');

  // Check initial state
  await expect(page.getByTestId('language-switcher-button')).toHaveText('🇫🇷');

  // Switch to French
  await page.getByTestId('language-switcher-button').click();
  const lang = await page.evaluate(() => localStorage.getItem('lang'));
  expect(lang).toBe('fr');
  await expect(page.getByTestId('language-switcher-button')).toHaveText('🇬🇧');


  // Switch back to English
  await page.getByTestId('language-switcher-button').click();
  const lang2 = await page.evaluate(() => localStorage.getItem('lang'));
  expect(lang2).toBe('en');
  await expect(page.getByTestId('language-switcher-button')).toHaveText('🇫🇷');
});
