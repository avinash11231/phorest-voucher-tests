import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
  readonly pageHeading: Locator;
  readonly cardFrame: FrameLocator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvcInput: Locator;
  readonly payButton: Locator;
  readonly editButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Summary', level: 2 });

    // Stripe renders the card fields inside iframes
    this.cardFrame = page.frameLocator('iframe[title="Secure card payment input frame"]');

    this.cardNumberInput = this.cardFrame.locator('input[name="cardnumber"]');
    this.expiryInput = this.cardFrame.locator('input[name="exp-date"]');
    this.cvcInput = this.cardFrame.locator('input[name="cvc"]');

    this.payButton = page.getByRole('button', { name: 'Pay' });
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.errorMessage = page.getByText('Your card’s security code is incomplete.', { exact: true });
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async fillCard(number: string, expiry: string, cvc: string) {
    await this.cardNumberInput.fill(number);
    await this.expiryInput.fill(expiry);
    await this.cvcInput.fill(cvc);
  }

  async fillCardWithoutCvc(number: string, expiry: string) {
    await this.cardNumberInput.fill(number);
    await this.expiryInput.fill(expiry);
  }

  async pay() {
    await this.payButton.click();
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async payWith(card: { number: string; expiry: string; cvc: string }) {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
    await this.fillCard(card.number, card.expiry, card.cvc);
    await this.pay();
  }
}