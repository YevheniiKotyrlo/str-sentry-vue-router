import { test, expect } from '@playwright/test';

test('Vue Router 3 with patched @sentry/vue: next() is called, navigation works', async ({
  page,
}) => {
  const logs: string[] = [];
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto('http://localhost:5183/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toHaveText('Home');

  // Patch should detect this IS a legacy router (VR3 has 'mode' property)
  const initLog = logs.find((l) => l.includes('[sentry-patch] isLegacyRouter:'));
  console.log('Init log:', initLog);
  expect(initLog).toContain('isLegacyRouter: true');

  logs.length = 0;

  // Navigate to About — this WILL STALL if the patched code doesn't call next()
  await page.click('a[href="/about"]');
  await expect(page.locator('h1')).toHaveText('About', { timeout: 3000 });

  // Guard should fire AND call next() for legacy router
  const guardLog = logs.find((l) => l.includes('[sentry-patch] beforeEach guard called'));
  console.log('Guard log:', guardLog);
  expect(guardLog).toBeTruthy();

  const nextLog = logs.find((l) => l.includes('[sentry-patch] calling next()'));
  console.log('Next log:', nextLog);
  expect(nextLog).toBeTruthy();

  logs.length = 0;

  // Navigate to Contact — second navigation to confirm it's not a one-off
  await page.click('a[href="/contact"]');
  await expect(page.locator('h1')).toHaveText('Contact', { timeout: 3000 });

  // No deprecation warnings
  const deprecation = logs.filter((l) => l.includes('next()') && l.includes('deprecated'));
  console.log('Deprecation warnings:', deprecation);
  expect(deprecation).toHaveLength(0);
});
