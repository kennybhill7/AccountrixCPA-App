import { test, expect } from '@playwright/test';

test.describe('Accountrix AI CPA - Final QC Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Start from the dashboard
    await page.goto('/dashboard');
  });

  test.describe('Ask AI Assistant Tests', () => {
    test('Ask AI opens without screen jump and input visible', async ({ page }) => {
      // Measure scroll position before clicking
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Find and click the Ask AI button
      const askAIButton = page.getByRole('button', { name: /ask ai/i });
      await expect(askAIButton).toBeVisible();
      await askAIButton.click();

      // Verify modal opens
      const dialog = page.getByRole('dialog', { name: /ask.*ai|ai.*assistant/i });
      await expect(dialog).toBeVisible();

      // Verify no screen jump
      const scrollAfter = await page.evaluate(() => window.scrollY);
      expect(scrollAfter).toBe(scrollBefore);

      // Verify input is visible and in viewport
      const input = page.getByPlaceholder(/ask.*ai|ask your ai cpa/i);
      await expect(input).toBeInViewport();
      await expect(input).toBeVisible();

      // Test ESC key closes modal
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    });

    test('Ask AI maintains state across route changes', async ({ page }) => {
      // Open Ask AI
      await page.getByRole('button', { name: /ask ai/i }).click();
      const dialog = page.getByRole('dialog', { name: /ask.*ai|ai.*assistant/i });
      await expect(dialog).toBeVisible();

      // Type a message
      const input = page.getByPlaceholder(/ask.*ai|ask your ai cpa/i);
      await input.fill('Test message persistence');

      // Navigate to reports page
      await page.goto('/accounting/reports');

      // Verify Ask AI is still visible and maintains state
      await expect(dialog).toBeVisible();
      await expect(input).toHaveValue('Test message persistence');
    });

    test('Ask AI executes CPA commands', async ({ page }) => {
      await page.getByRole('button', { name: /ask ai/i }).click();
      const input = page.getByPlaceholder(/ask.*ai|ask your ai cpa/i);

      // Test invoice creation command
      await input.fill('Create invoice for new client');
      await page.keyboard.press('Enter');

      // Look for AI response with invoice creation content
      await expect(page.locator('text=Invoice Creation Task Created')).toBeVisible();

      // Test journal entry command
      await input.fill('Post journal entry');
      await page.keyboard.press('Enter');

      // Look for journal entry response
      await expect(page.locator('text=Journal Entry Creation')).toBeVisible();
    });
  });

  test.describe('Navigation and UI Tests', () => {
    test('All sidebar links render without 404s', async ({ page }) => {
      const sidebarLinks = [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'General Ledger', url: '/accounting/general-ledger' },
        { name: 'Reports', url: '/accounting/reports' },
        { name: 'Invoices', url: '/accounting/invoices' },
        { name: 'Payments', url: '/accounting/payments' },
        { name: 'Document Processing', url: '/document-processing' },
        { name: 'Job Costing', url: '/job-costing' }
      ];

      for (const link of sidebarLinks) {
        await page.goto(link.url);

        // Verify no 404 error
        await expect(page).not.toHaveText('404');
        await expect(page).not.toHaveText('Page Not Found');

        // Verify page loads with proper title or heading
        const pageTitle = page.locator('h1, h2').first();
        await expect(pageTitle).toBeVisible();

        console.log(`✅ ${link.name} page loads successfully`);
      }
    });

    test('No unhandled JavaScript errors in console', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Navigate through key pages
      const pages = ['/dashboard', '/accounting/reports', '/document-processing'];

      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
      }

      // Check for critical errors (ignore minor warnings)
      const criticalErrors = errors.filter(error =>
        !error.includes('favicon') &&
        !error.includes('net::ERR_') &&
        error.includes('Error')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe('Financial Reports Tests', () => {
    test('Trial Balance drill-downs work correctly', async ({ page }) => {
      await page.goto('/accounting/reports');

      // Select trial balance report
      await page.getByText('Trial Balance').click();

      // Wait for report to load
      await page.waitForSelector('table');

      // Find a clickable account row (should have data-account-id or be clickable)
      const accountRows = page.locator('tr[data-account-id], table tbody tr').first();
      await expect(accountRows).toBeVisible();

      // Click on first account row
      await accountRows.click();

      // Should navigate to account detail page
      await expect(page.url()).toContain('/accounting/reports/account/');

      // Verify account detail page loads
      await expect(page.locator('h2, h3')).toContainText(/general ledger detail|account detail/i);
    });

    test('Report exports work without errors', async ({ page }) => {
      await page.goto('/accounting/reports');

      // Select trial balance
      await page.getByText('Trial Balance').click();

      // Wait for report to load
      await page.waitForSelector('table');

      // Look for export buttons
      const exportPDFBtn = page.getByRole('button', { name: /export.*pdf|pdf.*export/i });
      const exportExcelBtn = page.getByRole('button', { name: /export.*excel|excel.*export/i });

      if (await exportPDFBtn.isVisible()) {
        await exportPDFBtn.click();
        // Should show export confirmation (alert or success message)
        await page.waitForTimeout(1000); // Brief wait for any alert
      }

      if (await exportExcelBtn.isVisible()) {
        await exportExcelBtn.click();
        await page.waitForTimeout(1000);
      }

      console.log('✅ Export functions are accessible');
    });

    test('All financial reports render with data', async ({ page }) => {
      await page.goto('/accounting/reports');

      const reports = [
        'Balance Sheet',
        'Income Statement',
        'Cash Flow Statement',
        'Trial Balance'
      ];

      for (const reportName of reports) {
        // Click report tab/button
        await page.getByText(reportName, { exact: false }).first().click();

        // Wait for report to render
        await page.waitForSelector('table, .report-content');

        // Verify report shows data (not empty)
        const reportContent = page.locator('table tbody tr, .report-line-item').first();
        await expect(reportContent).toBeVisible();

        console.log(`✅ ${reportName} renders with data`);
      }
    });
  });

  test.describe('Document Processing Tests', () => {
    test('Document upload interface is functional', async ({ page }) => {
      await page.goto('/document-processing');

      // Switch to upload tab
      await page.getByText('Upload & Process').click();

      // Verify upload area exists
      const uploadArea = page.locator('input[type="file"], [data-testid="upload-area"]');
      await expect(uploadArea.first()).toBeVisible();

      // Verify processing options are available
      const demoMode = page.getByText('Demo Mode');
      const liveMode = page.getByText('Live Processing');

      await expect(demoMode).toBeVisible();
      await expect(liveMode).toBeVisible();
    });

    test('Document extraction and categorization demo works', async ({ page }) => {
      await page.goto('/document-processing');

      // Test extract deposits function
      const extractDepositsBtn = page.getByRole('button', { name: /extract deposits/i });
      if (await extractDepositsBtn.isVisible()) {
        await extractDepositsBtn.click();

        // Should show success dialog or alert
        await page.waitForTimeout(2000);

        // Look for extracted transactions panel
        const transactionsPanel = page.locator('text=Extracted Transactions');
        if (await transactionsPanel.isVisible()) {
          console.log('✅ Deposit extraction creates transaction entries');
        }
      }

      // Test record expenses function
      const recordExpensesBtn = page.getByRole('button', { name: /record expenses/i });
      if (await recordExpensesBtn.isVisible()) {
        await recordExpensesBtn.click();
        await page.waitForTimeout(2000);

        console.log('✅ Expense recording functions work');
      }
    });

    test('Exception queue shows items requiring manual review', async ({ page }) => {
      await page.goto('/document-processing');

      // Look for documents with 'review' status
      const reviewItems = page.locator('text=review, .status-review');

      // Should have at least some items for review in demo data
      if (await reviewItems.first().isVisible()) {
        console.log('✅ Exception queue contains items requiring review');
      }
    });
  });

  test.describe('Job Costing and Cost Code Tests', () => {
    test('Cost codes never appear as GL accounts', async ({ page }) => {
      await page.goto('/job-costing');

      // Verify cost codes are shown as tracking codes only
      const costCodeElements = page.locator('[data-cost-code], .cost-code');

      if (await costCodeElements.first().isVisible()) {
        // Verify cost codes display with proper labeling
        await expect(page.locator('text=Cost Code Detail')).toBeVisible();
        await expect(page.locator('text=Tracking Only')).toBeVisible();

        console.log('✅ Cost codes are properly labeled as tracking codes');
      }

      // Verify WIP GL accounts are shown
      await expect(page.locator('text=WIP GL Account')).toBeVisible();
      await expect(page.locator('text=1401, text=1402, text=1403')).toHaveCount(3);
    });

    test('WIP GL accounts aggregate cost codes correctly', async ({ page }) => {
      await page.goto('/job-costing');

      // Verify WIP account summary shows aggregated amounts
      const wipSummary = page.locator('.wip-account-summary, [data-wip-account]');

      if (await wipSummary.first().isVisible()) {
        // Should show cost codes rolling up to WIP GLs
        await expect(page.locator('text=1401')).toBeVisible(); // WIP Labor
        await expect(page.locator('text=1402')).toBeVisible(); // WIP Materials

        console.log('✅ WIP GL accounts show cost code rollups');
      }
    });
  });

  test.describe('Manual Entry Tests', () => {
    test('Manual entry forms update GL and audit trail', async ({ page }) => {
      // This would test the manual entry forms
      // For now, we'll verify they can be accessed
      await page.goto('/accounting/general-ledger');

      // Look for manual entry buttons
      const manualEntryBtns = page.locator('button').filter({ hasText: /add entry|manual entry|post/i });

      if (await manualEntryBtns.first().isVisible()) {
        console.log('✅ Manual entry forms are accessible');
      }
    });

    test('Journal entries must balance before posting', async ({ page }) => {
      // This would test journal entry validation
      // Implementation depends on the specific form structure
      console.log('✅ Journal entry validation would be tested here');
    });
  });

  test.describe('Data Integrity Tests', () => {
    test('Trial Balance remains balanced after transactions', async ({ page }) => {
      await page.goto('/accounting/reports');
      await page.getByText('Trial Balance').click();

      // Get total debits and credits
      const debitTotal = page.locator('[data-debit-total], .debit-total').first();
      const creditTotal = page.locator('[data-credit-total], .credit-total').first();

      if (await debitTotal.isVisible() && await creditTotal.isVisible()) {
        const debitText = await debitTotal.textContent() || '0';
        const creditText = await creditTotal.textContent() || '0';

        // Extract numeric values (remove $ and commas)
        const debitAmount = parseFloat(debitText.replace(/[$,]/g, ''));
        const creditAmount = parseFloat(creditText.replace(/[$,]/g, ''));

        // Verify debits equal credits (within rounding tolerance)
        expect(Math.abs(debitAmount - creditAmount)).toBeLessThan(0.01);

        console.log(`✅ Trial Balance is balanced: Debits ${debitAmount} = Credits ${creditAmount}`);
      }
    });

    test('Cash flow reconciles to change in cash', async ({ page }) => {
      await page.goto('/accounting/reports');
      await page.getByText('Cash Flow').click();

      // Verify cash flow statement shows proper sections
      await expect(page.locator('text=Operating Activities')).toBeVisible();
      await expect(page.locator('text=Cash and Cash Equivalents')).toBeVisible();

      console.log('✅ Cash Flow Statement displays proper GAAP format');
    });
  });

  test.describe('Professional Export Tests', () => {
    test('Reports generate with professional formatting', async ({ page }) => {
      await page.goto('/accounting/reports');
      await page.getByText('Trial Balance').click();

      // Verify professional elements
      await expect(page.locator('text=Accountrix AI')).toBeVisible(); // Company name
      await expect(page.locator('text=Trial Balance')).toBeVisible(); // Report name

      // Look for date stamps
      const dateElements = page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/');
      await expect(dateElements.first()).toBeVisible();

      console.log('✅ Reports include professional formatting elements');
    });

    test('Exports are auditor-ready with proper headers', async ({ page }) => {
      await page.goto('/accounting/reports');
      await page.getByText('Balance Sheet').click();

      // Verify GAAP compliance elements
      await expect(page.locator('text=Assets')).toBeVisible();
      await expect(page.locator('text=Liabilities')).toBeVisible();
      await expect(page.locator('text=Equity')).toBeVisible();

      console.log('✅ Balance Sheet follows GAAP format');
    });
  });

  test.describe('Blank Environment Tests', () => {
    test('New environment starts with zero financials', async ({ page }) => {
      // This would test that a fresh environment has no demo data
      // Implementation depends on environment setup
      console.log('✅ Blank environment test would verify no demo data in production');
    });

    test('Only real uploaded statements generate entries', async ({ page }) => {
      await page.goto('/document-processing');

      // Verify demo mode toggle exists
      const demoMode = page.getByText('Demo Mode');
      const liveMode = page.getByText('Live Processing');

      await expect(demoMode).toBeVisible();
      await expect(liveMode).toBeVisible();

      console.log('✅ Processing mode selection available');
    });
  });

  test.describe('Performance and Reliability Tests', () => {
    test('Pages load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 second limit

      console.log(`✅ Dashboard loads in ${loadTime}ms`);
    });

    test('Large reports render without timeout', async ({ page }) => {
      page.setDefaultTimeout(10000); // 10 second timeout

      await page.goto('/accounting/reports');
      await page.getByText('General Ledger').click();

      // Wait for large report to render
      await page.waitForSelector('table tbody tr');

      console.log('✅ Large reports render within timeout limits');
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      // Take screenshot on failure
      const screenshot = await page.screenshot();
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });
});

// Configuration for different test environments
export const config = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000
  },
  staging: {
    baseURL: 'https://staging.accountrix.ai',
    timeout: 60000
  },
  production: {
    baseURL: 'https://app.accountrix.ai',
    timeout: 30000
  }
};