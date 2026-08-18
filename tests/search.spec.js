import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const TERMO_BUSCA = 'top';

// CENÁRIO: Buscar produto pelo nome (TC 9)
test('TC 9: Buscar produto e visualizar resultados', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: /Home/ }).click();
  await page.getByRole('link', { name: /Products/ }).click();

  await page.getByRole('textbox', { name: 'Search Product' }).click();
  await page.getByRole('textbox', { name: 'Search Product' }).fill(TERMO_BUSCA);
  await page.locator('#submit_search').click();

  const tituloResultados = page.getByRole('heading', { name: 'Searched Products' });
  await expect(tituloResultados).toBeVisible();
});
