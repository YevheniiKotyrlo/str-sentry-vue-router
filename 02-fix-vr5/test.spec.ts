import { test, expect } from '@playwright/test';

test('Patched Sentry router guard does NOT trigger deprecation warning', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'warning') warnings.push(msg.text());
  });

  await page.goto('http://localhost:5181/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toHaveText('Home');
  warnings.length = 0;

  await page.click('a[href="/about"]');
  await expect(page.locator('h1')).toHaveText('About');
  await page.waitForTimeout(500);

  const deprecation = warnings.filter((w) => w.includes('next()') && w.includes('deprecated'));
  console.log('Warnings:', deprecation);
  expect(deprecation.length).toBe(0);
});
