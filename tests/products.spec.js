import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

// CENÁRIO: Ver todos os produtos e a página de detalhe do produto (TC 8)
test('TC 8: Verificar a listagem de produtos e a página de detalhe', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('#header').getByRole('link', { name: /Products/ }).click();

  const tituloProdutos = page.getByRole('heading', { name: 'All Products' });
  await expect(tituloProdutos).toBeVisible({ timeout: 15000 });

  await page.locator('.product-image-wrapper').first().getByRole('link', { name: 'View Product' }).click();

  await expect(page).toHaveURL(/\/product_details\//);
  await expect(page.getByText('Category:')).toBeVisible();
  await expect(page.getByText('Availability:')).toBeVisible();
  await expect(page.getByText('Condition:')).toBeVisible();
  await expect(page.getByText('Brand:')).toBeVisible();
});
