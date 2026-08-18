import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const EMAIL_CADASTRADO = process.env.TEST_EMAIL_CADASTRADO;
const SENHA_CADASTRADA = process.env.TEST_SENHA_CADASTRADA;

const EMAIL_INVALIDO = process.env.TEST_EMAIL_INVALIDO;
const SENHA_INCORRETA = process.env.TEST_SENHA_INCORRETA;

// CENÁRIO 1: Falha no login (TC 3)
test('TC 3: Tentativa de login com credenciais incorretas', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(EMAIL_INVALIDO);
  await page.getByRole('textbox', { name: 'Password' }).fill(SENHA_INCORRETA);
  await page.getByRole('button', { name: 'Login' }).click();

  const mensagemErro = page.locator('p', { hasText: 'Your email or password is incorrect!' });
  await expect(mensagemErro).toBeVisible();
});

// CENÁRIO 2: Sucesso no login (TC 2)
test('TC 2: Realizar login com credenciais corretas (Sucesso)', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  // Usa a conta que você já registrou no site
  await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(EMAIL_CADASTRADO);
  await page.getByRole('textbox', { name: 'Password' }).fill(SENHA_CADASTRADA);
  await page.getByRole('button', { name: 'Login' }).click();

  // Assert: Garante que o texto 'Logged in as...' apareceu no cabeçalho
  const usuarioLogado = page.getByText(/Logged in as/i);
  await expect(usuarioLogado).toBeVisible();
});
