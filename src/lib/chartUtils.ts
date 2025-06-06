// Chart utility functions and helpers

import { format, parseISO, subMonths } from 'date-fns';
import type { Expense } from '../types';
import type {
  MonthlyData,
  CategoryData,
  UserComparisonData,
  BalanceHistoryData
} from '../types/analytics';
import { getCategoryColor } from './chartTheme';

// Format currency for chart display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage for chart display
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Format date for chart labels
export const formatChartDate = (date: string, format_type: 'month' | 'day' | 'year' = 'month'): string => {
  const parsedDate = parseISO(date);

  switch (format_type) {
    case 'month':
      return format(parsedDate, 'MMM yyyy');
    case 'day':
      return format(parsedDate, 'MMM dd');
    case 'year':
      return format(parsedDate, 'yyyy');
    default:
      return format(parsedDate, 'MMM yyyy');
  }
};

// Process expenses into monthly data
export const processMonthlyData = (expenses: Expense[]): MonthlyData[] => {
  if (!expenses.length) return [];

  // Group expenses by month
  const monthlyGroups = expenses.reduce((acc, expense) => {
    const monthKey = format(parseISO(expense.date), 'yyyy-MM');

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        totalExpenses: 0,
        tahaExpenses: 0,
        burakExpenses: 0,
        expenseCount: 0,
        avgExpenseAmount: 0,
      };
    }

    acc[monthKey].totalExpenses += expense.amount;
    acc[monthKey].expenseCount += 1;

    if (expense.paidById === 'taha') {
      acc[monthKey].tahaExpenses += expense.amount;
    } else if (expense.paidById === 'burak') {
      acc[monthKey].burakExpenses += expense.amount;
    }

    return acc;
  }, {} as Record<string, MonthlyData>);

  // Calculate averages and sort by month
  return Object.values(monthlyGroups)
    .map(month => ({
      ...month,
      avgExpenseAmount: month.totalExpenses / month.expenseCount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Process expenses into category data
export const processCategoryData = (expenses: Expense[]): CategoryData[] => {
  if (!expenses.length) return [];

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group by category
  const categoryGroups = expenses.reduce((acc, expense) => {
    const category = expense.category;

    if (!acc[category]) {
      acc[category] = {
        category,
        amount: 0,
        count: 0,
        avgAmount: 0,
      };
    }

    acc[category].amount += expense.amount;
    acc[category].count += 1;

    return acc;
  }, {} as Record<string, Omit<CategoryData, 'percentage' | 'color'>>);

  // Calculate percentages and add colors
  return Object.values(categoryGroups)
    .map(category => ({
      ...category,
      percentage: (category.amount / totalAmount) * 100,
      color: getCategoryColor(category.category),
      avgAmount: category.amount / category.count,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Process expenses into user comparison data
export const processUserComparisonData = (
  expenses: Expense[],
  granularity: 'month' | 'week' = 'month'
): UserComparisonData[] => {
  if (!expenses.length) return [];

  const formatKey = granularity === 'month' ? 'yyyy-MM' : 'yyyy-[W]ww';

  // Group by time period
  const periodGroups = expenses.reduce((acc, expense) => {
    const periodKey = format(parseISO(expense.date), formatKey);

    if (!acc[periodKey]) {
      acc[periodKey] = {
        period: periodKey,
        taha: 0,
        burak: 0,
        tahaCount: 0,
        burakCount: 0,
        difference: 0,
      };
    }

    if (expense.paidById === 'taha') {
      acc[periodKey].taha += expense.amount;
      acc[periodKey].tahaCount += 1;
    } else if (expense.paidById === 'burak') {
      acc[periodKey].burak += expense.amount;
      acc[periodKey].burakCount += 1;
    }

    return acc;
  }, {} as Record<string, UserComparisonData>);

  // Calculate differences and sort
  return Object.values(periodGroups)
    .map(period => ({
      ...period,
      difference: period.taha - period.burak,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

// Process balance history data
export const processBalanceHistory = (
  expenses: Expense[],
  settlements: any[] = []
): BalanceHistoryData[] => {
  if (!expenses.length) return [];

  // Combine and sort all transactions by date
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...settlements.map(s => ({ ...s, type: 'settlement' })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let tahaTotalPaid = 0;
  let burakTotalPaid = 0;
  let cumulativeExpenses = 0;
  let totalSettlements = 0;

  return allTransactions.map(transaction => {
    if (transaction.type === 'expense') {
      cumulativeExpenses += transaction.amount;
      
      // Track total paid by each partner
      if (transaction.paidById === 'taha') {
        tahaTotalPaid += transaction.amount;
      } else if (transaction.paidById === 'burak') {
        burakTotalPaid += transaction.amount;
      }
    } else {
      totalSettlements += transaction.amount;
      // Note: Settlements would adjust the balance but we'll handle that separately
    }

    // Calculate partnership balance (50/50 split)
    const totalExpenses = tahaTotalPaid + burakTotalPaid;
    const eachPartnerShare = totalExpenses / 2;
    const tahaBalance = tahaTotalPaid - eachPartnerShare;
    const burakBalance = burakTotalPaid - eachPartnerShare;
    const runningBalance = tahaBalance - burakBalance; // Net balance between partners

    return {
      date: transaction.date,
      balance: runningBalance,
      cumulativeExpenses,
      settlements: totalSettlements,
      runningBalance,
    };
  });
};

// Process top categories data
export const processTopCategoriesData = (
  expenses: Expense[],
  maxCategories: number = 5
): CategoryData[] => {
  const categoryData = processCategoryData(expenses);

  return categoryData.slice(0, maxCategories);
};

// Validate chart data
export const validateChartData = (data: any[], requiredFields: string[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every(item =>
    requiredFields.every(field =>
      item.hasOwnProperty(field) && item[field] !== null && item[field] !== undefined
    )
  );
};

// Generate empty chart data for loading states
export const generateEmptyChartData = (type: 'monthly' | 'category' | 'comparison'): any[] => {
  switch (type) {
    case 'monthly':
      return Array.from({ length: 6 }, (_, i) => ({
        month: format(subMonths(new Date(), 5 - i), 'yyyy-MM'),
        totalExpenses: 0,
        tahaExpenses: 0,
        burakExpenses: 0,
        expenseCount: 0,
      }));

    case 'category':
      return [
        { category: 'Food', amount: 0, percentage: 0, count: 0 },
        { category: 'Transportation', amount: 0, percentage: 0, count: 0 },
        { category: 'Groceries', amount: 0, percentage: 0, count: 0 },
      ];

    case 'comparison':
      return Array.from({ length: 3 }, (_, i) => ({
        period: format(subMonths(new Date(), 2 - i), 'yyyy-MM'),
        taha: 0,
        burak: 0,
        difference: 0,
      }));

    default:
      return [];
  }
};

// Calculate chart dimensions based on container
export const calculateChartDimensions = (
  containerWidth: number,
  aspectRatio: number = 16/9,
  minHeight: number = 200,
  maxHeight: number = 500
): { width: number; height: number } => {
  const calculatedHeight = containerWidth / aspectRatio;
  const height = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));

  return {
    width: containerWidth,
    height,
  };
};

// Debounce function for chart updates
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
