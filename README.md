# Phorest QA Engineer Candidate Task — Gift Voucher UI Automation

An end-to-end Playwright automation suite built in TypeScript for validating the Phorest gift voucher purchase flow.

**URL:** `https://gift-cards-dev.phorest.com/salons/automationvouchersdemo`

---

## Candidate Task Coverage

This suite covers the core objectives and completes all bonus goals outlined in the brief:

*   **Core Task**: Comprehensive automated test coverage for the multi-step voucher checkout flow.
*   **Clean Code**: Built using the Page Object Model (POM), clean file separation, and strict TypeScript types.
*   **Discovering Bugs**: Investigated and documented backend load limits and email notification defects.
*   **Testing Email Delivery**: Written tests for email verification, marked as `fixme` to track the product defect without failing the CI pipeline.
*   **CI/CD Integration**: Integrated GitHub Actions workflow to run tests automatically and publish reports to GitHub Pages.
*   **Clear Readme**: Documentation of execution options, system architecture, and staging defects.

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

## Test Suite Coverage 

Total 18 tests, with 16 passing, 2 fixmes.

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

### `validation.spec.ts` (5 tests)
*   `rejects an amount below the minimum` - Triggers validation error for custom inputs under €20.
*   `rejects an amount above the maximum` - Triggers validation error for custom inputs over €1000.
*   `shows the custom textbox only when Other is selected` - Checks that the custom input displays conditionally.
*   `rejects an invalid buyer email`
*   `rejects an invalid recipient email`

### `success.spec.ts` (3 tests)
*   `Displays the voucher value and a voucher number`
*   `voucher email is delivered to the recipient` (marked as `fixme` due to environment bug)
*   `receipt email is delivered to the purchaser` (marked as `fixme` due to environment bug)

---

## Architecture & Code Design

- **Page Object Model (POM)**: Located in `pages/`, representing the flow pages (`VoucherPage`, `SummaryPage`, `PaymentPage`, `SuccessPage`). Inherits shared navigations and states from `BasePage`.
- **Dependency Injection**: Using customized Playwright fixtures in `fixtures/pages.ts` to automatically instantiate and clean up page objects for each test.
- **Centralised Data**: Test accounts, presets, and card configurations are maintained in `utils/testData.ts`.

---

## How to Run

### Run Online (GitHub Actions)
1. Push this project to your GitHub repository.
2. Go to the **Actions** tab on your GitHub repository page.
3. Select **Playwright Tests** and click **Run workflow**.
4. Once completed, the interactive HTML report will deploy automatically to **GitHub Pages** (and remains downloadable under **Artifacts**).
   *(Note: Ensure your repo Settings -> Actions -> Workflow permissions are set to "Read and write permissions" to allow Pages deployments).*

### Run Locally
Make sure you have Node.js installed, then run:

```bash
# Install dependencies and Playwright browsers
npm ci
npx playwright install --with-deps

# Run all test suites
npm test

# Run tests with the browser window visible
npm run test:headed

# Open the interactive HTML report
npm run report
```

---

## Environment Bugs & Mitigations

### 1. Intermittent HTTP 502 / 500 Server Errors under Load
- **Problem**: Backends intermittently return server errors during sequential runs.
- **Mitigation**: Configured Playwright to run sequentially (`workers: 1`) and created a custom fixture in `fixtures/pages.ts` that adds a 3-second delay (`settleDelay`) between tests to let the environment recover. We also set `retries: 2` in `playwright.config.ts`.
- **Diagnostics**: The custom `page` fixture listens to all responses; if a `>= 500` status code is returned, it prints the status and URL in the console (`Demo environment returned server errors`) to help separate environment errors from locator issues.

### 2. Missing Receipt and Voucher Email Delivery
- **Problem**: Mail transport does not deliver receipt or voucher emails.
- **Mitigation**: The email tests are written in `success.spec.ts` but marked with `test.fixme`. This lists the coverage gap in reports without causing build failures.
# phorest-voucher-tests
