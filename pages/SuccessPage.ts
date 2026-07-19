import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SuccessPage extends BasePage {
  readonly pageHeading: Locator;
  readonly successMessage: Locator;
  readonly voucherValue: Locator;
  readonly voucherNumber: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByText('Purchase Complete', { exact: true });

    this.successMessage = page.getByText('Payment accepted, thank you!', { exact: true });
    this.voucherValue = page.locator('p.mb-8.text-3xl.font-bold').first();
    this.voucherNumber = page.locator('[data-controller="stripe-serial"]');
    this.doneButton = page.getByRole('button', { name: 'Done' });
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async getVoucherValue() {
    await this.voucherValue.waitFor({ state: 'visible' });
    return (await this.voucherValue.textContent())?.trim() ?? '';
  }

  async getVoucherNumber() {
    await expect(this.voucherNumber).not.toHaveText('', { timeout: 15000 });
    return (await this.voucherNumber.textContent())?.trim() ?? '';
  }

  async isVisible() {
    try {
      await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickDone() {
    await this.doneButton.click();
  }
}
