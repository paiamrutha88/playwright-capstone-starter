import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4000/api/';

type Fixtures = {
  loggedInPage: void;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto(`${BASE_URL}/login`);

    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload();

    const loginPage = new LoginPage(page);

    await loginPage.login(
      'Retail Banking',
      'demo',
      'demo1234'
    );

    await loginPage.expectOnDashboard();

    await use();
  },
});

export { expect };
