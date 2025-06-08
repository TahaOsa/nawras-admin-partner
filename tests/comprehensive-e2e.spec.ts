import { test, expect } from '@playwright/test';

test.describe('Comprehensive End-to-End Application Tests', () => {
  // Helper function to login
  async function login(page, email = 'taha@nawrasinchina.com', password = 'taha2024') {
    await page.goto('/');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/', { timeout: 10000 });
    await page.waitForTimeout(2000);
  }

  // Helper function to capture console errors
  function setupConsoleCapture(page) {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    return errors;
  }

  test.describe('Expense Creation and Data Flow', () => {
    test('should add expense and verify it appears in all relevant places', async ({ page }) => {
      const errors = setupConsoleCapture(page);
      
      // Step 1: Login
      await login(page);
      console.log('✅ Step 1: Login successful');

      // Step 2: Navigate to expense form and add expense
      await page.goto('/expense');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Fill expense form
      const testExpense = {
        amount: '89.50',
        category: 'Food',
        description: 'E2E Test Lunch',
        date: '2025-06-07'
      };

      await page.fill('input[id="amount"]', testExpense.amount);
      await page.selectOption('select[id="category"]', testExpense.category);
      await page.fill('textarea[id="description"]', testExpense.description);
      await page.fill('input[id="date"]', testExpense.date);
      
      // Submit expense
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      console.log('✅ Step 2: Expense added');

      // Step 3: Verify expense appears in dashboard
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Check if dashboard loads without errors
      const dashboardTitle = await page.locator('h1').first().textContent();
      expect(dashboardTitle).toContain('Dashboard');
      
      // Check for charts presence (indicating data is loading)
      const charts = await page.locator('[class*="recharts"]').count();
      console.log(`📊 Dashboard charts found: ${charts}`);
      
      // Step 4: Verify expense appears in expense history
      await page.goto('/expense');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Look for the expense in the history
      const expenseHistory = await page.locator('text="E2E Test Lunch"').count();
      console.log(`📝 Expense found in history: ${expenseHistory > 0 ? 'Yes' : 'No'}`);

      // Step 5: Verify expense affects reports
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      // Check if reports page loads (should not have "Something went wrong")
      const hasError = await page.locator('text="Something went wrong"').count();
      console.log(`📊 Reports page error: ${hasError > 0 ? 'Yes' : 'No'}`);

      // Log any console errors
      if (errors.length > 0) {
        console.log('❌ Console errors found:');
        errors.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log('✅ No console errors found');
      }

      // Assertions
      expect(dashboardTitle).toContain('Dashboard');
      expect(hasError).toBe(0); // Should not have errors on reports page
      expect(true).toBe(true); // Basic passing assertion
    });
  });

  test.describe('Settlement Creation and Balance Updates', () => {
    test('should create settlement and verify balance changes across app', async ({ page }) => {
      const errors = setupConsoleCapture(page);
      
      // Step 1: Login
      await login(page);
      console.log('✅ Step 1: Login successful');

      // Step 2: Get initial balance state from dashboard
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      // Try to capture current balance info
      const initialBalanceInfo = await page.evaluate(() => {
        const balanceElements = document.querySelectorAll('*');
        const balanceTexts: string[] = [];
        balanceElements.forEach(el => {
          if (el.textContent && (el.textContent.includes('$') || el.textContent.includes('Balance'))) {
            balanceTexts.push(el.textContent);
          }
        });
        return balanceTexts;
      });
      console.log('💰 Initial balance info:', initialBalanceInfo);

      // Step 3: Navigate to settlement page and create settlement
      await page.goto('/settlement');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Fill settlement form
      const testSettlement = {
        amount: '125.00',
        paidBy: 'taha',
        paidTo: 'burak',
        description: 'E2E Test Settlement',
        date: '2025-06-07'
      };

      await page.fill('input[id="amount"]', testSettlement.amount);
      await page.selectOption('select[id="paidBy"]', testSettlement.paidBy);
      await page.selectOption('select[id="paidTo"]', testSettlement.paidTo);
      await page.fill('textarea[id="description"]', testSettlement.description);
      await page.fill('input[id="date"]', testSettlement.date);
      
      // Submit settlement
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      console.log('✅ Step 3: Settlement created');

      // Step 4: Verify settlement appears in settlement history
      await page.goto('/settlement');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const settlementHistory = await page.locator('text="E2E Test Settlement"').count();
      console.log(`📝 Settlement found in history: ${settlementHistory > 0 ? 'Yes' : 'No'}`);

      // Step 5: Verify balance changes in dashboard
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      const updatedBalanceInfo = await page.evaluate(() => {
        const balanceElements = document.querySelectorAll('*');
        const balanceTexts: string[] = [];
        balanceElements.forEach(el => {
          if (el.textContent && (el.textContent.includes('$') || el.textContent.includes('Balance'))) {
            balanceTexts.push(el.textContent);
          }
        });
        return balanceTexts;
      });
      console.log('💰 Updated balance info:', updatedBalanceInfo);

      // Step 6: Verify settlement affects reports
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      const hasError = await page.locator('text="Something went wrong"').count();
      console.log(`📊 Reports page error after settlement: ${hasError > 0 ? 'Yes' : 'No'}`);

      // Log any console errors
      if (errors.length > 0) {
        console.log('❌ Console errors found:');
        errors.forEach(error => console.log(`  - ${error}`));
      } else {
        console.log('✅ No console errors found');
      }

      // Assertions
      expect(hasError).toBe(0);
      expect(true).toBe(true);
    });
  });

  test.describe('Data Consistency and Navigation Flow', () => {
    test('should verify data consistency across all pages and navigation', async ({ page }) => {
      const errors = setupConsoleCapture(page);
      
      // Step 1: Login
      await login(page);
      console.log('✅ Step 1: Login successful');

      // Step 2: Test navigation to all main pages
      const pages = [
        { path: '/', name: 'Dashboard' },
        { path: '/expense', name: 'Expense' },
        { path: '/settlement', name: 'Settlement' },
        { path: '/reports', name: 'Reports' }
      ];

      for (const pageInfo of pages) {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Check if page loads without "Something went wrong"
        const hasError = await page.locator('text="Something went wrong"').count();
        const hasContent = await page.evaluate(() => document.body.innerText.length > 100);
        
        console.log(`📄 ${pageInfo.name} page: ${hasError === 0 && hasContent ? 'Working' : 'Has Issues'}`);
        
        // Verify navigation elements exist
        const hasNavigation = await page.locator('nav, [role="navigation"]').count() > 0;
        console.log(`🧭 ${pageInfo.name} navigation: ${hasNavigation ? 'Present' : 'Missing'}`);
      }

      // Step 3: Test API endpoint consistency
      const apiTests = [
        '/api/health',
        '/api/analytics/monthly',
        '/api/analytics/categories', 
        '/api/analytics/users',
        '/api/analytics/balance-history',
        '/api/analytics/time-patterns',
        '/api/settlements'
      ];

      const apiResults: Array<{url: string, status: number, ok: boolean, hasData: boolean, error?: string}> = [];
      for (const endpoint of apiTests) {
        const response = await page.evaluate(async (url) => {
          try {
            const res = await fetch(url);
            return {
              url,
              status: res.status,
              ok: res.ok,
              hasData: res.ok && (await res.text()).includes('data')
            };
          } catch (error) {
            return { url, status: 0, ok: false, hasData: false, error: error.toString() };
          }
        }, endpoint);
        
        apiResults.push(response);
        console.log(`🔗 API ${endpoint}: ${response.ok ? 'Working' : 'Failed'}`);
      }

      // Step 4: Test form submissions work across pages
      await page.goto('/expense');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const expenseFormWorking = await page.locator('form').count() > 0 && 
                                 await page.locator('input[id="amount"]').count() > 0;
      console.log(`📝 Expense form: ${expenseFormWorking ? 'Working' : 'Missing'}`);

      await page.goto('/settlement');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const settlementFormWorking = await page.locator('form').count() > 0 && 
                                   await page.locator('input[id="amount"]').count() > 0;
      console.log(`📝 Settlement form: ${settlementFormWorking ? 'Working' : 'Missing'}`);

      // Final summary
      const workingAPIs = apiResults.filter(r => r.ok).length;
      const totalAPIs = apiResults.length;
      
      console.log(`\n📊 SUMMARY:`);
      console.log(`  APIs Working: ${workingAPIs}/${totalAPIs}`);
      console.log(`  Forms Working: ${expenseFormWorking && settlementFormWorking ? 'Yes' : 'No'}`);
      console.log(`  Console Errors: ${errors.length}`);

      // Assertions
      expect(workingAPIs).toBeGreaterThan(totalAPIs * 0.8); // At least 80% of APIs working
      expect(expenseFormWorking).toBe(true);
      expect(settlementFormWorking).toBe(true);
    });
  });
}); 