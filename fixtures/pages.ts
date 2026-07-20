import { test as base } from '@playwright/test';
import { VoucherPage } from '../pages/VoucherPage';
import { SummaryPage } from '../pages/SummaryPage';
import { PaymentPage } from '../pages/PaymentPage';
import { SuccessPage } from '../pages/SuccessPage';

type VoucherFixtures = {
  voucherPage: VoucherPage;
  summaryPage: SummaryPage;
  paymentPage: PaymentPage;
  successPage: SuccessPage;
  settleDelay: void;
};

export const test = base.extend<VoucherFixtures>({
  page: async ({ page }, use) => {
    const serverErrors: string[] = [];

    page.on('response', (response) => {
      if (response.status() >= 500) {
        serverErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await use(page);

    if (serverErrors.length > 0) {
      console.warn(`Demo environment returned server errors:\n${serverErrors.join('\n')}`);
    }
  },

  voucherPage: async ({ page }, use) => use(new VoucherPage(page)),
  summaryPage: async ({ page }, use) => use(new SummaryPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  successPage: async ({ page }, use) => use(new SuccessPage(page)),

  settleDelay: [
    async ({ }, use) => {
      await use();
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';