import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class VoucherPage extends BasePage {

  readonly pageHeading: Locator;

  // amount options
  readonly amount50: Locator;
  readonly amount100: Locator;
  readonly amount150: Locator;
  readonly customOption: Locator;
  readonly customAmountInput: Locator;

  // recipient tabs
  readonly forMyselfTab: Locator;
  readonly forSomeoneElseTab: Locator;

  // form fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly friendEmailInput: Locator;
  readonly messageInput: Locator;

  // error messages
  readonly amountError: Locator;
  readonly emailError: Locator;
  readonly requiredError: Locator;

  // buttons
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByText('Buy a Gift Voucher', { exact: true });

    this.amount50 = page.getByLabel('€50');
    this.amount100 = page.getByLabel('€100');
    this.amount150 = page.getByLabel('€150');
    this.customOption = page.getByLabel('Other');
    this.customAmountInput = page.locator('input[data-target="amount.otherInput"]');

    this.forMyselfTab = page.getByRole('link', { name: 'Send to me' });
    this.forSomeoneElseTab = page.getByRole('link', { name: 'Send to someone else' });

    this.firstNameInput = page.getByRole('textbox', { name: 'first name ...' });
    this.lastNameInput = page.getByRole('textbox', { name: 'last name ...' });
    this.emailInput = page.getByRole('textbox', { name: 'the receipt will be sent here ...' });
    this.friendEmailInput = page.getByRole('textbox', { name: 'gift voucher will be sent here ...' });
    this.messageInput = page.getByPlaceholder('type your message here eg. Hi Mom, Happy Birthday! Love Karen');

    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.amountError = page.getByText('The minimum spend is €20 and the maximum spend is €1000.');
    this.emailError = page.getByText('Please enter a valid email');
    this.requiredError = page.getByText('Required');
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async selectAmount(value: string) {
    if (value === '50') await this.amount50.click();
    else if (value === '100') await this.amount100.click();
    else if (value === '150') await this.amount150.click();
    else {
      await this.customOption.click();
      await this.customAmountInput.pressSequentially(value, { delay: 50 });
    }
  }

  async selectCustom() {
    await this.customOption.click();
  }

  async chooseForMyself() {
    await this.forMyselfTab.click();
  }

  async chooseForSomeoneElse() {
    await this.forSomeoneElseTab.click();
  }

  async fillMyDetails(firstName: string, lastName: string, email: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.emailInput.press('Tab');
  }

  async fillFriendDetails(email: string, message: string) {
    await this.friendEmailInput.fill(email);
    await this.messageInput.fill(message);
  }

  async checkout() {
    await this.checkoutButton.click();
    await this.pageHeading.waitFor({ state: 'hidden', timeout: 20000 });
  }

  async isCustomInputVisible() {
    return this.customAmountInput.isVisible();
  }

  async buyForMyself(amount: string, first: string, last: string, email: string) {
    await this.selectAmount(amount);
    await this.chooseForMyself();
    await this.fillMyDetails(first, last, email);
    await this.checkout();
  }
}