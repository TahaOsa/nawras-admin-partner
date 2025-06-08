import { test, expect } from '@playwright/test';

test.describe('Settlement and Reports Integration', () => {
  const baseURL = 'http://localhost:8080';

  test('should test settlement form end-to-end', async ({ page }) => {
    // Go to settlement page
    await page.goto('/settlement');
    await page.waitForLoadState('networkidle');
    
    // Fill out the settlement form
    await page.fill('input[id="amount"]', '99');
    await page.selectOption('select[id="paidBy"]', 'taha');
    await page.selectOption('select[id="paidTo"]', 'burak');
    await page.fill('textarea[id="description"]', 'Integration test settlement');
    await page.fill('input[id="date"]', '2025-06-07');
    
    // Listen for API calls
    const createSettlementPromise = page.waitForResponse(
      response => response.url().includes('/api/settlements') && response.request().method() === 'POST'
    );
    
    // Submit the form
    await page.click('button:has-text("Record Settlement")');
    
    // Wait for the API call to complete
    const response = await createSettlementPromise;
    
    // Check if the API call was successful
    expect(response.status()).toBe(201);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('success', true);
    expect(responseData.data).toHaveProperty('amount', 99);
    expect(responseData.data).toHaveProperty('paidBy', 'taha');
    expect(responseData.data).toHaveProperty('paidTo', 'burak');
    
    // Should redirect to dashboard after successful submission
    await page.waitForURL('/');
    expect(page.url()).toMatch('/');
  });

  test('should verify analytics endpoints work', async ({ request }) => {
    // Test all analytics endpoints
    const endpoints = [
      '/api/analytics/monthly',
      '/api/analytics/categories', 
      '/api/analytics/users',
      '/api/analytics/balance-history',
      '/api/analytics/time-patterns'
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(`${baseURL}${endpoint}`);
      
      expect(response.ok(), `${endpoint} should be accessible`).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data), `${endpoint} should return an array`).toBeTruthy();
    }
  });

  test('should navigate between pages without errors', async ({ page }) => {
    // Start at dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // No error boundary should be visible
    let errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Navigate to settlement page
    await page.click('a[href="/settlement"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Navigate to reports page
    await page.click('a[href="/reports"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give more time for reports to load
    
    errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Navigate back to dashboard
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
  });

  test('should handle reports page with valid data', async ({ page }) => {
    // Go directly to reports page
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    
    // Wait for potential API calls to complete
    await page.waitForTimeout(8000);
    
    // Should not show error boundary
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Should show the reports header
    const header = page.locator('h1:has-text("Analytics Reports")');
    await expect(header).toBeVisible();
    
    // Should have some content (either data or loading states)
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(100); // Should have substantial content
  });

  test('should test settlement form validation', async ({ page }) => {
    await page.goto('/settlement');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button:has-text("Record Settlement")');
    
    // Should show validation errors
    const errorMessages = page.locator('.text-red-600');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // Fill some fields but not all
    await page.fill('input[id="amount"]', '50');
    await page.selectOption('select[id="paidBy"]', 'taha');
    // Leave paidTo empty
    
    await page.click('button:has-text("Record Settlement")');
    
    // Should still show validation errors
    const remainingErrors = await page.locator('.text-red-600').count();
    expect(remainingErrors).toBeGreaterThan(0);
    
    // Fill all required fields
    await page.selectOption('select[id="paidTo"]', 'burak');
    await page.fill('input[id="date"]', '2025-06-07');
    
    // Now form should be valid
    const submitButton = page.locator('button:has-text("Record Settlement")');
    expect(await submitButton.isEnabled()).toBeTruthy();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Test with a potentially failing settlement request
    await page.goto('/settlement');
    await page.waitForLoadState('networkidle');
    
    // Fill form with potentially problematic data
    await page.fill('input[id="amount"]', '999999'); // Very large amount
    await page.selectOption('select[id="paidBy"]', 'taha');
    await page.selectOption('select[id="paidTo"]', 'burak');
    await page.fill('input[id="date"]', '2025-06-07');
    
    // Try to submit
    await page.click('button:has-text("Record Settlement")');
    
    // Wait for potential response
    await page.waitForTimeout(5000);
    
    // Check if error is shown in UI (not crashed with error boundary)
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Should either succeed or show a proper error message
    const errorMessage = page.locator('.text-red-600');
    const isStillOnForm = page.url().includes('/settlement');
    
    // Either succeeded (redirected) or showing error (still on form)
    const hasValidState = !isStillOnForm || await errorMessage.count() > 0;
    expect(hasValidState).toBeTruthy();
  });

  test('should verify all analytics endpoints return valid data structure', async ({ request }) => {
    const testCases = [
      {
        endpoint: '/api/analytics/monthly',
        expectedFields: ['period', 'totalAmount']
      },
      {
        endpoint: '/api/analytics/categories', 
        expectedFields: ['category', 'totalAmount']
      },
      {
        endpoint: '/api/analytics/users',
        expectedFields: ['user', 'totalAmount']
      },
      {
        endpoint: '/api/analytics/balance-history',
        expectedFields: ['date', 'runningBalance']
      },
      {
        endpoint: '/api/analytics/time-patterns',
        expectedFields: ['dayOfWeek', 'totalAmount']
      }
    ];

    for (const testCase of testCases) {
      const response = await request.get(`${baseURL}${testCase.endpoint}`);
      
      expect(response.ok(), `${testCase.endpoint} should respond successfully`).toBeTruthy();
      
      const data = await response.json();
      expect(data.success, `${testCase.endpoint} should return success: true`).toBeTruthy();
      expect(Array.isArray(data.data), `${testCase.endpoint} should return array data`).toBeTruthy();
      
      // If there's data, check structure
      if (data.data.length > 0) {
        const firstItem = data.data[0];
        for (const field of testCase.expectedFields) {
          expect(firstItem).toHaveProperty(field);
        }
      }
    }
  });
}); 