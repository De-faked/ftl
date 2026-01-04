import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Non-blocking accessibility report:
// - attaches violations JSON to the HTML report
// - does NOT fail the run yet (we can tighten later)
test('a11y report (non-blocking): /auth and /checkout (unauth)', async ({ page }, testInfo) => {
  for (const path of ['/auth', '/checkout']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();

    await testInfo.attach(`axe-${path.replaceAll('/', '_')}.json`, {
      body: Buffer.from(JSON.stringify(results.violations, null, 2)),
      contentType: 'application/json',
    });
  }

  expect(true).toBeTruthy();
});
