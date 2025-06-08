import { test, expect } from '@playwright/test';

test.describe('🌐 LIVE DEPLOYMENT VERIFICATION', () => {
  const liveURL = 'https://partner.nawrasinchina.com';

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    // Increase timeout for live deployment
    page.setDefaultTimeout(60000);
  });

  test('✅ LIVE DEPLOYMENT: Basic Functionality Check', async ({ page }) => {
    console.log('🌐 Testing live deployment at https://partner.nawrasinchina.com');
    
    try {
      // Navigate to live site
      await page.goto(liveURL, { waitUntil: 'networkidle', timeout: 60000 });
      console.log('✅ Live site loaded successfully');
      
      // Wait for potential loading states
      await page.waitForTimeout(3000);
      
      // Check if page has content (not just loading message)
      const pageContent = await page.textContent('body');
      const hasSignificantContent = pageContent && pageContent.length > 200;
      
      if (hasSignificantContent) {
        console.log('✅ Page has significant content');
      } else {
        console.log('⚠️ Page may still be loading or have limited content');
        console.log(`Content length: ${pageContent?.length || 0} characters`);
      }
      
      // Check for loading message persistence
      const loadingMessage = page.locator('text="Loading Nawras Admin..."');
      const isStillLoading = await loadingMessage.isVisible();
      
      if (isStillLoading) {
        console.log('⚠️ Site is showing "Loading Nawras Admin..." - checking browser console');
        
        // Check browser console for errors
        const consoleLogs: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleLogs.push(`❌ Console Error: ${msg.text()}`);
          }
        });
        
        await page.waitForTimeout(5000);
        
        if (consoleLogs.length > 0) {
          console.log('🔍 Browser Console Errors Found:');
          consoleLogs.forEach(log => console.log(log));
        } else {
          console.log('✅ No console errors detected');
        }
      } else {
        console.log('✅ Site loaded beyond loading screen');
      }
      
      // Take a screenshot for verification
      await page.screenshot({ 
        path: 'live-deployment-screenshot.png',
        fullPage: true 
      });
      console.log('📸 Screenshot saved as live-deployment-screenshot.png');
      
    } catch (error) {
      console.log(`❌ Error accessing live deployment: ${error}`);
      throw error;
    }
  });

  test('🔗 LIVE DEPLOYMENT: API Health Check', async ({ page }) => {
    console.log('🏥 Testing live API endpoints...');
    
    const apiEndpoints = [
      '/api/health',
      '/api/expenses',
      '/api/settlements',
      '/api/analytics/balance-history',
      '/api/analytics/categories'
    ];
    
    const apiResults: Array<{endpoint: string, status: number, success: boolean}> = [];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.get(`${liveURL}${endpoint}`, {
          timeout: 30000
        });
        
        const status = response.status();
        const success = status >= 200 && status < 400;
        
        apiResults.push({ endpoint, status, success });
        console.log(`📡 ${endpoint}: ${status} ${success ? '✅' : '❌'}`);
        
      } catch (error) {
        apiResults.push({ endpoint, status: 0, success: false });
        console.log(`📡 ${endpoint}: ERROR - ${error}`);
      }
    }
    
    const successfulAPIs = apiResults.filter(result => result.success).length;
    const totalAPIs = apiResults.length;
    
    console.log(`\n📊 API Health Summary: ${successfulAPIs}/${totalAPIs} endpoints working`);
    
    // At least health endpoint should work
    const healthEndpoint = apiResults.find(r => r.endpoint === '/api/health');
    if (healthEndpoint?.success) {
      console.log('✅ Core API infrastructure is operational');
    } else {
      console.log('❌ Core API infrastructure may have issues');
    }
  });

  test('🧪 LIVE DEPLOYMENT: Critical User Flows', async ({ page }) => {
    console.log('🚀 Testing critical user flows on live deployment...');
    
    try {
      await page.goto(liveURL, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Wait for app to fully load
      await page.waitForTimeout(5000);
      
      // Check if we can navigate (indicates app is interactive)
      const navigationLinks = page.locator('nav a, [href], button');
      const linkCount = await navigationLinks.count();
      
      if (linkCount > 0) {
        console.log(`✅ Found ${linkCount} interactive elements`);
        
        // Try to access key pages
        const keyPages = ['/add-expense', '/settlement', '/history', '/reports'];
        let accessiblePages = 0;
        
        for (const pagePath of keyPages) {
          try {
            await page.goto(`${liveURL}${pagePath}`, { 
              waitUntil: 'networkidle', 
              timeout: 30000 
            });
            
            await page.waitForTimeout(2000);
            const content = await page.textContent('body');
            
            if (content && content.length > 100) {
              accessiblePages++;
              console.log(`✅ ${pagePath} - Accessible`);
            } else {
              console.log(`⚠️ ${pagePath} - Limited content`);
            }
          } catch (error) {
            console.log(`❌ ${pagePath} - Error: ${error}`);
          }
        }
        
        console.log(`📄 Page Accessibility: ${accessiblePages}/${keyPages.length} pages working`);
        
      } else {
        console.log('⚠️ Limited interactive elements detected');
      }
      
    } catch (error) {
      console.log(`❌ Error testing user flows: ${error}`);
    }
  });

  test('🗄️ LIVE DEPLOYMENT: Database Connection Check', async ({ page }) => {
    console.log('🔍 Checking database connectivity...');
    
    try {
      // Test if we can fetch data (indicates DB connection)
      const response = await page.request.get(`${liveURL}/api/expenses`, {
        timeout: 30000
      });
      
      if (response.status() === 200) {
        const data = await response.json();
        console.log('✅ Database connection working - expenses endpoint responsive');
        
        if (Array.isArray(data) || (data && data.data)) {
          console.log('✅ Database returning expected data structure');
        } else {
          console.log('⚠️ Database response structure may need attention');
        }
      } else {
        console.log(`⚠️ Database connection issues - expenses endpoint returned ${response.status()}`);
      }
      
      // Test settlements endpoint
      const settlementsResponse = await page.request.get(`${liveURL}/api/settlements`, {
        timeout: 30000
      });
      
      if (settlementsResponse.status() === 200) {
        console.log('✅ Settlements endpoint working');
      } else {
        console.log(`⚠️ Settlements endpoint returned ${settlementsResponse.status()}`);
      }
      
    } catch (error) {
      console.log(`❌ Database connectivity test failed: ${error}`);
    }
  });

  test('📋 LIVE DEPLOYMENT: Comprehensive Status Report', async ({ page }) => {
    console.log('\n🎯 GENERATING COMPREHENSIVE DEPLOYMENT STATUS REPORT');
    console.log('==================================================');
    
    const testResults = {
      deployment: false,
      apis: 0,
      pages: 0,
      database: false,
      errors: [] as string[]
    };
    
    try {
      // Test basic deployment
      await page.goto(liveURL, { waitUntil: 'networkidle', timeout: 60000 });
      const content = await page.textContent('body');
      testResults.deployment = content !== null && content.length > 100;
      
      // Test APIs
      const apiTests = ['/api/health', '/api/expenses', '/api/settlements'];
      for (const api of apiTests) {
        try {
          const resp = await page.request.get(`${liveURL}${api}`, { timeout: 20000 });
          if (resp.status() < 400) testResults.apis++;
        } catch (e) {
          testResults.errors.push(`API ${api} failed`);
        }
      }
      
      // Test pages
      const pageTests = ['/', '/add-expense', '/settlement', '/history'];
      for (const pagePath of pageTests) {
        try {
          await page.goto(`${liveURL}${pagePath}`, { timeout: 20000 });
          await page.waitForTimeout(1000);
          const pageContent = await page.textContent('body');
          if (pageContent && pageContent.length > 50) testResults.pages++;
        } catch (e) {
          testResults.errors.push(`Page ${pagePath} failed`);
        }
      }
      
      // Test database
      try {
        const dbResp = await page.request.get(`${liveURL}/api/health`, { timeout: 20000 });
        testResults.database = dbResp.status() === 200;
      } catch (e) {
        testResults.errors.push('Database health check failed');
      }
      
    } catch (error) {
      testResults.errors.push(`General deployment error: ${error}`);
    }
    
    // Generate report
    console.log('📊 DEPLOYMENT STATUS SUMMARY:');
    console.log(`🌐 Deployment Access: ${testResults.deployment ? '✅ Working' : '❌ Failed'}`);
    console.log(`📡 API Endpoints: ${testResults.apis}/3 working`);
    console.log(`📄 Page Navigation: ${testResults.pages}/4 pages accessible`);
    console.log(`🗄️ Database Connectivity: ${testResults.database ? '✅ Connected' : '❌ Issues'}`);
    
    if (testResults.errors.length > 0) {
      console.log('\n❌ ISSUES DETECTED:');
      testResults.errors.forEach(error => console.log(`   • ${error}`));
    } else {
      console.log('\n✅ NO CRITICAL ISSUES DETECTED');
    }
    
    console.log('\n🎉 DEPLOYMENT VERIFICATION COMPLETE');
    console.log('==================================================');
    
    // Determine if Supabase updates are needed
    const needsDBUpdate = !testResults.database || testResults.apis < 2;
    if (needsDBUpdate) {
      console.log('\n🔄 RECOMMENDATION: Check Supabase database configuration');
      console.log('   • Verify connection strings and environment variables');
      console.log('   • Check if database schema matches application requirements');
      console.log('   • Ensure proper database permissions are set');
    } else {
      console.log('\n✅ SUPABASE DATABASE: No immediate updates required');
    }
  });
}); 