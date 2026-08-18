import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const EMAIL_CADASTRADO = process.env.TEST_EMAIL_CADASTRADO;
const SENHA_CADASTRADA = process.env.TEST_SENHA_CADASTRADA;

// CENÁRIO: Logout do usuário (TC 4)
test('TC 4: Fazer logout do usuário', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: /Signup \/ Login/ }).click();

  await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(EMAIL_CADASTRADO);
  await page.getByRole('textbox', { name: 'Password' }).fill(SENHA_CADASTRADA);
  await page.getByRole('button', { name: 'Login' }).click();

  const usuarioLogado = page.getByText(/Logged in as/i);
  await expect(usuarioLogado).toBeVisible();

  await page.getByRole('link', { name: /Logout/ }).click();

  const tituloLogin = page.getByRole('heading', { name: 'Login to your account' });
  await expect(tituloLogin).toBeVisible();
});
