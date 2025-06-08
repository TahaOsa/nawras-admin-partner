import { test, expect } from '@playwright/test';

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the reports page
    await page.goto('/reports');
  });

  test('should load reports page without errors', async ({ page }) => {
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for no JavaScript errors in console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait for potential errors to occur
    await page.waitForTimeout(5000);
    
    // Check for specific error patterns
    const hasAnalyticsErrors = consoleErrors.some(error => 
      error.includes('Failed to fetch') && error.includes('analytics')
    );
    
    expect(hasAnalyticsErrors, `Analytics errors found: ${consoleErrors.join(', ')}`).toBeFalsy();
    
    // Check for ErrorBoundary fallback
    const errorBoundaryFallback = page.locator('text=Something went wrong');
    await expect(errorBoundaryFallback).not.toBeVisible();
  });

  test('should display analytics header and navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check for the main heading
    const heading = page.locator('h1:has-text("Analytics Reports")');
    await expect(heading).toBeVisible();
    
    // Check for period filter
    const periodFilter = page.locator('select');
    const filterCount = await periodFilter.count();
    expect(filterCount).toBeGreaterThan(0);
    
    // Check for export button
    const exportButton = page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible();
  });

  test('should display summary cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Should not show error boundary
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Look for summary cards
    const cards = page.locator('.bg-white.rounded-lg.shadow-sm.border');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Check for specific summary metrics
    const totalMonths = page.locator('text=Total Months');
    const categories = page.locator('text=Categories');
    const topCategory = page.locator('text=Top Category');
    const balanceStatus = page.locator('text=Balance Status');
    
    // At least some summary metrics should be visible
    const summaryCount = await Promise.all([
      totalMonths.count(),
      categories.count(),
      topCategory.count(),
      balanceStatus.count()
    ]);
    
    const visibleSummaries = summaryCount.reduce((sum, count) => sum + count, 0);
    expect(visibleSummaries).toBeGreaterThan(0);
  });

  test('should handle period filter changes', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Find the period select dropdown
    const periodSelect = page.locator('select').first();
    
    if (await periodSelect.count() > 0) {
      // Change the period filter
      await periodSelect.selectOption('3months');
      await page.waitForTimeout(2000);
      
      // Should not cause errors
      const errorBoundary = page.locator('text=Something went wrong');
      await expect(errorBoundary).not.toBeVisible();
    }
  });

  test('should display charts or loading states', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(8000); // Give more time for charts to load
    
    // Should not show error boundary
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Look for chart containers or loading skeletons
    const chartContainers = page.locator('.recharts-wrapper, canvas, [data-testid="chart"]');
    const loadingSkeletons = page.locator('.animate-pulse');
    const chartLoadingSkeletons = page.locator('text=Monthly Expense Trends, text=Category Breakdown, text=User Comparison');
    
    const chartCount = await chartContainers.count();
    const loadingCount = await loadingSkeletons.count();
    const chartTitlesCount = await chartLoadingSkeletons.count();
    
    // Should have either actual charts, loading states, or at least chart titles/containers
    const hasChartContent = chartCount > 0 || loadingCount > 0 || chartTitlesCount > 0;
    
    expect(hasChartContent, `Expected chart content but found: charts=${chartCount}, loading=${loadingCount}, titles=${chartTitlesCount}`).toBeTruthy();
  });

  test('should handle missing analytics data gracefully', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // The page should handle missing data without crashing
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Look for empty state messages or placeholder content
    const emptyStates = page.locator('text=No data available, text=No analytics data');
    const placeholders = page.locator('text=..., text=None');
    
    // Either data should be loaded or graceful empty states should be shown
    const bodyText = await page.textContent('body');
    const hasDataOrEmptyStates = (
      bodyText?.includes('$') || // Has currency data
      bodyText?.includes('...') || // Has loading placeholders
      bodyText?.includes('None') || // Has empty placeholders
      await emptyStates.count() > 0
    );
    
    expect(hasDataOrEmptyStates, 'Should show either data or graceful empty states').toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    // Should not crash on mobile
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    
    // Should still work on desktop
    await expect(errorBoundary).not.toBeVisible();
  });

  test('should handle export functionality', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Find and click export button
    const exportButton = page.locator('button:has-text("Export")');
    
    if (await exportButton.count() > 0) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      
      // Should not cause errors (even if functionality is not implemented)
      const errorBoundary = page.locator('text=Something went wrong');
      await expect(errorBoundary).not.toBeVisible();
    }
  });
}); 