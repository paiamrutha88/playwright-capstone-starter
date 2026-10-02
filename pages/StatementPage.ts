import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class StatementPage extends BasePage {
  private readonly heading = this.page.locator('h1');

  private readonly rows = this.page.locator(
    '[data-testid="statement-list"] li'
  );

  private readonly marketFilter = this.page.locator('#market-filter');

  private readonly termsFrame = this.page.frameLocator(
    'iframe[title="Statement terms"]'
  );

  private readonly acceptButton = this.termsFrame.locator('#accept');

  private readonly acceptResult = this.termsFrame.locator('#result');

  constructor(page: Page) {
    super(page);
  }

  async headingText(): Promise<string> {
    return await this.textOf(this.heading);
  }

  async rowCount(): Promise<number> {
    return await this.rows.count();
  }

  async rowsText(): Promise<string> {
    return await this.textOf(
      this.page.locator('[data-testid="statement-list"]')
    );
  }

  async selectMarket(value: string): Promise<void> {
    await this.marketFilter.selectOption(value);
  }

  async acceptTermsInFrame(): Promise<string> {
    await this.acceptButton.click();

    return await this.acceptResult.innerText();
  }
  async selectedMarketCount(): Promise<number> {
  return await this.marketFilter
    .locator('option:checked')
    .count();
  }

  async clearMarketFilter(): Promise<void> {
    await this.marketFilter.selectOption([]);
}
}
