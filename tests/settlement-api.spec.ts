import { test, expect } from '@playwright/test';

test.describe('Settlement API', () => {
  const baseURL = 'http://localhost:8080';

  test('should create settlement successfully', async ({ request }) => {
    const settlementData = {
      amount: 99,
      paidBy: 'taha',
      paidTo: 'burak',
      description: 'Test settlement',
      date: '2025-06-07'
    };

    const response = await request.post(`${baseURL}/api/settlements`, {
      data: settlementData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(data.data).toHaveProperty('id');
    expect(data.data).toHaveProperty('amount', 99);
    expect(data.data).toHaveProperty('paidBy', 'taha');
    expect(data.data).toHaveProperty('paidTo', 'burak');
    expect(data.data).toHaveProperty('description', 'Test settlement');
    expect(data.data).toHaveProperty('date', '2025-06-07');
  });

  test('should handle missing required fields', async ({ request }) => {
    const incompleteData = {
      amount: 50
      // Missing paidBy, paidTo, date
    };

    const response = await request.post(`${baseURL}/api/settlements`, {
      data: incompleteData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Missing required fields');
  });

  test('should handle both camelCase and snake_case formats', async ({ request }) => {
    // Test with snake_case format
    const snakeCaseData = {
      amount: 75,
      paid_by: 'burak',
      paid_to: 'taha',
      description: 'Snake case test',
      date: '2025-06-07'
    };

    const response1 = await request.post(`${baseURL}/api/settlements`, {
      data: snakeCaseData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response1.ok()).toBeTruthy();
    
    const data1 = await response1.json();
    expect(data1.success).toBeTruthy();
    expect(data1.data.paidBy).toBe('burak');
    expect(data1.data.paidTo).toBe('taha');

    // Test with camelCase format
    const camelCaseData = {
      amount: 85,
      paidBy: 'taha',
      paidTo: 'burak',
      description: 'Camel case test',
      date: '2025-06-07'
    };

    const response2 = await request.post(`${baseURL}/api/settlements`, {
      data: camelCaseData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response2.ok()).toBeTruthy();
    
    const data2 = await response2.json();
    expect(data2.success).toBeTruthy();
    expect(data2.data.paidBy).toBe('taha');
    expect(data2.data.paidTo).toBe('burak');
  });

  test('should return valid settlement list', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/settlements`);
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
  });
}); 