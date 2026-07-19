# Phorest QA Engineer Candidate Task — Gift Voucher UI Automation

[![Playwright Tests](https://github.com/avinash11231/phorest-voucher-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/avinash11231/phorest-voucher-tests/actions/workflows/playwright.yml)

An end-to-end Playwright automation suite built in TypeScript for validating the Phorest gift voucher purchase flow.

**Application URL:** `https://gift-cards-dev.phorest.com/salons/automationvouchersdemo`

---

## How to Run

### Option 1: Run Online (GitHub Actions UI)
You can trigger and review the test execution directly on GitHub without downloading or configuring anything:
1. Navigate to the **Actions** tab of this repository.
2. Select **Playwright Tests** from the workflow list on the left.
3. Click the **Run workflow** dropdown on the right side and click the green **Run workflow** button.
4. Once execution completes, the interactive HTML report will be updated and hosted online at:
   `https://avinash11231.github.io/phorest-voucher-tests/`
   *(A zipped copy of the report is also downloadable under the **Artifacts** section at the bottom of the workflow run details).*

### Option 2: Run Locally
Ensure you have Node.js installed, then run the following:

```bash
# Install package dependencies and Playwright browsers
npm ci
npx playwright install --with-deps

# Execute the E2E test suites
npm test

# Run tests with the browser UI visible (headed mode)
npm run test:headed

# Open the local interactive HTML test report
npm run report
```

---

## Project Structure

```
.
├── .github/workflows/
│   └── playwright.yml      # CI workflow for push/pull runs and Pages deployment
│
├── pages/                  # Page Object classes
│   ├── BasePage.ts         # Base helper page (goto, load states)
│   ├── VoucherPage.ts      # Step 1: Voucher value and buyer/recipient forms
│   ├── SummaryPage.ts      # Step 2: Details summary
│   ├── PaymentPage.ts      # Step 3: Credit card entry via Stripe iframe
│   └── SuccessPage.ts      # Step 4: Purchase confirmation page
│
├── tests/                  # Test suites
│   ├── happy-path.spec.ts  # End-to-end checkout scenarios
│   ├── summary.spec.ts     # Review page verification and details update
│   ├── payment.spec.ts     # Payment processing and validation tests
│   ├── validation.spec.ts  # Voucher bounds and form validation checks
│   └── success.spec.ts     # Post-payment confirmation and email delivery checks
│
├── fixtures/
│   └── pages.ts            # Page object injection and environment diagnostics
│
└── utils/
    └── testData.ts         # Test data (buyer, card details, amounts)
```

---

## Architecture & Code Design

- **Page Object Model (POM)**: Located in `pages/`, representing the flow pages (`VoucherPage`, `SummaryPage`, `PaymentPage`, `SuccessPage`). Inherits shared navigations and states from `BasePage`.
- **Dependency Injection**: Using customized Playwright fixtures in `fixtures/pages.ts` to automatically instantiate and clean up page objects for each test.
- **Centralised Data**: Test accounts, presets, and card configurations are maintained in `utils/testData.ts`.

---

## Test Suite Coverage 

Total 20 tests, with 18 passing, 2 fixmes.

### `happy-path.spec.ts` (4 tests)
*   `Purchase a €50 voucher for yourself` - Selects preset value, enters purchaser details, fills valid card numbers, and confirms the final success state.
*   `Purchase a custom €75 voucher for yourself` - Confirms a custom user-defined amount completes successfully.
*   `Purchase a voucher for someone else with all fields filled` - Verifies recipient information on the summary screen and completes the purchase.
*   `Purchase the minimum custom amount of €20` - Checks the lowest possible bounds check for custom vouchers.

### `summary.spec.ts` (3 tests)
*   `Shows the correct amount and email when buying for yourself`
*   `Shows both emails when buying for someone else`
*   `Edit from the details page applies the new amount` - Verifies clicking "Edit" returns the user to step 1 with their form data preserved, allowing changes to flow forward.

### `payment.spec.ts` (3 tests)
*   `Valid card completes the purchase`
*   `Payment without a CVC is rejected` - Confirms entering card details lacking CVC fails payment and displays Stripe's validation errors.
*   `Edit from the payment page applies the new amount` - Verifies edit flows are correct from the final payment step.

### `validation.spec.ts` (7 tests)
*   `accepts the minimum custom amount` - Confirms that exactly €20 is accepted and no validation error is shown.
*   `rejects an amount below the minimum` - Triggers validation error for custom inputs under €20.
*   `accepts the maximum custom amount` - Confirms that exactly €1000 is accepted and no validation error is shown.
*   `rejects an amount above the maximum` - Triggers validation error for custom inputs over €1000.
*   `shows the custom textbox only when Other is selected` - Checks that the custom input displays conditionally.
*   `rejects an invalid buyer email`
*   `rejects an invalid recipient email`

### `success.spec.ts` (3 tests)
*   `Displays the voucher value and a voucher number`
*   `voucher email is delivered to the recipient` (marked as `fixme` due to environment bug)
*   `receipt email is delivered to the purchaser` (marked as `fixme` due to environment bug)

---

## Environment Bugs & Mitigations

### 1. Intermittent HTTP 502 / 500 Server Errors under Load
- **Problem**: Backends intermittently return server errors during sequential runs.
- **Mitigation**: Configured Playwright to run sequentially (`workers: 1`) and created a custom fixture in `fixtures/pages.ts` that adds a 3-second delay (`settleDelay`) between tests to let the environment recover. Retries are set to 2 in `playwright.config.ts`.
- **Diagnostics**: The custom `page` fixture listens to all responses; if a `>= 500` status code is returned, it prints the status and URL in the console (`Demo environment returned server errors`) to help separate environment errors from locator issues.

### 2. Missing Receipt and Voucher Email Delivery
- **Problem**: Mail transport does not deliver receipt or voucher emails.
- **Mitigation**: The email tests are written in `success.spec.ts` but marked with `test.fixme`. This lists the coverage gap in reports without causing build failures.
