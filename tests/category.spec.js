import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const CATEGORIA = 'Women';
const SUBCATEGORIA = 'Dress';

// CENÁRIO: Visualizar produtos de uma categoria (TC 18)
test('TC 18: Visualizar produtos de uma categoria', async ({ page }) => {
  await page.goto(`${BASE_URL}/products`);

  await page.locator('.panel-title').getByRole('link', { name: CATEGORIA }).click();
  await page.locator(`#${CATEGORIA}`).getByRole('link', { name: SUBCATEGORIA }).click();

  const tituloCategoria = page.getByRole('heading', { name: `${CATEGORIA} - ${SUBCATEGORIA} Products` });
  await expect(tituloCategoria).toBeVisible();
});
