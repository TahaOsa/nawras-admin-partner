import { test, expect } from '@playwright/test';

test.describe('Debug Reports Page', () => {
  test('should debug reports page loading', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];
    
    // Capture console messages and errors
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      errors.push(error.toString());
    });
    
    // Navigate to reports page
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
    console.log('Contains "error":', content.includes('error'));
    console.log('Page title:', await page.title());
    
    // Check what's actually visible
    const visibleText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('=== VISIBLE TEXT ===');
    console.log(visibleText.substring(0, 500) + '...');
    
    // Just pass the test - we're debugging
    expect(true).toBe(true);
  });
}); 