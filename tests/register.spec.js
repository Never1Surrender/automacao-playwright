import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const EMAIL_UNICO = `thais_${Date.now()}@teste.com`;
const EMAIL_EXISTENTE = process.env.TEST_EMAIL_CADASTRADO;
const SENHA = process.env.TEST_SENHA_CADASTRADA;

const NOME = 'Thais';
const SOBRENOME = 'Araujo';
const ENDERECO = 'Rua dos Bobos';
const ESTADO = 'Bobos';
const CIDADE = 'Bobos';
const CEP = '888777447';
const CELULAR = '8788887778858';

const DATA_NASCIMENTO = { dia: '5', mes: '5', ano: '2000' };

// CENÁRIO 1: Cadastro com Sucesso (TC 1)
test('TC 1: Cadastrar novo usuário com sucesso', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await page.getByRole('textbox', { name: 'Name' }).fill(NOME);
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(EMAIL_UNICO);
  await page.getByRole('button', { name: 'Signup' }).click();

  await page.getByRole('radio', { name: 'Mrs.' }).check();
  await page.getByRole('textbox', { name: 'Password *' }).fill(SENHA);
  await page.locator('#days').selectOption(DATA_NASCIMENTO.dia);
  await page.locator('#months').selectOption(DATA_NASCIMENTO.mes);
  await page.locator('#years').selectOption(DATA_NASCIMENTO.ano);

  await page.getByRole('textbox', { name: 'First name *' }).fill(NOME);
  await page.getByRole('textbox', { name: 'Last name *' }).fill(SOBRENOME);
  await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(ENDERECO);
  await page.getByLabel('Country *').selectOption('United States');
  await page.getByRole('textbox', { name: 'State *' }).fill(ESTADO);
  await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(CIDADE);
  await page.locator('#zipcode').fill(CEP);
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(CELULAR);

  await page.getByRole('button', { name: 'Create Account' }).click();

  const mensagemSucesso = page.getByText('Account Created!');
  await expect(mensagemSucesso).toBeVisible();
});

// CENÁRIO 2: Tentativa de Cadastro com E-mail Existente (TC 5)
test('TC 5: Tentar cadastrar usuário com e-mail já existente', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  const tituloSignup = page.getByRole('heading', { name: 'New User Signup!' });
  await expect(tituloSignup).toBeVisible();

  // Usa o e-mail fixo que já foi cadastrado anteriormente
  await page.getByRole('textbox', { name: 'Name' }).fill(NOME);
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(EMAIL_EXISTENTE);
  await page.getByRole('button', { name: 'Signup' }).click();

  const mensagemErro = page.getByText('Email Address already exist!');
  await expect(mensagemErro).toBeVisible();
});
