import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SummaryPage extends BasePage {
  readonly pageHeading: Locator;
  readonly amountText: Locator;
  readonly emailText: Locator;
  readonly recipientEmailText: Locator;
  readonly editButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Summary', level: 2 });

    this.amountText = page.locator('#confirm-voucher-value');
    this.emailText = page.locator('#confirm-purchaser-email');
    this.recipientEmailText = page.locator('#confirm-recipient-email');

    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm Details' });
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async getAmount() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    return (await this.amountText.textContent())?.trim() ?? '';
  }

  async getEmail() {
    return (await this.emailText.textContent())?.trim() ?? '';
  }

  async getRecipientEmail() {
    return (await this.recipientEmailText.textContent())?.trim() ?? '';
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async proceedToPayment() {
    await this.confirmButton.click();
  }
}
