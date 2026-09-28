import { expect, test } from '@playwright/test';

test('redirects the bare root to the default English locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page).toHaveTitle(/Johar Rizvi/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('main navigation is present and keyboard reachable', async ({ page }) => {
  await page.goto('/en');
  const nav = page.getByRole('navigation').first();
  await expect(nav.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'AI Lab' })).toBeVisible();
});

test('language switcher preserves the current page', async ({ page }) => {
  await page.goto('/en/projects');
  await page
    .getByRole('group', { name: 'Switch language' })
    .getByRole('button', { name: 'DE', exact: true })
    .click();
  await expect(page).toHaveURL(/\/de\/projects$/);
});

test('theme toggle switches to dark mode', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await page.getByRole('menuitem', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
