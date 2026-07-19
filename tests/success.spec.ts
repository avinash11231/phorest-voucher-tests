import { test, expect } from '../fixtures/pages';
import { buyer, card, amounts } from '../utils/testData';

test.describe('Success Page', () => {
  test.beforeEach(async ({ voucherPage, summaryPage, paymentPage }) => {
    await voucherPage.goto();
    await voucherPage.buyForMyself(amounts.fixed, buyer.firstName, buyer.lastName, buyer.email);
    await summaryPage.proceedToPayment();
    await paymentPage.payWith(card);
  });

  test('Displays the voucher value and a voucher number', async ({ successPage }) => {
    expect(await successPage.getVoucherValue()).toContain(amounts.fixed);
    expect(await successPage.getVoucherNumber()).not.toBe('');
  });

  /**
   * The demo environment does not deliver voucher or receipt emails
   * (suspected mock mail transport). Documented in the README bug log.
   * These are intentionally left as fixme so the gap is visible in the
   * report rather than silently absent.
   */
  test.fixme('voucher email is delivered to the recipient', async () => { });
  test.fixme('receipt email is delivered to the purchaser', async () => { });
});
