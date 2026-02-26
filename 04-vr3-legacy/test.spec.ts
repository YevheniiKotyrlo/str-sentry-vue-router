import { test, expect } from '@playwright/test';

test('Vue Router 3 with patched instrumentation: next() is called, navigation works', async ({
  page,
}) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') errors.push(text);
  });

  await page.goto('http://localhost:5183/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toHaveText('Home');

  // Verify legacy router was detected
  const modeLog = logs.find((l) => l.includes("'mode' in router: true"));
  console.log('Mode detection log:', modeLog);
  expect(modeLog).toBeTruthy();

  // Verify guard Function.length === 2
  const lengthLog = logs.find((l) => l.includes('Guard Function.length'));
  console.log('Function.length log:', lengthLog);
  expect(lengthLog).toContain('2');

  // Navigate to About — this WILL STALL if next() is not called
  await page.click('a[href="/about"]');
  await expect(page.locator('h1')).toHaveText('About', { timeout: 3000 });

  // Verify next() was called
  const nextLog = logs.find((l) => l.includes('Called next() for legacy router'));
  console.log('next() call log:', nextLog);
  expect(nextLog).toBeTruthy();

  // Navigate to Contact
  await page.click('a[href="/contact"]');
  await expect(page.locator('h1')).toHaveText('Contact', { timeout: 3000 });

  // Verify the instrument log via window.__instrumentLog
  const instrumentLog = await page.evaluate(() => (window as any).__instrumentLog());
  console.log('Instrument log:', JSON.stringify(instrumentLog, null, 2));

  // Should have entries for navigations (initial pageload + 2 navigations)
  expect(instrumentLog.length).toBeGreaterThanOrEqual(2);

  // Every entry should show legacy router detected and next() called
  for (const entry of instrumentLog) {
    expect(entry.isLegacyRouter).toBe(true);
    expect(entry.calledNext).toBe(true);
    expect(entry.guardFnLength).toBe(2);
  }

  // No errors should have occurred
  const instrumentErrors = errors.filter((e) => e.includes('[instrument]'));
  expect(instrumentErrors).toHaveLength(0);
});
