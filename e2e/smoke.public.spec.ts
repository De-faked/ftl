import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  const res = await page.goto('/');
  expect(res, 'no response from /').not.toBeNull();
  expect(res!.status(), 'home status >= 400').toBeLessThan(400);
  await expect(page.locator('body')).toBeVisible();
});

test('auth page loads and shows login form', async ({ page }) => {
  const res = await page.goto('/auth');
  expect(res, 'no response from /auth').not.toBeNull();
  expect(res!.status(), '/auth status >= 400').toBeLessThan(400);

  // These IDs exist in your AuthPage implementation.
  await expect(page.locator('#auth-email')).toBeVisible();
  await expect(page.locator('#auth-password')).toBeVisible();
});
