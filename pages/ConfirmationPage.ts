import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  private readonly heading = this.page.locator(
    '[data-testid="confirmation-heading"]'
  );

  private readonly status = this.page.getByTestId("transaction-status");

  private readonly settlement = this.page.locator(
    'xpath=//dt[text()="Settlement"]/following-sibling::dd[1]'
  );

  private readonly quantity = this.page.locator(
    'xpath=//dt[text()="Quantity"]/following-sibling::dd[1]'
  );

  constructor(page: Page) {
    super(page);
  }

  async headingText(): Promise<string> {
    return await this.textOf(this.heading);
  }

  async statusText(): Promise<string> {
    return await this.textOf(this.status);
  }

  async settlementText(): Promise<string> {
    return await this.textOf(this.settlement);
  }

  async quantityText(): Promise<string> {
    return await this.textOf(this.quantity);
  }
}
