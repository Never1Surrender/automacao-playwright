import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

// CENÁRIO 1: Rolar para cima usando o botão de seta (TC 25)
test('TC 25: Rolar para cima usando o botão de seta', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.locator('#footer').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();

  await page.locator('#scrollUp').click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

// CENÁRIO 2: Rolar para cima sem usar o botão de seta (TC 26)
test('TC 26: Rolar para cima sem usar o botão de seta', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.locator('#footer').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 0));

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
