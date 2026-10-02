import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly welcomeHeading = this.page.locator('xpath=//main//h1');

  private readonly areaBadge = this.page.locator('.area-badge');

  private readonly holdingRows = this.page.locator(
    "xpath=//ul[@class='holdings-list']/li"
  );

  private readonly firstHoldingName = this.page.locator(
    "xpath=//ul[@class='holdings-list']/li[1]/div/p[1]"
  );

  private readonly firstHoldingMeta = this.page.locator(
    "xpath=//ul[@class='holdings-list']/li[1]/div/p[2]"
  );

  private readonly noHoldingsMessage = this.page.locator(
    "xpath=//p[contains(text(),'No holdings remaining')]"
  );

  private readonly balance = this.page.getByTestId("account-balance");

  private readonly logOutButton = this.page.getByRole("button",  {name: /Log Out/i});


  private readonly statementLink = this.page.getByRole('link', {name: 'View statement'});

  constructor(page: Page) {
    super(page);
  }

  async welcomeText(): Promise<string> {
    return await this.textOf(this.welcomeHeading);
  }

  async areaText(): Promise<string> {
    return await this.textOf(this.areaBadge);
  }

  async balanceText(): Promise<string> {
    return await this.textOf(this.balance);
  }

  async holdingCount(): Promise<number> {
    await this.welcomeHeading.waitFor({ state: 'visible' });
    return await this.holdingRows.count();
  }

  async getfirstHoldingName(): Promise<string> {
    return await this.textOf(this.firstHoldingName);
  }

  async getfirstHoldingMeta(): Promise<string> {
    return await this.textOf(this.firstHoldingMeta);
  }

  async noHoldingsText(): Promise<string> {
    return await this.textOf(this.noHoldingsMessage);
  }

  /**
   * position is 1-based: 1 = first holding on the page.
   */
  async clickSell(position: number): Promise<void> {
    const sellButton = this.page
      .locator("a[role='button']").nth(0);
      

    await sellButton.click();
  }

  async logOut(): Promise<void> {
    await this.click(this.logOutButton);
  }

  async openStatementLink(): Promise<void> {
    await this.statementLink.click();
  }
}
