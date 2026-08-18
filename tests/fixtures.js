import { test as base, expect } from '@playwright/test';

const DOMINIOS_ANUNCIO = [
  'googlesyndication.com',
  'doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
  'googleadservices.com',
  'adsafeprotected.com',
  'fundingchoicesmessages.google.com',
];

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (DOMINIOS_ANUNCIO.some((dominio) => url.includes(dominio))) {
        return route.abort();
      }
      return route.continue();
    });
    await use(page);
  },
});

export { expect };
