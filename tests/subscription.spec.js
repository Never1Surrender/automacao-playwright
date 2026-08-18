import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const EMAIL_INSCRICAO = `thais_${Date.now()}@teste.com`;
const MENSAGEM_SUCESSO = 'You have been successfully subscribed!';

// CENÁRIO 1: Inscrição na newsletter pela home page (TC 10)
test('TC 10: Verificar a inscrição na newsletter na home page', async ({ page }) => {
  await page.goto(BASE_URL);

  const tituloSubscription = page.getByRole('heading', { name: 'Subscription' });
  await tituloSubscription.scrollIntoViewIfNeeded();
  await expect(tituloSubscription).toBeVisible();

  await page.locator('#susbscribe_email').fill(EMAIL_INSCRICAO);
  await page.locator('#subscribe').click();

  const mensagemSucesso = page.getByText(MENSAGEM_SUCESSO);
  await expect(mensagemSucesso).toBeVisible();
});

// CENÁRIO 2: Inscrição na newsletter pela página do carrinho (TC 11)
test('TC 11: Verificar a inscrição na newsletter na página do carrinho', async ({ page }) => {
  await page.goto(`${BASE_URL}/view_cart`);

  const tituloSubscription = page.getByRole('heading', { name: 'Subscription' });
  await tituloSubscription.scrollIntoViewIfNeeded();
  await expect(tituloSubscription).toBeVisible();

  await page.locator('#susbscribe_email').fill(EMAIL_INSCRICAO);
  await page.locator('#subscribe').click();

  const mensagemSucesso = page.getByText(MENSAGEM_SUCESSO);
  await expect(mensagemSucesso).toBeVisible();
});
