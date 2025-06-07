import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  const baseURL = 'http://localhost:8080';

  test('should return healthy status from health endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('database');
  });

  test('should return valid monthly analytics data', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/analytics/monthly`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    
    // If data exists, validate structure
    if (data.data.length > 0) {
      const firstItem = data.data[0];
      expect(firstItem).toHaveProperty('period');
      expect(firstItem).toHaveProperty('totalAmount');
      expect(firstItem).toHaveProperty('expenseCount');
      expect(typeof firstItem.totalAmount).toBe('number');
      expect(typeof firstItem.expenseCount).toBe('number');
    }
  });

  test('should return valid categories analytics data', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/analytics/categories`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    
    // If data exists, validate structure
    if (data.data.length > 0) {
      const firstItem = data.data[0];
      expect(firstItem).toHaveProperty('category');
      expect(firstItem).toHaveProperty('totalAmount');
      expect(firstItem).toHaveProperty('expenseCount');
      expect(typeof firstItem.category).toBe('string');
      expect(typeof firstItem.totalAmount).toBe('number');
      expect(typeof firstItem.expenseCount).toBe('number');
    }
  });

  test('should return valid users analytics data', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/analytics/users`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    
    // If data exists, validate structure
    if (data.data.length > 0) {
      const firstItem = data.data[0];
      expect(firstItem).toHaveProperty('user');
      expect(firstItem).toHaveProperty('totalAmount');
      expect(firstItem).toHaveProperty('expenseCount');
      expect(firstItem).toHaveProperty('avgExpense');
      expect(typeof firstItem.user).toBe('string');
      expect(typeof firstItem.totalAmount).toBe('number');
      expect(typeof firstItem.expenseCount).toBe('number');
      expect(typeof firstItem.avgExpense).toBe('number');
    }
  });

  test('should handle date filters in monthly analytics', async ({ request }) => {
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    
    const response = await request.get(`${baseURL}/api/analytics/monthly?startDate=${startDate}&endDate=${endDate}`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('should handle period filters in categories analytics', async ({ request }) => {
    const periods = ['1month', '3months', '6months', '1year', 'all'];
    
    for (const period of periods) {
      const response = await request.get(`${baseURL}/api/analytics/categories?period=${period}`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBeTruthy();
    }
  });

  test('should handle granularity parameter in users analytics', async ({ request }) => {
    const granularities = ['month', 'quarter', 'year'];
    
    for (const granularity of granularities) {
      const response = await request.get(`${baseURL}/api/analytics/users?granularity=${granularity}`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBeTruthy();
    }
  });

  test('should return HTML for non-API routes (SPA behavior)', async ({ request }) => {
    const response = await request.get(`${baseURL}/nonexistent`);
    expect(response.ok()).toBeTruthy();
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');
    
    const html = await response.text();
    expect(html).toContain('Nawras Admin');
  });

  test('should handle invalid parameters gracefully', async ({ request }) => {
    // Test with invalid date format
    const response1 = await request.get(`${baseURL}/api/analytics/monthly?startDate=invalid-date`);
    // Should either return valid data or proper error, but not crash
    expect(response1.status()).toBeLessThan(500);
    
    // Test with invalid period
    const response2 = await request.get(`${baseURL}/api/analytics/categories?period=invalid-period`);
    expect(response2.status()).toBeLessThan(500);
    
    // Test with invalid granularity
    const response3 = await request.get(`${baseURL}/api/analytics/users?granularity=invalid-granularity`);
    expect(response3.status()).toBeLessThan(500);
  });

  test('should return consistent response format across all analytics endpoints', async ({ request }) => {
    const endpoints = [
      '/api/analytics/monthly',
      '/api/analytics/categories', 
      '/api/analytics/users'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(`${baseURL}${endpoint}`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
      expect(Array.isArray(data.data)).toBeTruthy();
      
      // If success is false, should have error message
      if (!data.success) {
        expect(data).toHaveProperty('error');
        expect(typeof data.error).toBe('string');
      }
    }
  });

  test('should handle concurrent requests without errors', async ({ request }) => {
    // Make multiple concurrent requests to test stability
    const requests = Array(10).fill(null).map(() => 
      request.get(`${baseURL}/api/analytics/monthly`)
    );
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });
    
    // All responses should have consistent format
    const data = await Promise.all(responses.map(r => r.json()));
    data.forEach(d => {
      expect(d).toHaveProperty('success', true);
      expect(d).toHaveProperty('data');
      expect(Array.isArray(d.data)).toBeTruthy();
    });
  });

  test('should have proper CORS headers', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    
    // Check for CORS headers
    const headers = response.headers();
    expect(headers).toHaveProperty('access-control-allow-origin');
    expect(headers['access-control-allow-origin']).toBe('*');
  });

  test('should handle database connection gracefully', async ({ request }) => {
    // This test verifies the database connection is working
    const response = await request.get(`${baseURL}/api/analytics/monthly`);
    
    // Should return successful response since we have data
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('should return valid data types in analytics responses', async ({ request }) => {
    // Test monthly analytics data types
    const monthlyResponse = await request.get(`${baseURL}/api/analytics/monthly`);
    const monthlyData = await monthlyResponse.json();
    
    if (monthlyData.data.length > 0) {
      const item = monthlyData.data[0];
      expect(typeof item.totalAmount).toBe('number');
      expect(typeof item.expenseCount).toBe('number');
      expect(item.totalAmount).toBeGreaterThanOrEqual(0);
      expect(item.expenseCount).toBeGreaterThanOrEqual(0);
    }
    
    // Test categories analytics data types
    const categoriesResponse = await request.get(`${baseURL}/api/analytics/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.data.length > 0) {
      const item = categoriesData.data[0];
      expect(typeof item.category).toBe('string');
      expect(typeof item.totalAmount).toBe('number');
      expect(typeof item.expenseCount).toBe('number');
      expect(item.totalAmount).toBeGreaterThanOrEqual(0);
      expect(item.expenseCount).toBeGreaterThanOrEqual(0);
    }
  });
}); 