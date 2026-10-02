import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

// Selenium: IsolationTests.seededAccountStartsClean
//   Creates an account through the API, logs in as it through the login page, and checks:
//   the welcome text, 3 holdings and the balance "₹1,25,000.50".
test('12 A freshly seeded account starts with the default holdings and balance', async ({page, createAccount}) => {
  // TODO

  const account = await createAccount();

  const loginPage = new LoginPage(page);

  await loginPage.open();

  await loginPage.login(
    'Retail Banking',
    account.username,
    account.password
  );

  await loginPage.expectOnDashboard();

  const dashboard = new DashboardPage(page);

   expect(await dashboard.welcomeText()).toBe(`Welcome, ${account.username}`);
 
   expect( await dashboard.holdingCount()).toBe(3);

   expect(await dashboard.balanceText()).toBe('₹1,25,000.50');
});
