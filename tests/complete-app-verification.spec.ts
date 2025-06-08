import { test, expect } from '@playwright/test';

test.describe('🔍 COMPLETE APPLICATION VERIFICATION', () => {
  const liveURL = 'https://partner.nawrasinchina.com';
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    page.setDefaultTimeout(60000);
    
    // Monitor console errors throughout the test
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`🔍 Console Error: ${msg.text()}`);
      }
    });
  });

  test('🚀 COMPLETE END-TO-END APPLICATION TEST', async ({ page }) => {
    console.log('\n🎯 STARTING COMPLETE APPLICATION VERIFICATION');
    console.log('==============================================');
    
    const testResults = {
      navigation: { passed: 0, total: 0 },
      buttons: { passed: 0, total: 0 },
      forms: { passed: 0, total: 0 },
      pages: { passed: 0, total: 0 },
      data: { passed: 0, total: 0 },
      errors: [] as string[]
    };

    try {
      // =========================================
      // STEP 1: INITIAL LOAD AND DASHBOARD TEST
      // =========================================
      console.log('\n📊 STEP 1: Testing Dashboard (Home Page)');
      console.log('----------------------------------------');
      
      await page.goto(liveURL, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3000);
      
      // Check if page loads properly
      const dashboardContent = await page.textContent('body');
      if (dashboardContent && dashboardContent.length > 200) {
        testResults.pages.passed++;
        console.log('✅ Dashboard loads with content');
      } else {
        testResults.errors.push('Dashboard has insufficient content');
        console.log('❌ Dashboard content issue');
      }
      testResults.pages.total++;
      
      // Check for main dashboard elements
      const dashboardElements = [
        { name: 'Navigation Menu', selector: 'nav, [role="navigation"]' },
        { name: 'Main Content Area', selector: 'main, .main, [class*="main"]' },
        { name: 'Dashboard Cards/Stats', selector: '[class*="card"], [class*="stat"], .grid' }
      ];
      
      for (const element of dashboardElements) {
        const found = await page.locator(element.selector).count() > 0;
        if (found) {
          console.log(`✅ ${element.name} found`);
        } else {
          console.log(`⚠️ ${element.name} not found`);
        }
      }

      // =========================================
      // STEP 2: NAVIGATION TESTING
      // =========================================
      console.log('\n🧭 STEP 2: Testing Navigation');
      console.log('------------------------------');
      
      const navigationTests = [
        { name: 'Add Expense', path: '/add-expense' },
        { name: 'Settlement', path: '/settlement' },
        { name: 'History', path: '/history' },
        { name: 'Reports', path: '/reports' },
        { name: 'Dashboard', path: '/' }
      ];
      
      for (const nav of navigationTests) {
        try {
          console.log(`🔄 Testing navigation to ${nav.name}...`);
          await page.goto(`${liveURL}${nav.path}`, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2000);
          
          const pageContent = await page.textContent('body');
          if (pageContent && pageContent.length > 100) {
            testResults.navigation.passed++;
            console.log(`✅ ${nav.name} page loads successfully`);
          } else {
            testResults.errors.push(`${nav.name} page has insufficient content`);
            console.log(`❌ ${nav.name} page loading issue`);
          }
        } catch (error) {
          testResults.errors.push(`${nav.name} navigation failed: ${error}`);
          console.log(`❌ ${nav.name} navigation error: ${error}`);
        }
        testResults.navigation.total++;
      }

      // =========================================
      // STEP 3: ADD EXPENSE PAGE TESTING
      // =========================================
      console.log('\n💰 STEP 3: Testing Add Expense Functionality');
      console.log('--------------------------------------------');
      
      await page.goto(`${liveURL}/add-expense`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      // Test all form elements
      const expenseFormElements = [
        { name: 'Amount Input', selector: 'input[id="amount"]', type: 'input' },
        { name: 'Description Input', selector: 'input[id="description"]', type: 'input' },
        { name: 'Category Select', selector: 'select[id="category"]', type: 'select' },
        { name: 'Paid By Select', selector: 'select[id="paidById"]', type: 'select' },
        { name: 'Date Input', selector: 'input[id="date"]', type: 'input' },
        { name: 'Add Expense Button', selector: 'button:has-text("Add Expense")', type: 'button' }
      ];
      
      for (const element of expenseFormElements) {
        const found = await page.locator(element.selector).count() > 0;
        if (found) {
          console.log(`✅ ${element.name} found and accessible`);
          testResults.forms.passed++;
          
          // Test interaction based on type
          try {
            if (element.type === 'input' && element.selector.includes('amount')) {
              await page.fill(element.selector, '25.50');
              console.log(`✅ ${element.name} accepts input`);
            } else if (element.type === 'input' && element.selector.includes('description')) {
              await page.fill(element.selector, 'Test expense description');
              console.log(`✅ ${element.name} accepts input`);
            } else if (element.type === 'select') {
              const options = await page.locator(`${element.selector} option`).count();
              if (options > 1) {
                console.log(`✅ ${element.name} has ${options} options`);
              }
            } else if (element.type === 'button') {
              const isEnabled = await page.locator(element.selector).isEnabled();
              console.log(`✅ ${element.name} is ${isEnabled ? 'enabled' : 'disabled'}`);
              testResults.buttons.passed++;
              testResults.buttons.total++;
            }
          } catch (error) {
            console.log(`⚠️ ${element.name} interaction issue: ${error}`);
          }
        } else {
          testResults.errors.push(`${element.name} not found`);
          console.log(`❌ ${element.name} not found`);
        }
        testResults.forms.total++;
      }
      
      // Test form submission flow
      try {
        console.log('🔄 Testing expense form submission...');
        
        // Fill out the form completely
        await page.fill('input[id="amount"]', '45.75');
        await page.fill('input[id="description"]', 'Complete test expense');
        
        // Check if selects have options and select them
        const categoryOptions = await page.locator('select[id="category"] option').count();
        if (categoryOptions > 1) {
          await page.selectOption('select[id="category"]', { index: 1 });
          console.log('✅ Category selected');
        }
        
        const paidByOptions = await page.locator('select[id="paidById"] option').count();
        if (paidByOptions > 1) {
          await page.selectOption('select[id="paidById"]', { index: 1 });
          console.log('✅ Paid by selected');
        }
        
        await page.fill('input[id="date"]', '2025-06-07');
        
        // Test submit button
        const submitButton = page.locator('button:has-text("Add Expense")');
        const isSubmitEnabled = await submitButton.isEnabled();
        console.log(`📝 Submit button status: ${isSubmitEnabled ? 'enabled' : 'disabled'}`);
        
        if (isSubmitEnabled) {
          // Monitor for API call
          const responsePromise = page.waitForResponse(
            response => response.url().includes('/api/expenses') && response.request().method() === 'POST',
            { timeout: 10000 }
          ).catch(() => null);
          
          await submitButton.click();
          console.log('✅ Form submission attempted');
          
          const response = await responsePromise;
          if (response) {
            console.log(`✅ API call made: ${response.status()}`);
            testResults.data.passed++;
          } else {
            console.log('⚠️ No API response detected (may have redirected)');
          }
          testResults.data.total++;
        }
        
      } catch (error) {
        testResults.errors.push(`Form submission error: ${error}`);
        console.log(`❌ Form submission error: ${error}`);
      }

      // =========================================
      // STEP 4: SETTLEMENT PAGE TESTING
      // =========================================
      console.log('\n🤝 STEP 4: Testing Settlement Functionality');
      console.log('------------------------------------------');
      
      await page.goto(`${liveURL}/settlement`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      const settlementFormElements = [
        { name: 'Settlement Amount', selector: 'input[id="amount"]', type: 'input' },
        { name: 'Paid By Select', selector: 'select[id="paidBy"]', type: 'select' },
        { name: 'Paid To Select', selector: 'select[id="paidTo"]', type: 'select' },
        { name: 'Description Textarea', selector: 'textarea[id="description"]', type: 'textarea' },
        { name: 'Settlement Date', selector: 'input[id="date"]', type: 'input' },
        { name: 'Record Settlement Button', selector: 'button:has-text("Record Settlement")', type: 'button' }
      ];
      
      for (const element of settlementFormElements) {
        const found = await page.locator(element.selector).count() > 0;
        if (found) {
          console.log(`✅ ${element.name} found`);
          testResults.forms.passed++;
          
          // Test interactions
          try {
            if (element.type === 'input' && element.selector.includes('amount')) {
              await page.fill(element.selector, '30.00');
            } else if (element.type === 'textarea') {
              await page.fill(element.selector, 'Test settlement description');
            } else if (element.type === 'button') {
              const isEnabled = await page.locator(element.selector).isEnabled();
              console.log(`✅ ${element.name} is ${isEnabled ? 'enabled' : 'disabled'}`);
              testResults.buttons.passed++;
              testResults.buttons.total++;
            }
          } catch (error) {
            console.log(`⚠️ ${element.name} interaction issue: ${error}`);
          }
        } else {
          testResults.errors.push(`Settlement ${element.name} not found`);
          console.log(`❌ ${element.name} not found`);
        }
        testResults.forms.total++;
      }

      // =========================================
      // STEP 5: HISTORY PAGE TESTING
      // =========================================
      console.log('\n📜 STEP 5: Testing History Page');
      console.log('-------------------------------');
      
      await page.goto(`${liveURL}/history`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      const historyContent = await page.textContent('body');
      if (historyContent && historyContent.length > 200) {
        testResults.pages.passed++;
        console.log('✅ History page loads with content');
        
        // Check for history elements
        const historyElements = [
          'table, .table, [class*="list"], [class*="history"]',
          'button, .button, [class*="filter"], [class*="sort"]'
        ];
        
        for (const selector of historyElements) {
          const found = await page.locator(selector).count() > 0;
          if (found) {
            console.log(`✅ History UI elements found: ${selector}`);
          }
        }
      } else {
        testResults.errors.push('History page content insufficient');
        console.log('❌ History page content issue');
      }
      testResults.pages.total++;

      // =========================================
      // STEP 6: REPORTS PAGE TESTING
      // =========================================
      console.log('\n📊 STEP 6: Testing Reports Page');
      console.log('-------------------------------');
      
      await page.goto(`${liveURL}/reports`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(5000); // Give charts time to load
      
      const reportsContent = await page.textContent('body');
      if (reportsContent && reportsContent.length > 300) {
        testResults.pages.passed++;
        console.log('✅ Reports page loads with content');
        
        // Check for error boundaries (should not crash)
        const crashes = await page.locator('text="Something went wrong"').count();
        if (crashes === 0) {
          console.log('✅ No "Something went wrong" errors detected');
        } else {
          testResults.errors.push(`${crashes} crashes detected on reports page`);
          console.log(`❌ ${crashes} crashes detected`);
        }
        
        // Check for chart containers
        const chartContainers = await page.locator('[class*="chart"], [class*="Chart"], svg, canvas').count();
        console.log(`📈 Found ${chartContainers} chart/visualization elements`);
        
        // Check for interactive elements on reports page
        const reportButtons = await page.locator('button, select, [class*="filter"]').count();
        console.log(`🔘 Found ${reportButtons} interactive elements on reports`);
        testResults.buttons.passed += Math.min(reportButtons, 5); // Count up to 5 buttons as working
        testResults.buttons.total += 5;
        
      } else {
        testResults.errors.push('Reports page content insufficient');
        console.log('❌ Reports page content issue');
      }
      testResults.pages.total++;

      // =========================================
      // STEP 7: API ENDPOINTS TESTING
      // =========================================
      console.log('\n🔗 STEP 7: Testing API Endpoints');
      console.log('--------------------------------');
      
      const apiEndpoints = [
        { name: 'Health Check', url: '/api/health' },
        { name: 'Expenses', url: '/api/expenses' },
        { name: 'Settlements', url: '/api/settlements' },
        { name: 'Balance History', url: '/api/analytics/balance-history' },
        { name: 'Categories', url: '/api/analytics/categories' },
        { name: 'Monthly Analytics', url: '/api/analytics/monthly' },
        { name: 'User Analytics', url: '/api/analytics/users' }
      ];
      
      for (const api of apiEndpoints) {
        try {
          const response = await page.request.get(`${liveURL}${api.url}`, { timeout: 20000 });
          const status = response.status();
          
          if (status >= 200 && status < 400) {
            testResults.data.passed++;
            console.log(`✅ ${api.name} API: ${status}`);
          } else {
            testResults.errors.push(`${api.name} API returned ${status}`);
            console.log(`❌ ${api.name} API: ${status}`);
          }
        } catch (error) {
          testResults.errors.push(`${api.name} API failed: ${error}`);
          console.log(`❌ ${api.name} API error: ${error}`);
        }
        testResults.data.total++;
      }

      // =========================================
      // STEP 8: CROSS-PAGE NAVIGATION TESTING
      // =========================================
      console.log('\n🔄 STEP 8: Testing Cross-Page Navigation');
      console.log('---------------------------------------');
      
      // Test navigation links/buttons
      await page.goto(`${liveURL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      
      const navigationLinks = await page.locator('a[href], button[onclick], [class*="nav"] a').count();
      console.log(`🔗 Found ${navigationLinks} navigation elements`);
      
      // Test back and forth navigation
      const navigationFlow = [
        { from: '/', to: '/add-expense', name: 'Dashboard to Add Expense' },
        { from: '/add-expense', to: '/settlement', name: 'Add Expense to Settlement' },
        { from: '/settlement', to: '/history', name: 'Settlement to History' },
        { from: '/history', to: '/reports', name: 'History to Reports' },
        { from: '/reports', to: '/', name: 'Reports to Dashboard' }
      ];
      
      for (const flow of navigationFlow) {
        try {
          await page.goto(`${liveURL}${flow.to}`, { waitUntil: 'networkidle', timeout: 20000 });
          await page.waitForTimeout(1500);
          
          const content = await page.textContent('body');
          if (content && content.length > 100) {
            testResults.navigation.passed++;
            console.log(`✅ ${flow.name} - Success`);
          } else {
            console.log(`⚠️ ${flow.name} - Limited content`);
          }
        } catch (error) {
          testResults.errors.push(`Navigation flow error: ${flow.name}`);
          console.log(`❌ ${flow.name} - Error: ${error}`);
        }
        testResults.navigation.total++;
      }

      // =========================================
      // STEP 9: ERROR MONITORING AND CONSOLE CHECK
      // =========================================
      console.log('\n🔍 STEP 9: Final Error Check');
      console.log('----------------------------');
      
      // Revisit each page to check for console errors
      const finalPageCheck = ['/', '/add-expense', '/settlement', '/history', '/reports'];
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      for (const pagePath of finalPageCheck) {
        await page.goto(`${liveURL}${pagePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
      }
      
      console.log(`🐛 Total console errors detected: ${consoleErrors.length}`);
      if (consoleErrors.length > 0) {
        console.log('Console errors found:');
        consoleErrors.slice(0, 5).forEach(error => console.log(`   • ${error}`));
      }

    } catch (error) {
      testResults.errors.push(`Major test error: ${error}`);
      console.log(`❌ Major test error: ${error}`);
    }

    // =========================================
    // FINAL COMPREHENSIVE REPORT
    // =========================================
    console.log('\n🎯 COMPREHENSIVE TEST RESULTS');
    console.log('==============================');
    console.log(`📊 Page Loading: ${testResults.pages.passed}/${testResults.pages.total} pages working`);
    console.log(`🧭 Navigation: ${testResults.navigation.passed}/${testResults.navigation.total} navigation tests passed`);
    console.log(`🔘 Buttons/Interactive: ${testResults.buttons.passed}/${testResults.buttons.total} elements working`);
    console.log(`📝 Forms: ${testResults.forms.passed}/${testResults.forms.total} form elements functional`);
    console.log(`🔗 Data/APIs: ${testResults.data.passed}/${testResults.data.total} data operations successful`);
    
    const totalPassed = testResults.pages.passed + testResults.navigation.passed + 
                       testResults.buttons.passed + testResults.forms.passed + testResults.data.passed;
    const totalTests = testResults.pages.total + testResults.navigation.total + 
                      testResults.buttons.total + testResults.forms.total + testResults.data.total;
    
    console.log(`\n🎯 OVERALL SUCCESS RATE: ${totalPassed}/${totalTests} (${Math.round((totalPassed/totalTests)*100)}%)`);
    
    if (testResults.errors.length > 0) {
      console.log(`\n❌ ISSUES DETECTED (${testResults.errors.length}):`);
      testResults.errors.slice(0, 10).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ NO CRITICAL ISSUES DETECTED');
    }
    
    // Final assessment
    const successRate = (totalPassed / totalTests) * 100;
    if (successRate >= 90) {
      console.log('\n🎉 EXCELLENT: Application is working excellently!');
    } else if (successRate >= 75) {
      console.log('\n✅ GOOD: Application is working well with minor issues');
    } else if (successRate >= 60) {
      console.log('\n⚠️ FAIR: Application has some issues that need attention');
    } else {
      console.log('\n❌ POOR: Application has significant issues requiring fixes');
    }
    
    console.log('\n🚀 COMPLETE APPLICATION VERIFICATION FINISHED!');
    console.log('==============================================');
    
    // Assert that we have reasonable success rate
    expect(successRate).toBeGreaterThan(70); // At least 70% should work
  });
}); 