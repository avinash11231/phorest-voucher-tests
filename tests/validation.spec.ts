import { test, expect } from '../fixtures/pages';
import { buyer, friend, amounts } from '../utils/testData';

test.describe('Voucher page validation', () => {
  test.beforeEach(async ({ voucherPage }) => {
    await voucherPage.goto();
  });

  test.describe('Custom amount', () => {
    test('accepts the minimum custom amount', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.min);
      await expect(voucherPage.amountError).toBeHidden();
    });

    test('rejects an amount below the minimum', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.belowMin);
      await expect(voucherPage.amountError).toBeVisible();
    });

    test('accepts the maximum custom amount', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.max);
      await expect(voucherPage.amountError).toBeHidden();
    });

    test('rejects an amount above the maximum', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.aboveMax);
      await expect(voucherPage.amountError).toBeVisible();
    });

    test('shows the custom textbox only when Other is selected', async ({ voucherPage }) => {
      await voucherPage.selectCustom();
      await expect(voucherPage.customAmountInput).toBeVisible();

      await voucherPage.selectAmount(amounts.fixed);
      await expect(voucherPage.customAmountInput).toBeHidden();
    });
  });

  test.describe('Email fields', () => {
    test('rejects an invalid buyer email', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.fixed);
      await voucherPage.chooseForMyself();
      await voucherPage.fillMyDetails(buyer.firstName, buyer.lastName, 'not-an-email');

      await expect(voucherPage.emailError).toBeVisible();
    });

    test('rejects an invalid recipient email', async ({ voucherPage }) => {
      await voucherPage.selectAmount(amounts.fixed);
      await voucherPage.chooseForSomeoneElse();
      await voucherPage.fillMyDetails(buyer.firstName, buyer.lastName, buyer.email);
      await voucherPage.fillFriendDetails('bad-email', friend.message);

      await expect(voucherPage.emailError).toBeVisible();
    });
  });
});