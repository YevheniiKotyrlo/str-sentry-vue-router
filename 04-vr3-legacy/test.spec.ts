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

  // Verify legacy router was detected via our console.log in main.ts
  const modeLog = logs.find((l) => l.includes("'mode' in router: true"));
  console.log('Mode detection log:', modeLog);
  expect(modeLog).toBeTruthy();

  // Navigate to About — this WILL STALL if the patched code doesn't call next()
  // Vue Router 3 requires next() to resolve navigation guards
  await page.click('a[href="/about"]');
  await expect(page.locator('h1')).toHaveText('About', { timeout: 3000 });

  // Navigate to Contact — second navigation to confirm it's not a one-off
  await page.click('a[href="/contact"]');
  await expect(page.locator('h1')).toHaveText('Contact', { timeout: 3000 });

  // No deprecation warnings should appear (patched code avoids calling next() on modern routers,
  // but VR3 doesn't have withDeprecationWarning anyway — the key test is that navigation resolves)
  const deprecation = logs.filter(
    (l) => l.includes('next()') && l.includes('deprecated'),
  );
  console.log('Deprecation warnings:', deprecation);
  expect(deprecation).toHaveLength(0);
});
