import { test, expect } from './fixtures';

const BASE_URL = process.env.BASE_URL;

// CENÁRIO: Acessar a página de Test Cases (TC 7)
test('TC 7: Verificar a página de Test Cases', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('#header').getByRole('link', { name: /Test Cases/ }).click();

  await expect(page).toHaveURL(/\/forcando-falha-para-testar-integracao-jira/);

  const tituloTestCases = page.getByRole('heading', { name: 'Test Cases', exact: true });
  await expect(tituloTestCases).toBeVisible();
});
