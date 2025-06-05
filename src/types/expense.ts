// Expense-related TypeScript type definitions

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  paidById: string;
  paidBy?: string; // Optional user name for display purposes
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO datetime string
  updatedAt?: string; // Optional updated timestamp
}

// For creating new expenses (without id and createdAt)
export interface CreateExpenseRequest {
  amount: number;
  description: string;
  category: string;
  paidById: string;
  date: string;
}

// For updating existing expenses
export interface UpdateExpenseRequest {
  amount?: number;
  description?: string;
  category?: string;
  paidById?: string;
  date?: string;
}

// API response wrapper for expenses
export interface ExpenseResponse {
  success: boolean;
  data: Expense;
  error?: string;
  timestamp?: string;
}

// API response wrapper for expense lists
export interface ExpenseListResponse {
  success: boolean;
  data: Expense[];
  total: number;
  totalUnfiltered?: number;
  filters?: ExpenseFilters;
  error?: string;
  timestamp?: string;
}

// Query parameters for filtering expenses
export interface ExpenseFilters {
  category?: string;
  paidBy?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: 'date' | 'amount' | 'description' | 'category' | 'paidBy';
  sortOrder?: 'asc' | 'desc';
}

// Expense categories
export const ExpenseCategory = {
  FOOD: 'Food',
  GROCERIES: 'Groceries',
  TRANSPORTATION: 'Transportation',
  UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment',
  HEALTHCARE: 'Healthcare',
  SHOPPING: 'Shopping',
  TRAVEL: 'Travel',
  OTHER: 'Other'
} as const;

export type ExpenseCategoryType = typeof ExpenseCategory[keyof typeof ExpenseCategory];

// User IDs (for the two partners)
export const UserId = {
  TAHA: 'taha',
  BURAK: 'burak'
} as const;

export type UserIdType = typeof UserId[keyof typeof UserId];

// Expense summary for dashboard
export interface ExpenseSummary {
  totalAmount: number;
  expenseCount: number;
  averageAmount: number;
  lastExpenseDate?: string;
}

// Monthly expense breakdown
export interface MonthlyExpense {
  month: string; // YYYY-MM format
  totalAmount: number;
  expenseCount: number;
  categories: Record<string, number>; // category -> total amount
}

// Category breakdown for charts
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

// Balance calculation between partners
export interface BalanceCalculation {
  tahaTotal: number;
  burakTotal: number;
  combinedTotal: number;
  netBalance: number; // Absolute value of running balance (always positive for display)
  whoOwesWhom: 'taha_owes_burak' | 'burak_owes_taha' | 'balanced';
}

// Simple error response from API
export interface ExpenseApiError {
  success: false;
  error: string;
  message?: string;
  timestamp?: string;
}
