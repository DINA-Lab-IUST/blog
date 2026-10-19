import { expect, test } from '@playwright/test';

// Page load smoke tests for the DINA LAB blog (bilingual blog at `/`).

test('homepage (blog listing) loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page).toHaveTitle(/blog/i);
});

test('about link points to the lab site', async ({ page }) => {
  await page.goto('/');
  const aboutLink = page.locator('nav a[href*="dina-lab-iust.github.io"]');
  await expect(aboutLink.first()).toBeVisible();
});

test('members page loads with member cards', async ({ page }) => {
  await page.goto('/members/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('.member-inner').first()).toBeVisible();
});

test('publications page loads', async ({ page }) => {
  await page.goto('/publications/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page).toHaveTitle(/publications/i);
});

// Dark mode persists across navigation (inline pre-paint script + localStorage).

test('dark mode preference persists after navigation', async ({ page }) => {
  await page.goto('/');

  // Set dark mode via localStorage (simulates user toggling to dark)
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  // Navigate away and back — theme should be restored by the inline script
  await page.goto('/members/');
  const theme = await page.locator('html').getAttribute('data-theme');
  expect(theme).toBe('dark');
});

test('light mode preference persists after navigation', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  await page.goto('/publications/');
  const theme = await page.locator('html').getAttribute('data-theme');
  expect(theme).toBe('light');
});

// Chrome language switch persists and flips direction.

test('language switch flips to Persian RTL', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    (window as Window & { __labSetLang?: (l: string) => void }).__labSetLang?.('fa'),
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

// Navigation

test('navbar links are present on homepage', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
});

test('404 page returns not-found response', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
});
