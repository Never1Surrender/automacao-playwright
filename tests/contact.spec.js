import path from 'path';
import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

const NOME = 'Thais';
const EMAIL = `thais_${Date.now()}@teste.com`;
const ASSUNTO = 'Dúvida sobre pedido';
const MENSAGEM = 'Mensagem de teste automatizado para o formulário de contato.';
const ARQUIVO_UPLOAD = path.resolve(__dirname, 'fixtures/upload-test.txt');

// CENÁRIO: Enviar formulário de contato (TC 6)
test('TC 6: Preencher e enviar o formulário de contato', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('link', { name: /Contact us/ }).click();
  await page.waitForLoadState('load');

  const tituloContato = page.getByRole('heading', { name: 'Get In Touch' });
  await expect(tituloContato).toBeVisible();

  await page.getByPlaceholder('Name', { exact: true }).fill(NOME);
  await page.getByPlaceholder('Email', { exact: true }).fill(EMAIL);
  await page.getByPlaceholder('Subject').fill(ASSUNTO);
  await page.getByPlaceholder('Your Message Here').fill(MENSAGEM);
  await page.locator('input[name="upload_file"]').setInputFiles(ARQUIVO_UPLOAD);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Submit' }).click();

  const mensagemSucesso = page.locator('.status.alert-success');
  await expect(mensagemSucesso).toHaveText('Success! Your details have been submitted successfully.');

  await page.locator('#form-section').getByRole('link', { name: /Home/ }).click();
  const tituloHome = page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).first();
  await expect(tituloHome).toBeVisible();
});
