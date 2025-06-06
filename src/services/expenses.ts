// Expense API service functions
import type {
  Expense,
  ExpenseFilters,
  CreateExpenseRequest,
  UpdateExpenseRequest
} from '../types';
import { config, logger } from '../lib/config';
import { logApiError } from '../lib/errorLogger';

// API base URL from configuration
const API_BASE_URL = config.apiBaseUrl;

// Type mapping from Supabase response to frontend types
interface SupabaseExpense {
  id: string;
  amount: string | number;
  category: string;
  description: string;
  paid_by_id: string;
  date: string;
  created_at: string;
  updated_at: string | null;
  paid_by: {
    user_id: string;
    name: string;
    email: string;
  };
}

// Convert Supabase expense to frontend Expense type
function mapSupabaseExpense(expense: SupabaseExpense): Expense {
  return {
    id: parseInt(expense.id.replace(/-/g, '').slice(0, 10), 16), // Convert UUID to number for compatibility
    amount: Number(expense.amount),
    category: expense.category,
    description: expense.description,
    paidById: expense.paid_by_id,
    paidBy: expense.paid_by.name,
    date: expense.date,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at || expense.created_at
  };
}

/**
 * Fetch all expenses with optional filters
 */
export async function fetchExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  logger.debug('Fetching expenses with filters:', filters);

  const url = `${API_BASE_URL}/api/expenses`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      logger.error('Failed to fetch expenses:', response.status, response.statusText);
      throw new Error(`Failed to fetch expenses: ${response.status} ${response.statusText}`);
    }

    const data: SupabaseExpense[] = await response.json();
    
    logger.debug('Successfully fetched expenses:', data.length, 'items');
    
    // Apply client-side filtering if needed
    let filteredData = data;

    if (filters?.category) {
      filteredData = filteredData.filter(expense => expense.category === filters.category);
    }

    if (filters?.paidBy) {
      filteredData = filteredData.filter(expense => expense.paid_by_id === filters.paidBy);
    }

    if (filters?.startDate) {
      filteredData = filteredData.filter(expense => expense.date >= filters.startDate!);
    }

    if (filters?.endDate) {
      filteredData = filteredData.filter(expense => expense.date <= filters.endDate!);
    }

    if (filters?.limit) {
      filteredData = filteredData.slice(0, filters.limit);
    }

    return filteredData.map(mapSupabaseExpense);
  } catch (error) {
    logger.error('Error fetching expenses:', error);
    throw error;
  }
}

/**
 * Fetch a single expense by ID
 */
export async function fetchExpenseById(id: number): Promise<Expense> {
  const response = await fetch(`${API_BASE_URL}/api/expenses`);

  if (!response.ok) {
    throw new Error(`Failed to fetch expenses: ${response.status} ${response.statusText}`);
  }

  const data: SupabaseExpense[] = await response.json();
  
  // Find the expense by ID (convert number ID back to find in array)
  const expense = data.find(e => parseInt(e.id.replace(/-/g, '').slice(0, 10), 16) === id);
  
  if (!expense) {
    throw new Error('Expense not found');
  }

  return mapSupabaseExpense(expense);
}

/**
 * Create a new expense
 */
export async function createExpense(expense: CreateExpenseRequest): Promise<Expense> {
  const url = `${API_BASE_URL}/api/expenses`;
  
  logger.debug('Creating expense:', {
    url,
    expense,
    apiBaseUrl: API_BASE_URL
  });

  const requestBody = {
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    paid_by_id: expense.paidById,
    date: expense.date
  };

  logger.debug('Request body:', requestBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    logger.debug('API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('API Error Response:', errorText);
      throw new Error(`Failed to create expense: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: SupabaseExpense = await response.json();
    logger.debug('API Success Response:', data);
    
    const mappedExpense = mapSupabaseExpense(data);
    logger.debug('Mapped expense:', mappedExpense);
    
    return mappedExpense;
  } catch (error) {
    logger.error('Create expense error:', error);
    throw error;
  }
}

/**
 * Update an existing expense
 */
export async function updateExpense(id: number, expense: UpdateExpenseRequest): Promise<Expense> {
  // First, get all expenses to find the actual UUID
  const allExpenses = await fetchExpenses();
  const existingExpense = allExpenses.find(e => e.id === id);
  
  if (!existingExpense) {
    throw new Error('Expense not found');
  }

  // Get the original data to find the UUID
  const expensesResponse = await fetch(`${API_BASE_URL}/api/expenses`);
  const expensesData: SupabaseExpense[] = await expensesResponse.json();
  const originalExpense = expensesData.find(e => parseInt(e.id.replace(/-/g, '').slice(0, 10), 16) === id);
  
  if (!originalExpense) {
    throw new Error('Expense not found in database');
  }

  const response = await fetch(`${API_BASE_URL}/api/expenses/${originalExpense.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      paid_by_id: expense.paidById,
      date: expense.date
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update expense: ${response.status} ${response.statusText}`);
  }

  const data: SupabaseExpense = await response.json();
  return mapSupabaseExpense(data);
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: number): Promise<void> {
  // First, get all expenses to find the actual UUID
  const allExpenses = await fetchExpenses();
  const existingExpense = allExpenses.find(e => e.id === id);
  
  if (!existingExpense) {
    throw new Error('Expense not found');
  }

  // Get the original data to find the UUID
  const expensesResponse = await fetch(`${API_BASE_URL}/api/expenses`);
  const expensesData: SupabaseExpense[] = await expensesResponse.json();
  const originalExpense = expensesData.find(e => parseInt(e.id.replace(/-/g, '').slice(0, 10), 16) === id);
  
  if (!originalExpense) {
    throw new Error('Expense not found in database');
  }

  const response = await fetch(`${API_BASE_URL}/api/expenses/${originalExpense.id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete expense: ${response.status} ${response.statusText}`);
  }
}
