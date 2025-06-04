// Expense API service functions
import type {
  Expense,
  ExpenseListResponse,
  ExpenseResponse,
  ExpenseFilters,
  CreateExpenseRequest,
  UpdateExpenseRequest
} from '../types';
import { config, logger } from '../lib/config';

// API base URL from configuration
const API_BASE_URL = config.apiBaseUrl;

/**
 * Fetch all expenses with optional filters
 */
export async function fetchExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  logger.debug('Fetching expenses with filters:', filters);

  const params = new URLSearchParams();

  if (filters?.category) {
    params.append('category', filters.category);
  }

  if (filters?.paidBy) {
    params.append('paidBy', filters.paidBy);
  }

  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }

  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }

  const url = `${API_BASE_URL}/expenses${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      logger.error('Failed to fetch expenses:', response.status, response.statusText);
      throw new Error(`Failed to fetch expenses: ${response.status} ${response.statusText}`);
    }

    const data: ExpenseListResponse = await response.json();

    if (!data.success) {
      logger.error('API returned error:', data.error);
      throw new Error(data.error || 'Failed to fetch expenses');
    }

    logger.debug('Successfully fetched expenses:', data.data.length, 'items');
    return data.data;
  } catch (error) {
    logger.error('Error fetching expenses:', error);
    throw error;
  }
}

/**
 * Fetch a single expense by ID
 */
export async function fetchExpenseById(id: number): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch expense: ${response.status} ${response.statusText}`);
  }

  const data: ExpenseResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch expense');
  }

  return data.data;
}

/**
 * Create a new expense
 */
export async function createExpense(expense: CreateExpenseRequest): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error(`Failed to create expense: ${response.status} ${response.statusText}`);
  }

  const data: ExpenseResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to create expense');
  }

  return data.data;
}

/**
 * Update an existing expense
 */
export async function updateExpense(id: number, expense: UpdateExpenseRequest): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error(`Failed to update expense: ${response.status} ${response.statusText}`);
  }

  const data: ExpenseResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to update expense');
  }

  return data.data;
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete expense: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to delete expense');
  }
}
