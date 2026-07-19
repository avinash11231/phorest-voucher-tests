import { test, expect } from '../fixtures/pages';
import { buyer, card, amounts } from '../utils/testData';

test.describe('Payment Page', () => {
  test.beforeEach(async ({ voucherPage, summaryPage }) => {
    await voucherPage.goto();
    await voucherPage.buyForMyself(amounts.fixed, buyer.firstName, buyer.lastName, buyer.email);
    await summaryPage.proceedToPayment();
  });

  test('Valid card completes the purchase', async ({ paymentPage, successPage }) => {
    await paymentPage.payWith(card);

    expect(await successPage.getVoucherValue()).toContain(amounts.fixed);
  });

  test('Payment without a CVC is rejected', async ({ paymentPage }) => {
    await test.step('Submit the card with the CVC left blank', async () => {
      await paymentPage.fillCardWithoutCvc(card.number, card.expiry);
      await paymentPage.pay();
    });

    await test.step('Verify an error is shown and we remain on the payment page', async () => {
      await expect(paymentPage.errorMessage).toBeVisible();
      await expect(paymentPage.pageHeading).toBeVisible();
    });
  });

  test('Edit from the payment page applies the new amount', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step('Edit and verify details are still prefilled', async () => {
      await paymentPage.clickEdit();
      await expect(voucherPage.emailInput).toHaveValue(buyer.email);
    });

    await test.step(`Change the amount to €${amounts.custom} and check out again`, async () => {
      await voucherPage.selectAmount(amounts.custom);
      await voucherPage.checkout();
      await summaryPage.proceedToPayment();
    });

    await test.step('Complete payment and verify the edited amount carries through', async () => {
      await paymentPage.payWith(card);
      expect(await successPage.getVoucherValue()).toContain(amounts.custom);
    });
  });
});