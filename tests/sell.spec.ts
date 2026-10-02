import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { SellPage } from '../pages/SellPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';


// All five tests open the sell form for the first holding, "Bluechip Growth Fund".
// The sell form has two groups of radio buttons (Market and Settlement type), a quantity,
// a confirmation checkbox and a "Submit for Redemption" button.

// Selenium: SellTests.sellCashOnNse
//   Choose market NSE, settlement Cash, quantity 1, confirm, submit.
//   Expect the confirmation heading "Transaction submitted and under process",
//   the status "processing" and the settlement "cash".
test.describe('Sell Tests', () => {

  test.beforeEach(async ({ page, loggedInPage }) => {
    const dashboard = new DashboardPage(page);

    await dashboard.clickSell(1);
  });

test('07 Selling on NSE with cash settlement is confirmed', async ({page,loggedInPage}) => {
  // TODO
  const sellPage = new SellPage(page);
    const confirmation = new ConfirmationPage(page);

    await sellPage.chooseMarket('NSE');
    await sellPage.chooseSettlement('Cash');
    await sellPage.enterQuantity('1');
    await sellPage.confirmDetails();
    await sellPage.submit();

 //   await expect(confirmation.headingText()).resolves.toBe('Transaction submitted and under process');
    expect(await confirmation.headingText())
  .toBe('Transaction submitted and under process');

 //   await expect(confirmation.statusText()).resolves.toBe('processing');

    expect(await confirmation.statusText())
  .toBe('processing');

  //  await expect(confirmation.settlementText()).resolves.toBe('cash');

  expect(await confirmation.settlementText())
  .toBe('cash');
});

// Selenium: SellTests.chequeNeedsBranch
//   Choose Cheque, quantity 1, confirm, submit, without filling in a branch.
//   Expect the alert "Cheque settlement requires a branch" and to stay on the sell page.
test('08 Cheque settlement without a branch is rejected', async ({page,loggedInPage}) => {
  // TODO
  const sellPage = new SellPage(page);

    await sellPage.chooseSettlement('Cheque');
    await sellPage.enterQuantity('1');
    await sellPage.confirmDetails();
    await sellPage.submit();

    //await expect(sellPage.errorText()).resolves.toBe('Cheque settlement requires a branch');

    expect(await sellPage.errorText())
  .toBe('Cheque settlement requires a branch');

    await expect(page).toHaveURL(/\/sell\//);
});

// Selenium: SellTests.chequeWithBranchConfirms
//   Choose NSE and Cheque, branch "Fort, Mumbai", quantity 1, confirm, submit.
//   Expect the settlement "cheque" and the status "processing".
test('09 Cheque settlement with a branch is confirmed', async ({page,loggedInPage}) => {
  // TODO
  const sellPage = new SellPage(page);
    const confirmation = new ConfirmationPage(page);

    await sellPage.chooseMarket('NSE');
    await sellPage.chooseSettlement('Cheque');
    await sellPage.enterChequeBranch('Fort, Mumbai');
    await sellPage.enterQuantity('1');
    await sellPage.confirmDetails();
    await sellPage.submit();

   // await expect(confirmation.settlementText()).resolves.toBe('cheque');

    //await expect(confirmation.statusText()).resolves.toBe('processing');

    expect(await confirmation.settlementText())
  .toBe('cheque');

expect(await confirmation.statusText())
  .toBe('processing');
});

// Selenium: SellTests.oversellIsRejected
//   Quantity 9999, confirm, submit. Expect an alert like "Only 120 units available to sell".
//   The number depends on the account, so match the shape of the sentence.
test('10 Selling more than is held is rejected', async ({page,loggedInPage}) => {
  // TODO
  const sellPage = new SellPage(page);

    await sellPage.enterQuantity('9999');
    await sellPage.confirmDetails();
    await sellPage.submit();

    //await expect(sellPage.errorText()).resolves.toBe(/^Only .* units available to sell$/);
    await expect(sellPage.errorText()).resolves.toBe(/^Only \d+ units available to sell$/);
});

// Selenium: SellTests.saleReducesQuantityOnServer
//   Ask the API for the holding's quantity, sell 2 through the UI, ask the API again,
//   expect the quantity to be 2 lower. Playwright's request fixture replaces the Java HttpClient.
test('11 A sale reduces the quantity held on the server', async ({page,loggedInPage,api}) => {
  // TODO
  const sellPage = new SellPage(page);
  const confirmation = new ConfirmationPage(page);

  // Same as ApiClient.login(...)
  const loginResponse = await api.post('login', {
    data: {
      area: 'Retail Banking',
      username: 'demo',
      password: 'demo1234',
    },
  });

  expect(loginResponse.ok()).toBeTruthy();

  const loginData = await loginResponse.json();
  const accountId = String(loginData.accountId);

  // Same as ApiClient.holdingQuantity(...)
  const beforeResponse = await api.get(
    `account/${accountId}`
  );

  expect(beforeResponse.ok()).toBeTruthy();

  const beforeData = await beforeResponse.json();

  const beforeHolding = beforeData.account.holdings.find(
    (holding: { name: string; quantity: number }) =>
      holding.name === 'Bluechip Growth Fund'
  );

  expect(beforeHolding).toBeDefined();

  const before = beforeHolding.quantity;

  // Sell 2 through the UI
  await sellPage.enterQuantity('2');
  await sellPage.confirmDetails();
  await sellPage.submit();

  expect(await confirmation.headingText())
    .toBe('Transaction submitted and under process');

  // Get the holding again
  const afterResponse = await api.get(
    `account/${accountId}`
  );

  expect(afterResponse.ok()).toBeTruthy();

  const afterData = await afterResponse.json();

  const afterHolding = afterData.account.holdings.find(
    (holding: { name: string; quantity: number }) =>
      holding.name === 'Bluechip Growth Fund'
  );

  expect(afterHolding).toBeDefined();

  const after = afterHolding.quantity;

  expect(after).toBe(before - 2);
});
});