import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const PRODUTO_ID = '1';
const NOME = 'Thais';
const EMAIL = `thais_${Date.now()}@teste.com`;
const TEXTO_REVIEW = 'Ótimo produto, recomendo!';

// CENÁRIO: Adicionar uma avaliação (review) ao produto (TC 21)
test('TC 21: Adicionar review em um produto', async ({ page }) => {
  await page.goto(`${BASE_URL}/product_details/${PRODUTO_ID}`);

  await page.locator('#name').fill(NOME);
  await page.locator('#email').fill(EMAIL);
  await page.locator('#review').fill(TEXTO_REVIEW);
  await page.locator('#button-review').click();

  const mensagemSucesso = page.getByText('Thank you for your review.');
  await expect(mensagemSucesso).toBeVisible();
});
