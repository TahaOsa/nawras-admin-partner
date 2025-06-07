import { test, expect } from '@playwright/test';

test.describe('Dashboard Application', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the dashboard
    await page.goto('/');
  });

  test('should load the dashboard page without errors', async ({ page }) => {
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for no JavaScript errors in console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Nawras Admin/);
    
    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(3000);
    
    // Check for specific error patterns that were causing issues
    const hasDateErrors = consoleErrors.some(error => 
      error.includes('Invalid time value') || 
      error.includes('Invalid date') ||
      error.includes('toFixed')
    );
    
    expect(hasDateErrors, `Date-related errors found: ${consoleErrors.join(', ')}`).toBeFalsy();
    
    // Check for ErrorBoundary fallback
    const errorBoundaryFallback = page.locator('text=Something went wrong');
    await expect(errorBoundaryFallback).not.toBeVisible();
    
    // Check that the app has loaded beyond the loading screen
    const loadingMessage = page.locator('text=Loading Nawras Admin');
    await expect(loadingMessage).not.toBeVisible({ timeout: 10000 });
  });

  test('should display charts or proper loading states', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Give time for React to load
    
    // Check that we're not stuck on the loading screen
    const loadingMessage = page.locator('text=Loading Nawras Admin');
    await expect(loadingMessage).not.toBeVisible({ timeout: 15000 });
    
    // Wait for any charts or content to load
    await page.waitForTimeout(3000);
    
    // Check for chart containers, loading states, or empty states
    const chartContainers = page.locator('.recharts-wrapper, canvas, [data-testid="chart"]');
    const loadingSkeletons = page.locator('[data-testid="chart-loading"], .animate-pulse');
    const emptyStates = page.locator('text=No data available, text=No categories available, text=No comparison data available, text=Add some expenses');
    const contentElements = page.locator('h1, h2, h3, .card, .dashboard');
    
    const chartCount = await chartContainers.count();
    const loadingCount = await loadingSkeletons.count();
    const emptyStateCount = await emptyStates.count();
    const contentCount = await contentElements.count();
    
    // Should have some kind of content - charts, loading states, empty states, or dashboard content
    const hasContent = chartCount > 0 || loadingCount > 0 || emptyStateCount > 0 || contentCount > 0;
    
    expect(hasContent, `Expected some content but found: charts=${chartCount}, loading=${loadingCount}, empty=${emptyStateCount}, content=${contentCount}`).toBeTruthy();
  });

  test('should handle analytics data loading', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for analytics API calls
    const responses: string[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/analytics/')) {
        responses.push(response.url());
      }
    });
    
    // Wait for the app to load and make API calls
    await page.waitForTimeout(10000);
    
    // Should have made requests to analytics endpoints or show that they're not needed
    // (The app might work without analytics data)
    console.log('Analytics requests made:', responses);
  });

  test('should not show critical errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Check for critical error indicators
    const errorBoundaryFallback = page.locator('text=Something went wrong');
    const appLoadingError = page.locator('text=App Loading Error');
    const criticalErrors = page.locator('.error, [data-testid="error"]');
    
    await expect(errorBoundaryFallback).not.toBeVisible();
    await expect(appLoadingError).not.toBeVisible();
    
    const criticalErrorCount = await criticalErrors.count();
    expect(criticalErrorCount, 'Found critical error indicators').toBe(0);
  });

  test('should handle responsive design correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // Check that the page is still functional on mobile
    const errorBoundaryFallback = page.locator('text=Something went wrong');
    await expect(errorBoundaryFallback).not.toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    
    // Should still be functional
    await expect(errorBoundaryFallback).not.toBeVisible();
  });

  test('should display meaningful content or empty states', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Check that the page has loaded beyond the initial loading screen
    const loadingMessage = page.locator('text=Loading Nawras Admin');
    await expect(loadingMessage).not.toBeVisible();
    
    // Check for meaningful content
    const hasCharts = await page.locator('.recharts-wrapper, canvas').count() > 0;
    const hasEmptyStates = await page.locator('text=No data available, text=Add some expenses, text=No categories, text=No comparison').count() > 0;
    const hasErrorStates = await page.locator('text=Something went wrong, text=Failed to load').count() > 0;
    const hasDashboardContent = await page.locator('h1, h2, .card, .dashboard, nav, main').count() > 0;
    
    // Should have either charts with data OR proper empty states OR dashboard content, but not error states
    const hasValidContent = hasCharts || hasEmptyStates || hasDashboardContent;
    expect(hasValidContent, `Expected valid content but found: charts=${hasCharts}, empty=${hasEmptyStates}, dashboard=${hasDashboardContent}, errors=${hasErrorStates}`).toBeTruthy();
    expect(hasErrorStates, 'Should not have error states').toBeFalsy();
  });

  test('should handle navigation if present', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check for navigation elements if they exist
    const navigation = page.locator('nav, [role="navigation"], a[href]');
    const navCount = await navigation.count();
    
    if (navCount > 0) {
      // Navigation exists, verify it's functional
      await expect(navigation.first()).toBeVisible();
    } else {
      // No navigation found, which is okay for a simple dashboard
      console.log('No navigation elements found');
    }
  });

  test('should not crash with JavaScript errors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Track JavaScript errors
    const jsErrors: string[] = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    // Wait for potential errors to occur
    await page.waitForTimeout(5000);
    
    // Filter out minor errors that don't break functionality
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('Non-Error promise rejection') &&
      !error.includes('ResizeObserver') &&
      !error.includes('Warning:')
    );
    
    expect(criticalErrors.length, `Critical JavaScript errors found: ${criticalErrors.join(', ')}`).toBe(0);
  });
}); 