import { test, expect } from '../fixtures/pages';
import { buyer, friend, card, amounts } from '../utils/testData';

test.describe('Happy Path - Voucher Purchase', () => {
  test.beforeEach(async ({ voucherPage }) => {
    await voucherPage.goto();
  });

  test('Purchase a €50 voucher for yourself', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step(`Select €${amounts.fixed} and enter buyer details`, async () => {
      await voucherPage.buyForMyself(amounts.fixed, buyer.firstName, buyer.lastName, buyer.email);
    });

    await test.step('Verify summary reflects the selection', async () => {
      expect(await summaryPage.getAmount()).toContain(amounts.fixed);
      expect(await summaryPage.getEmail()).toContain(buyer.email);
    });

    await test.step('Confirm details and pay', async () => {
      await summaryPage.proceedToPayment();
      await paymentPage.payWith(card);
    });

    await test.step('Verify purchase confirmation', async () => {
      expect(await successPage.getVoucherValue()).toContain(amounts.fixed);
    });
  });

  test('Purchase a custom €75 voucher for yourself', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step(`Select custom amount €${amounts.custom} and enter buyer details`, async () => {
      await voucherPage.buyForMyself(amounts.custom, buyer.firstName, buyer.lastName, buyer.email);
    });

    await test.step('Confirm the custom amount and pay', async () => {
      expect(await summaryPage.getAmount()).toContain(amounts.custom);
      await summaryPage.proceedToPayment();
      await paymentPage.payWith(card);
    });

    await test.step('Verify the custom amount on confirmation', async () => {
      expect(await successPage.getVoucherValue()).toContain(amounts.custom);
    });
  });

  test('Purchase a voucher for someone else with all fields filled', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step('Enter buyer and recipient details', async () => {
      await voucherPage.selectAmount(amounts.fixed);
      await voucherPage.chooseForSomeoneElse();
      await voucherPage.fillMyDetails(buyer.firstName, buyer.lastName, buyer.email);
      await voucherPage.fillFriendDetails(friend.email, friend.message);
      await voucherPage.checkout();
    });

    await test.step('Verify recipient email on the summary and pay', async () => {
      expect(await summaryPage.getRecipientEmail()).toContain(friend.email);
      await summaryPage.proceedToPayment();
      await paymentPage.payWith(card);
    });

    await test.step('Verify purchase confirmation', async () => {
      expect(await successPage.isVisible()).toBeTruthy();
    });
  });

  test('Purchase the minimum custom amount of €20', async ({
    voucherPage, summaryPage, paymentPage, successPage,
  }) => {
    await test.step(`Select minimum amount €${amounts.min} and enter buyer details`, async () => {
      await voucherPage.buyForMyself(amounts.min, buyer.firstName, buyer.lastName, buyer.email);
    });

    await test.step('Confirm the minimum amount and pay', async () => {
      expect(await summaryPage.getAmount()).toContain(amounts.min);
      await summaryPage.proceedToPayment();
      await paymentPage.payWith(card);
    });

    await test.step('Verify the minimum amount on confirmation', async () => {
      expect(await successPage.getVoucherValue()).toContain(amounts.min);
    });
  });
});