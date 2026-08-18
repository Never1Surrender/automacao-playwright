import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

// CENÁRIO: Adicionar ao carrinho a partir dos itens recomendados (TC 22)
test('TC 22: Adicionar ao carrinho a partir dos itens recomendados', async ({ page }) => {
  await page.goto(BASE_URL);

  const secaoRecomendados = page.locator('#recommended-item-carousel');
  await secaoRecomendados.scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'recommended items' })).toBeVisible();

  await secaoRecomendados.locator('.item.active a.add-to-cart').first().click();

  const modalAdicionado = page.getByRole('heading', { name: 'Added!' });
  await expect(modalAdicionado).toBeVisible({ timeout: 10000 });

  await page.getByRole('link', { name: 'View Cart' }).click();
  await expect(page).toHaveURL(/\/view_cart/);
  await expect(page.getByText('Cart is empty!')).toBeHidden();
});
