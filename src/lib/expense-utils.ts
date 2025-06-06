// Utility functions for expense calculations and formatting
import type {
  Expense,
  BalanceCalculation,
  ExpenseSummary,
  CategoryBreakdown
} from '../types';
import { UserId } from '../types';

/**
 * Calculate balance between partners based on 50/50 expense splitting
 * Partnership Logic: 
 * - All expenses are automatically split 50/50 between partners
 * - Each partner's share = total expenses / 2
 * - Balance = what they paid - what they owe
 * - Positive balance = credit (owed money), Negative balance = debt (owes money)
 */
export function calculateBalance(expenses: Expense[]): BalanceCalculation {
  const tahaTotal = expenses
    .filter(expense => expense.paidById === UserId.TAHA)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const burakTotal = expenses
    .filter(expense => expense.paidById === UserId.BURAK)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const combinedTotal = tahaTotal + burakTotal;

  // Partnership calculation: Each partner owes 50% of total expenses
  const eachPartnerShare = combinedTotal / 2;
  
  // Calculate each partner's balance (what they paid - what they owe)
  const tahaBalance = tahaTotal - eachPartnerShare;
  const burakBalance = burakTotal - eachPartnerShare;
  
  // Net balance between partners (positive = Burak owes Taha, negative = Taha owes Burak)
  const netBalance = tahaBalance - burakBalance;

  let whoOwesWhom: BalanceCalculation['whoOwesWhom'];
  if (Math.abs(netBalance) < 0.01) {
    whoOwesWhom = 'balanced';
  } else if (netBalance > 0) {
    whoOwesWhom = 'burak_owes_taha';
  } else {
    whoOwesWhom = 'taha_owes_burak';
  }

  return {
    tahaTotal,
    burakTotal,
    combinedTotal,
    netBalance: Math.abs(netBalance),
    whoOwesWhom,
    // Add new partnership-specific data
    tahaPaid: tahaTotal,
    burakPaid: burakTotal,
    tahaOwes: eachPartnerShare,
    burakOwes: eachPartnerShare,
    tahaBalance: tahaBalance,
    burakBalance: burakBalance
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
