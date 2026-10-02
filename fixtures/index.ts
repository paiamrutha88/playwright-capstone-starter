import {
  test as base,
  expect,
  request as pwRequest,
  type APIRequestContext,
} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

const BASE_URL =
  process.env.BASE_URL ?? 'http://localhost:5173';

const API_URL =
  process.env.API_URL ?? 'http://localhost:4000/api/';

export interface SeededAccount {
  accountId: string;
  username: string;
  password: string;
}

interface SeedOptions {
  holdings?: {
    name: string;
    market: string;
    quantity: number;
    avgPrice: number;
  }[];
}

type Fixtures = {
  loggedInPage: void;
  api: APIRequestContext;

  createAccount: (
    options?: SeedOptions
  ) => Promise<SeededAccount>;
};

export const test = base.extend<Fixtures>({

  api: async ({}, use) => {
    const api = await pwRequest.newContext({
      baseURL: API_URL,
    });

    await use(api);

    await api.dispose();
  },

  createAccount: async ({ api }, use) => {
    await use(async (options = {}) => {
      const response = await api.post('test/seed-account', {
        data: options,
      });

      expect(response.ok()).toBeTruthy();

      return await response.json();
    });
  },

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
