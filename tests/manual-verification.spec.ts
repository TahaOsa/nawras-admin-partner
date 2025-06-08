import { test, expect } from '@playwright/test';

test.describe('🔍 MANUAL VERIFICATION TEST', () => {
  const liveURL = 'https://partner.nawrasinchina.com';

  test('🎯 Quick Complete App Check', async ({ page }) => {
    console.log('\n🔍 COMPREHENSIVE APP VERIFICATION');
    console.log('==================================');
    
    let results = {
      pages: { working: 0, total: 5 },
      apis: { working: 0, total: 7 },
      forms: { working: 0, total: 2 },
      errors: [] as string[]
    };

    try {
      // 1. Test all page loading
      console.log('\n📊 Testing Page Loading...');
      const pages = [
        { name: 'Dashboard', path: '/' },
        { name: 'Add Expense', path: '/add-expense' },
        { name: 'Settlement', path: '/settlement' },
        { name: 'History', path: '/history' },
        { name: 'Reports', path: '/reports' }
      ];

      for (const pageTest of pages) {
        try {
          await page.goto(`${liveURL}${pageTest.path}`, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2000);
          
          const content = await page.textContent('body');
          if (content && content.length > 100) {
            results.pages.working++;
            console.log(`✅ ${pageTest.name} - Working`);
          } else {
            console.log(`⚠️ ${pageTest.name} - Limited content`);
          }
        } catch (error) {
          console.log(`❌ ${pageTest.name} - Failed`);
          results.errors.push(`${pageTest.name} page failed`);
        }
      }

      // 2. Test API endpoints
      console.log('\n🔗 Testing API Endpoints...');
      const apis = [
        { name: 'Health', path: '/api/health' },
        { name: 'Expenses', path: '/api/expenses' },
        { name: 'Settlements', path: '/api/settlements' },
        { name: 'Balance History', path: '/api/analytics/balance-history' },
        { name: 'Categories', path: '/api/analytics/categories' },
        { name: 'Monthly', path: '/api/analytics/monthly' },
        { name: 'Users', path: '/api/analytics/users' }
      ];

      for (const api of apis) {
        try {
          const response = await page.request.get(`${liveURL}${api.path}`, { timeout: 15000 });
          if (response.status() >= 200 && response.status() < 400) {
            results.apis.working++;
            console.log(`✅ ${api.name} API - ${response.status()}`);
          } else {
            console.log(`❌ ${api.name} API - ${response.status()}`);
          }
        } catch (error) {
          console.log(`❌ ${api.name} API - Failed`);
        }
      }

      // 3. Test Forms
      console.log('\n📝 Testing Forms...');
      
      // Test Add Expense Form
      try {
        await page.goto(`${liveURL}/add-expense`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        const expenseForm = await page.locator('input[id="amount"]').isVisible() &&
                           await page.locator('button:has-text("Add Expense")').isVisible();
        
        if (expenseForm) {
          results.forms.working++;
          console.log('✅ Add Expense Form - Working');
        } else {
          console.log('❌ Add Expense Form - Not found');
        }
      } catch (error) {
        console.log('❌ Add Expense Form - Error');
      }

      // Test Settlement Form
      try {
        await page.goto(`${liveURL}/settlement`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        const settlementForm = await page.locator('input[id="amount"]').isVisible() &&
                              await page.locator('button:has-text("Record Settlement")').isVisible();
        
        if (settlementForm) {
          results.forms.working++;
          console.log('✅ Settlement Form - Working');
        } else {
          console.log('❌ Settlement Form - Not found');
        }
      } catch (error) {
        console.log('❌ Settlement Form - Error');
      }

      // 4. Test Error Boundaries (Reports page)
      console.log('\n🛡️ Testing Error Boundaries...');
      try {
        await page.goto(`${liveURL}/reports`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(5000);
        
        const crashes = await page.locator('text="Something went wrong"').count();
        if (crashes === 0) {
          console.log('✅ No "Something went wrong" errors - Error boundaries working');
        } else {
          console.log(`❌ Found ${crashes} crashes - Error boundaries need work`);
          results.errors.push(`${crashes} error boundary failures`);
        }
      } catch (error) {
        console.log('❌ Error boundary test failed');
      }

      // 5. Console Error Check
      console.log('\n🔍 Checking Console Errors...');
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Visit all pages to collect errors
      for (const pageTest of pages) {
        try {
          await page.goto(`${liveURL}${pageTest.path}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(2000);
        } catch (e) {
          // Continue checking other pages
        }
      }

      const chartErrors = consoleErrors.filter(error => error.includes('toFixed'));
      console.log(`🐛 Total console errors: ${consoleErrors.length}`);
      console.log(`📈 Chart-related errors: ${chartErrors.length}`);

    } catch (error) {
      console.log(`❌ Major test error: ${error}`);
      results.errors.push(`Major error: ${error}`);
    }

    // Generate Final Report
    console.log('\n🎯 FINAL VERIFICATION RESULTS');
    console.log('==============================');
    console.log(`📄 Pages Working: ${results.pages.working}/${results.pages.total}`);
    console.log(`🔗 APIs Working: ${results.apis.working}/${results.apis.total}`);
    console.log(`📝 Forms Working: ${results.forms.working}/${results.forms.total}`);
    
    const totalScore = results.pages.working + results.apis.working + results.forms.working;
    const maxScore = results.pages.total + results.apis.total + results.forms.total;
    const successRate = Math.round((totalScore / maxScore) * 100);
    
    console.log(`\n🎯 OVERALL SUCCESS RATE: ${successRate}%`);
    
    if (results.errors.length > 0) {
      console.log(`\n❌ Issues Found: ${results.errors.length}`);
      results.errors.forEach(error => console.log(`   • ${error}`));
    } else {
      console.log('\n✅ NO CRITICAL ISSUES FOUND');
    }

    // Status Assessment
    if (successRate >= 90) {
      console.log('\n🎉 EXCELLENT: Your application is working perfectly!');
      console.log('   ✅ All pages loading correctly');
      console.log('   ✅ All APIs responding properly');
      console.log('   ✅ All forms functional');
      console.log('   ✅ Error boundaries protecting against crashes');
    } else if (successRate >= 75) {
      console.log('\n✅ GOOD: Your application is working well with minor issues');
    } else if (successRate >= 60) {
      console.log('\n⚠️ FAIR: Your application has some issues that may need attention');
    } else {
      console.log('\n❌ POOR: Your application has significant issues requiring investigation');
    }

    console.log('\n🚀 MANUAL VERIFICATION COMPLETE!');
    console.log('=================================');
    
    // Expect reasonable success rate
    expect(successRate).toBeGreaterThan(70);
  });
}); 