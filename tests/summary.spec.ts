import { test, expect } from '../fixtures/pages';
import { buyer, friend, card, amounts } from '../utils/testData';

test.describe('Summary Page', () => {
  test.beforeEach(async ({ voucherPage }) => {
    await voucherPage.goto();
  });

  test('Shows the correct amount and email when buying for yourself', async ({
    voucherPage, summaryPage,
  }) => {
    await voucherPage.buyForMyself(amounts.fixed, buyer.firstName, buyer.lastName, buyer.email);

    expect(await summaryPage.getAmount()).toContain(amounts.fixed);
    expect(await summaryPage.getEmail()).toContain(buyer.email);
  });

  test('Shows both emails when buying for someone else', async ({
    voucherPage, summaryPage,
  }) => {
    await test.step('Buy for someone else with all fields filled', async () => {
      await voucherPage.selectAmount(amounts.fixed);
      await voucherPage.chooseForSomeoneElse();
      await voucherPage.fillMyDetails(buyer.firstName, buyer.lastName, buyer.email);
      await voucherPage.fillFriendDetails(friend.email, friend.message);
      await voucherPage.checkout();
    });

    await test.step('Verify buyer and recipient details on the summary', async () => {
      expect(await summaryPage.getAmount()).toContain(amounts.fixed);
      expect(await summaryPage.getEmail()).toContain(buyer.email);
      expect(await summaryPage.getRecipientEmail()).toContain(friend.email);
    });
  });

  test('Edit from the details page applies the new amount', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step(`Buy a €${amounts.fixed} voucher and reach the summary`, async () => {
      await voucherPage.buyForMyself(amounts.fixed, buyer.firstName, buyer.lastName, buyer.email);
    });

    await test.step('Edit and verify details are still prefilled', async () => {
      await summaryPage.clickEdit();
      await expect(voucherPage.emailInput).toHaveValue(buyer.email);
    });

    await test.step(`Change the amount to €${amounts.custom} and check out again`, async () => {
      await voucherPage.selectAmount(amounts.custom);
      await voucherPage.checkout();
      expect(await summaryPage.getAmount()).toContain(amounts.custom);
    });

    await test.step('Complete payment and verify the edited amount carries through', async () => {
      await summaryPage.proceedToPayment();
      await paymentPage.payWith(card);
      expect(await successPage.getVoucherValue()).toContain(amounts.custom);
    });
  });
});
