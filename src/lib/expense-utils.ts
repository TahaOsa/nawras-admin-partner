// Utility functions for expense calculations and formatting
import type {
  Expense,
  BalanceCalculation,
  ExpenseSummary,
  CategoryBreakdown
} from '../types';
import { UserId } from '../types';

/**
 * Calculate balance between partners based on expenses
 * Logic: Track running balance where Taha's expenses are positive (he owes)
 * and Burak's expenses are negative (he's owed)
 */
export function calculateBalance(expenses: Expense[]): BalanceCalculation {
  const tahaTotal = expenses
    .filter(expense => expense.paidById === UserId.TAHA)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const burakTotal = expenses
    .filter(expense => expense.paidById === UserId.BURAK)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const combinedTotal = tahaTotal + burakTotal;

  // Calculate running balance: Taha's expenses are positive (he owes), Burak's are negative (he's owed)
  let runningBalance = 0;
  expenses.forEach(expense => {
    if (expense.paidById === UserId.TAHA) {
      runningBalance += expense.amount;
    } else if (expense.paidById === UserId.BURAK) {
      runningBalance -= expense.amount;
    }
  });

  let whoOwesWhom: BalanceCalculation['whoOwesWhom'];
  if (Math.abs(runningBalance) < 0.01) {
    whoOwesWhom = 'balanced';
  } else if (runningBalance > 0) {
    whoOwesWhom = 'burak_owes_taha';
  } else {
    whoOwesWhom = 'taha_owes_burak';
  }

  return {
    tahaTotal,
    burakTotal,
    combinedTotal,
    netBalance: Math.abs(runningBalance),
    whoOwesWhom
  };
}

/**
 * Get expense summary for a user
 */
export function getExpenseSummary(expenses: Expense[], userId: string): ExpenseSummary {
  const userExpenses = expenses.filter(expense => expense.paidById === userId);

  const totalAmount = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = userExpenses.length;
  const averageAmount = expenseCount > 0 ? totalAmount / expenseCount : 0;

  const lastExpenseDate = userExpenses.length > 0
    ? userExpenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        .date
    : undefined;

  return {
    totalAmount,
    expenseCount,
    averageAmount,
    lastExpenseDate
  };
}

/**
 * Get category breakdown for chart visualization
 */
export function getCategoryBreakdown(expenses: Expense[]): CategoryBreakdown[] {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryCounts = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      count: categoryCounts[category] || 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get recent expenses (last N expenses)
 */
export function getRecentExpenses(expenses: Expense[], limit: number = 5): Expense[] {
  return expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
