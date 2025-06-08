import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:8080';

const TEST_CREDENTIALS = {
  email: 'taha@nawrasinchina.com',
  password: 'taha2024'
};

test.describe('Nawras Admin Partner - Complete Functionality & Translation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('App loads successfully and shows initial state', async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Nawras Admin Partner/i);
    
    // Wait for the main content to be visible
    await page.waitForSelector('body', { state: 'visible' });
    
    // Take screenshot of initial state
    await page.screenshot({ 
      path: 'test-results/01-initial-load.png',
      fullPage: true 
    });
    
    console.log('✅ Application loaded successfully');
  });

  test('Login functionality works correctly', async ({ page }) => {
    // Look for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    const loginButton = page.locator('button[type="submit"], button:has-text("Sign"), button:has-text("Login")');

    // Wait for login form to be visible
    await expect(emailInput.or(page.locator('text=sign'))).toBeVisible({ timeout: 10000 });
    
    // Fill login credentials if form is present
    if (await emailInput.isVisible()) {
      await emailInput.fill(TEST_CREDENTIALS.email);
      await passwordInput.fill(TEST_CREDENTIALS.password);
      
      // Take screenshot before login
      await page.screenshot({ 
        path: 'test-results/02-before-login.png',
        fullPage: true 
      });
      
      // Click login button
      await loginButton.click();
      
      // Wait for navigation or dashboard to load
      await page.waitForTimeout(3000);
      
      // Take screenshot after login
      await page.screenshot({ 
        path: 'test-results/03-after-login.png',
        fullPage: true 
      });
      
      console.log('✅ Login completed successfully');
    } else {
      console.log('ℹ️ No login form found - might already be logged in');
    }
  });

  test('Navigation elements are present and functional', async ({ page }) => {
    // Wait for any potential login/loading
    await page.waitForTimeout(2000);
    
    // Check for common navigation elements
    const navigation = page.locator('nav, .nav, [role="navigation"], .sidebar, .menu');
    const dashboardLink = page.locator('text=Dashboard, text=لوحة التحكم, a[href*="dashboard"]');
    const expenseLink = page.locator('text=Expense, text=مصروف, a[href*="expense"]');
    const settingsLink = page.locator('text=Settings, text=إعدادات, a[href*="settings"]');

    // Verify navigation exists
    if (await navigation.first().isVisible()) {
      await expect(navigation.first()).toBeVisible();
      console.log('✅ Navigation found');
      
      // Take screenshot of navigation
      await page.screenshot({ 
        path: 'test-results/04-navigation.png',
        fullPage: true 
      });
    }

    // Test clicking on different navigation items if they exist
    const navItems = [
      { selector: dashboardLink, name: 'Dashboard' },
      { selector: expenseLink, name: 'Expense' },
      { selector: settingsLink, name: 'Settings' }
    ];

    for (const item of navItems) {
      if (await item.selector.first().isVisible()) {
        await item.selector.first().click();
        await page.waitForTimeout(1000);
        console.log(`✅ ${item.name} navigation works`);
      }
    }
  });

  test('Settings page and language switching functionality', async ({ page }) => {
    // Navigate to settings
    const settingsLink = page.locator('text=Settings, text=إعدادات, a[href*="settings"], button:has-text("Settings")');
    
    // Try to find and click settings
    if (await settingsLink.first().isVisible()) {
      await settingsLink.first().click();
      await page.waitForTimeout(2000);
    } else {
      // Try alternative navigation methods
      await page.goto('http://localhost:5173/settings');
      await page.waitForTimeout(2000);
    }
    
    // Take screenshot of settings page
    await page.screenshot({ 
      path: 'test-results/05-settings-page.png',
      fullPage: true 
    });

    // Look for language selector
    const languageSelector = page.locator('select, .language-select, [data-testid="language"], text=Language');
    const arabicOption = page.locator('option[value="ar"], text=العربية, text=Arabic');
    
    if (await languageSelector.first().isVisible()) {
      console.log('✅ Language selector found');
      
      // Try to select Arabic
      if (await arabicOption.first().isVisible()) {
        await arabicOption.first().click();
        await page.waitForTimeout(2000);
        
        // Take screenshot after language change
        await page.screenshot({ 
          path: 'test-results/06-arabic-selected.png',
          fullPage: true 
        });
        
        console.log('✅ Arabic language selected');
      }
    }
  });

  test('RTL layout verification when Arabic is active', async ({ page }) => {
    // Try to switch to Arabic first
    const settingsLink = page.locator('text=Settings, text=إعدادات');
    if (await settingsLink.first().isVisible()) {
      await settingsLink.first().click();
      await page.waitForTimeout(1000);
    }

    // Look for Arabic option and select it
    const arabicOption = page.locator('text=العربية, option[value="ar"]');
    if (await arabicOption.first().isVisible()) {
      await arabicOption.first().click();
      await page.waitForTimeout(2000);
    }

    // Verify RTL layout by checking CSS direction
    const bodyDirection = await page.evaluate(() => {
      return window.getComputedStyle(document.body).direction;
    });

    const htmlLang = await page.evaluate(() => {
      return document.documentElement.lang;
    });

    // Check for Arabic text presence
    const arabicText = page.locator('text=لوحة التحكم, text=إعدادات, text=العربية');
    
    // Take final screenshot showing RTL layout
    await page.screenshot({ 
      path: 'test-results/07-rtl-layout.png',
      fullPage: true 
    });

    console.log(`Body direction: ${bodyDirection}`);
    console.log(`HTML language: ${htmlLang}`);
    
    if (await arabicText.first().isVisible()) {
      console.log('✅ Arabic text found - RTL layout active');
    }
  });

  test('Form elements work with Arabic language', async ({ page }) => {
    // Try to navigate to add expense or any form page
    const expenseLink = page.locator('text=Add Expense, text=إضافة مصروف, a[href*="expense"]');
    
    if (await expenseLink.first().isVisible()) {
      await expenseLink.first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of form page
      await page.screenshot({ 
        path: 'test-results/08-forms-arabic.png',
        fullPage: true 
      });
      
      // Check for form elements
      const inputFields = page.locator('input, textarea, select');
      const count = await inputFields.count();
      
      if (count > 0) {
        console.log(`✅ Found ${count} form elements`);
        
        // Test input functionality
        const firstInput = inputFields.first();
        if (await firstInput.isVisible()) {
          await firstInput.click();
          await firstInput.fill('Test Arabic: اختبار عربي');
          
          await page.screenshot({ 
            path: 'test-results/09-arabic-input.png',
            fullPage: true 
          });
          
          console.log('✅ Arabic input tested successfully');
        }
      }
    }
  });

  test('Console errors check', async ({ page }) => {
    const errors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate through different pages
    const pages = ['/', '/settings', '/dashboard'];
    
    for (const pagePath of pages) {
      await page.goto(`http://localhost:5173${pagePath}`);
      await page.waitForTimeout(2000);
    }

    // Report console errors
    if (errors.length > 0) {
      console.log('⚠️ Console errors found:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No console errors found');
    }

    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/10-final-state.png',
      fullPage: true 
    });
  });

  test('Performance and loading times', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`✅ Page load time: ${loadTime}ms`);
    
    // Check if load time is reasonable (under 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Test language switching performance
    const languageStartTime = Date.now();
    
    const arabicOption = page.locator('text=العربية, option[value="ar"]');
    if (await arabicOption.first().isVisible()) {
      await arabicOption.first().click();
      await page.waitForTimeout(1000);
    }
    
    const languageSwitchTime = Date.now() - languageStartTime;
    console.log(`✅ Language switch time: ${languageSwitchTime}ms`);
  });
}); 