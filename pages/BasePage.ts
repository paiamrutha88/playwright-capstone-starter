import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async type(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  protected async textOf(locator: Locator): Promise<string> {
    return await locator.innerText();
  }
}
