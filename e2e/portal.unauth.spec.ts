import { test, expect } from '@playwright/test';

test('checkout redirects unauth users to sign-in prompt', async ({ page }) => {
  const res = await page.goto('/checkout');
  expect(res, 'no response from /checkout').not.toBeNull();
  expect(res!.status(), '/checkout status >= 400').toBeLessThan(400);

  // Checkout page shows a sign-in CTA when user is not logged in
  await expect(page.locator('a[href="/auth"]')).toBeVisible();
});

test('payment return redirects unauth users to sign-in prompt', async ({ page }) => {
  const res = await page.goto('/payment/return');
  expect(res, 'no response from /payment/return').not.toBeNull();
  expect(res!.status(), '/payment/return status >= 400').toBeLessThan(400);

  await expect(page.locator('a[href="/auth"]')).toBeVisible();
});
