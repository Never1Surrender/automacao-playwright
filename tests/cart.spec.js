import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const PRODUTO_ID = '1';
const QUANTIDADE = '4';

// CENÁRIO 1: Adicionar produto ao carrinho (TC 12)
test('TC 12: Adicionar produto ao carrinho', async ({ page }) => {
  await page.goto(`${BASE_URL}/product_details/${PRODUTO_ID}`);

  await page.locator('button.cart').click();

  const modalAdicionado = page.getByRole('heading', { name: 'Added!' });
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });

  await page.getByRole('link', { name: 'View Cart' }).click();

  const linhaProduto = page.locator(`#product-${PRODUTO_ID}`);
  await expect(linhaProduto).toBeVisible();
  await expect(linhaProduto.getByText('Blue Top')).toBeVisible();
});

// CENÁRIO 2: Verificar a quantidade do produto no carrinho (TC 13)
test('TC 13: Verificar a quantidade do produto no carrinho', async ({ page }) => {
  await page.goto(`${BASE_URL}/product_details/${PRODUTO_ID}`);

  await page.locator('#quantity').fill(QUANTIDADE);
  await page.locator('button.cart').click();

  const modalAdicionado = page.getByRole('heading', { name: 'Added!' });
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });

  await page.getByRole('link', { name: 'View Cart' }).click();

  const quantidadeNoCarrinho = page.locator(`#product-${PRODUTO_ID} .cart_quantity button`);
  await expect(quantidadeNoCarrinho).toHaveText(QUANTIDADE);
});
