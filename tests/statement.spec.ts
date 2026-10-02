import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { StatementPage } from '../pages/StatementPage';

test.describe('Statement Tests', () => {

  test.beforeEach(async ({ page, createAccount }) => {
    const account = await createAccount();

    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login(
      'Retail Banking',
      account.username,
      account.password
    );

    await loginPage.expectOnDashboard();
  });


// The dashboard has a "View statement" link that opens the statement in a NEW WINDOW.
// Selenium handled that with getWindowHandles() and switchTo().window().

// Selenium: StatementTests.statementOpensInNewWindow
//   Click the link, wait until there are two windows, switch to the new one, expect the
//   heading "Account Statement", close it, and return to the dashboard.
test('13 The statement opens in a new window', async ({page}) => {
  // TODO

  const dashboard = new DashboardPage(page);

    const statementPagePromise = page.waitForEvent('popup');

    await dashboard.openStatementLink();

    const statementTab = await statementPagePromise;

    await statementTab.waitForLoadState();

    const statement = new StatementPage(statementTab);

    expect(await statement.headingText())
      .toBe('Account Statement');

    await statementTab.close();

     expect(await dashboard.welcomeText()).toContain('Welcome, qa_');
});
// Selenium: StatementTests.termsCanBeAcceptedInIframe
//   In the statement window there is an iframe titled "Statement terms" with an
//   "Accept terms" button. Click it and expect the text "Terms accepted" inside the frame.
//   Selenium used switchTo().frame() and switchTo().defaultContent().
test('14 The terms can be accepted inside the iframe', async ({page}) => {
  // TODO

  const dashboard = new DashboardPage(page);

    const statementTabPromise = page.waitForEvent('popup');

    await dashboard.openStatementLink();

    const statementTab = await statementTabPromise;

    await statementTab.waitForLoadState();

    const statement = new StatementPage(statementTab);

    expect(await statement.acceptTermsInFrame())
      .toBe('Terms accepted');

    expect(await statement.headingText())
      .toBe('Account Statement');

    await statementTab.close();
});

// Selenium: StatementTests.marketFilterMultiSelect
//   The statement has a "Markets" multi-select. Choose BSE (1 holding, "National Infra Bond"),
//   then NSE and BSE together (3 holdings), then clear it (3 holdings again).
//   Selenium used the Select class: selectByValue, getAllSelectedOptions, deselectAll.
test('15 The market filter accepts several selections', async ({page}) => {
  // TODO

   const dashboard = new DashboardPage(page);

    const statementTabPromise = page.waitForEvent('popup');

    await dashboard.openStatementLink();

    const statementTab = await statementTabPromise;

    await statementTab.waitForLoadState();

    const statement = new StatementPage(statementTab);

    expect(await statement.rowCount())
      .toBe(3);

    await statement.selectMarket('BSE');

    expect(await statement.rowCount())
      .toBe(1);

    expect(await statement.rowsText())
      .toContain('National Infra Bond');

    await statement.selectMarket('NSE');

    expect(await statement.rowCount())
      .toBe(3);


   expect(await statement.selectedMarketCount()).toBe(2);

await statement.clearMarketFilter();

    expect(await statement.rowCount())
      .toBe(3);

    await statementTab.close();
});

});

