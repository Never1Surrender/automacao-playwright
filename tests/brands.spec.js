import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const MARCA = 'Polo';

// CENÁRIO: Visualizar produtos de uma marca (TC 19)
test('TC 19: Visualizar produtos de uma marca', async ({ page }) => {
  await page.goto(`${BASE_URL}/products`);

  await page.locator(`a[href="/brand_products/${MARCA}"]`).click();

  const tituloMarca = page.getByRole('heading', { name: `Brand - ${MARCA} Products` });
  await expect(tituloMarca).toBeVisible();
});
