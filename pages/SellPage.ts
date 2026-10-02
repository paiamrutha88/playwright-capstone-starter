import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SellPage extends BasePage {
  private readonly quantityField = this.page.locator('#quantity');

  private readonly chequeBranchField = this.page.locator('#chequeBranch');

  private readonly confirmCheckbox = this.page.locator('input[name="confirmed"]');

  private readonly submitButton = this.page.getByRole('button', {name: /submit/i});

  private readonly errorMessage = this.page.getByRole('alert');

  constructor(page: Page) {
    super(page);
  }

  /**
   * market is the visible label: "NSE" or "BSE".
   */
  async chooseMarket(market: string): Promise<void> {
    await this.page
      .locator('label', { hasText: market })
      .locator('input')
      .click();
  }

  /**
   * settlement is the visible label: "Cash" or "Cheque".
   */
  async chooseSettlement(settlement: string): Promise<void> {
    await this.page
      .locator('label', { hasText: settlement })
      .locator('input')
      .click();
  }

  async enterQuantity(quantity: string): Promise<void> {
    await this.type(this.quantityField, quantity);
  }

  async enterChequeBranch(branch: string): Promise<void> {
    await this.type(this.chequeBranchField, branch);
  }

  async confirmDetails(): Promise<void> {
    await this.confirmCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.click(this.submitButton);
  }

  async errorText(): Promise<string> {
    return await this.textOf(this.errorMessage);
  }
}
