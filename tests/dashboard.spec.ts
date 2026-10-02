import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

// Selenium: DashboardTests.dashboardListsHoldings
//   Logs in as the shared demo account, then checks: 3 holdings, the first one is
//   "Bluechip Growth Fund", and its details start with "NSE".
test.describe('Dashboard Tests', () => {

  test('04 Dashboard lists the holdings for the account', async ({
    page,
    loggedInPage,
  }) => {
    const dashboard = new DashboardPage(page);

    await expect(dashboard.holdingCount()).resolves.toBe(3);

    await expect(dashboard.getfirstHoldingName()).resolves.toBe('Bluechip Growth Fund');

    await expect(dashboard.getfirstHoldingMeta()).resolves.toContain('NSE');
  });

// Selenium: DashboardTests.emptyAccountShowsMessage
//   Logs in as the account "emptyholder" and expects the text "No holdings remaining."
//   and zero holdings. Playwright can create an account that has no holdings on demand.
test('05 An account with no holdings shows the empty message', async ({
    page,
    loggedInPage,
  }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.logOut();

    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      'Retail Banking',
      'emptyholder',
      'demo1234'
    );

    await loginPage.expectOnDashboard();

    await expect(dashboard.noHoldingsText()).resolves.toBe('No holdings remaining.');

    await expect(dashboard.holdingCount()).resolves.toBe(0);
  });

});
