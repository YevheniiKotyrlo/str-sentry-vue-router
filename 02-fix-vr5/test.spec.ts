import { test, expect } from '@playwright/test';

test('Patched Sentry router guard does NOT trigger deprecation warning', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto('http://localhost:5181/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toHaveText('Home');

  // Patch should detect this is NOT a legacy router (VR5 has no 'mode' property)
  const initLog = logs.find((l) => l.includes('[sentry] isLegacyRouter:'));
  console.log('Init log:', initLog);
  expect(initLog).toContain('isLegacyRouter: false');

  logs.length = 0;

  await page.click('a[href="/about"]');
  await expect(page.locator('h1')).toHaveText('About');
  await page.waitForTimeout(500);

  // Guard should fire but NOT call next()
  const guardLog = logs.find((l) => l.includes('[sentry] beforeEach guard called'));
  console.log('Guard log:', guardLog);
  expect(guardLog).toBeTruthy();

  const nextLog = logs.find((l) => l.includes('[sentry] calling next()'));
  console.log('Next log:', nextLog);
  expect(nextLog).toBeUndefined();

  // No deprecation warnings
  const deprecation = logs.filter((l) => l.includes('next()') && l.includes('deprecated'));
  console.log('Deprecation warnings:', deprecation);
  expect(deprecation).toHaveLength(0);
});
