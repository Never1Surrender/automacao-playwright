import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const TERMO_BUSCA = 'top';
const EMAIL_CADASTRADO = process.env.TEST_EMAIL_CADASTRADO;
const SENHA_CADASTRADA = process.env.TEST_SENHA_CADASTRADA;

// CENÁRIO: Buscar produtos, adicionar ao carrinho e confirmar que persiste após login (TC 20)
test('TC 20: Buscar produtos e verificar o carrinho após login', async ({ page }) => {
  await page.goto(`${BASE_URL}/products`);

  await page.getByRole('textbox', { name: 'Search Product' }).fill(TERMO_BUSCA);
  await page.locator('#submit_search').click();

  await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

  await page.locator('.product-image-wrapper').first().locator('a.add-to-cart').first().click();
  const modalAdicionado = page.getByRole('heading', { name: 'Added!' });
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });
  await page.locator('#cartModal .close-modal').click();

  await page.locator('.product-image-wrapper').nth(1).locator('a.add-to-cart').first().click();
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });
  await page.getByRole('link', { name: 'View Cart' }).click();

  const itensNoCarrinhoAntes = await page.locator('#cart_info_table tbody tr').count();
  expect(itensNoCarrinhoAntes).toBe(2);

  await page.getByRole('link', { name: /Signup \/ Login/ }).click();
  await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(EMAIL_CADASTRADO);
  await page.getByRole('textbox', { name: 'Password' }).fill(SENHA_CADASTRADA);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText(/Logged in as/i)).toBeVisible();

  await page.locator('#header').getByRole('link', { name: /Cart/ }).click();
  const itensNoCarrinhoDepois = await page.locator('#cart_info_table tbody tr').count();
  expect(itensNoCarrinhoDepois).toBe(2);
});
