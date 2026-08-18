import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const PRODUTO_ID = '1';

// CENÁRIO: Remover produto do carrinho (TC 17)
test('TC 17: Remover produto do carrinho', async ({ page }) => {
  await page.goto(`${BASE_URL}/product_details/${PRODUTO_ID}`);
  await page.locator('button.cart').click();

  const modalAdicionado = page.getByRole('heading', { name: 'Added!' });
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });

  await page.getByRole('link', { name: 'View Cart' }).click();

  const linhaProduto = page.locator(`#product-${PRODUTO_ID}`);
  await expect(linhaProduto).toBeVisible();

  await page.locator(`#product-${PRODUTO_ID} .cart_quantity_delete`).click();

  await expect(linhaProduto).toBeHidden();
  await expect(page.getByText('Cart is empty!')).toBeVisible();
});
