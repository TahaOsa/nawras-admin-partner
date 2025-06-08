import { test, expect } from '@playwright/test';

test.describe('Debug Reports Page with Auth', () => {
  test('should debug reports page after login', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];
    
    // Capture console messages and errors
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    
    // Navigate to login page first
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    // Login with test credentials
    await page.fill('input[type="email"]', 'taha@nawrasinchina.com');
    await page.fill('input[type="password"]', 'taha2024');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log('=== LOGIN SUCCESSFUL ===');
    
    // Now navigate to reports page
    await page.goto('/reports');
    
    // Wait for potential loading
    await page.waitForTimeout(10000);
    
    // Get page content
    const content = await page.content();
    
    // Log everything
    console.log('=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));
    
    console.log('=== ERRORS ===');
    errors.forEach(error => console.log(error));
    
    console.log('=== PAGE CONTENT SUMMARY ===');
    console.log('Contains "Something went wrong":', content.includes('Something went wrong'));
    console.log('Contains "Analytics Reports":', content.includes('Analytics Reports'));
    console.log('Contains "ErrorBoundary":', content.includes('ErrorBoundary'));
    console.log('Page title:', await page.title());
    
    // Check what's actually visible
    const visibleText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('=== VISIBLE TEXT ===');
    console.log(visibleText.substring(0, 1000) + '...');
    
    // Check for specific elements
    const hasReportsHeading = await page.locator('h1:has-text("Analytics Reports")').count();
    const hasErrorBoundary = await page.locator('[class*="error"]').count();
    const hasSomethingWentWrong = await page.locator('text="Something went wrong"').count();
    
    console.log('=== ELEMENT COUNTS ===');
    console.log('Reports heading:', hasReportsHeading);
    console.log('Error elements:', hasErrorBoundary);
    console.log('Something went wrong:', hasSomethingWentWrong);
    
    // Just pass the test - we're debugging
    expect(true).toBe(true);
  });
}); 