// Advanced data processing functions for charts and analytics

import { format, parseISO, startOfWeek, endOfWeek, subDays, isValid } from 'date-fns';
import type { Expense } from '../types';
import type {
  MonthlyData,
  CategoryData,
  UserComparisonData,
  BalanceHistoryData,
  TimePatternData,
  AnalyticsFilters
} from '../types/analytics';

// Helper function to safely parse dates and filter out invalid ones
function safeParseDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    console.warn('Invalid date string:', dateString, error);
    return null;
  }
}

// Helper function to filter expenses with valid dates
function filterValidExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(expense => {
    const date = safeParseDate(expense.date);
    if (!date) {
      console.warn('Filtering out expense with invalid date:', expense.id, expense.date);
      return false;
    }
    return true;
  });
}

// Advanced monthly data processing with trends
export const processAdvancedMonthlyData = (
  expenses: Expense[],
  filters?: AnalyticsFilters
): MonthlyData[] => {
  // Filter out expenses with invalid dates first
  let filteredExpenses = filterValidExpenses(expenses);

  // Apply filters
  if (filters) {
    if (filters.startDate) {
      filteredExpenses = filteredExpenses.filter(e => e.date >= filters.startDate!);
    }
    if (filters.endDate) {
      filteredExpenses = filteredExpenses.filter(e => e.date <= filters.endDate!);
    }
    if (filters.categories?.length) {
      filteredExpenses = filteredExpenses.filter(e => filters.categories!.includes(e.category));
    }
    if (filters.users?.length) {
      filteredExpenses = filteredExpenses.filter(e => filters.users!.includes(e.paidById));
    }
  }

  // Group by month and calculate metrics
  const monthlyGroups = filteredExpenses.reduce((acc, expense) => {
    const date = safeParseDate(expense.date);
    if (!date) return acc; // Skip invalid dates
    
    const monthKey = format(date, 'yyyy-MM');

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

  // Calculate averages and return sorted data
  return Object.values(monthlyGroups)
    .map(month => ({
      ...month,
      avgExpenseAmount: month.totalExpenses / month.expenseCount || 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Process user comparison data (re-export from chartUtils)
export const processUserComparisonData = (
  expenses: Expense[],
  granularity: 'month' | 'week' = 'month'
): UserComparisonData[] => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  const formatKey = granularity === 'month' ? 'yyyy-MM' : 'yyyy-[W]ww';

  // Group by time period
  const periodGroups = validExpenses.reduce((acc, expense) => {
    const date = safeParseDate(expense.date);
    if (!date) return acc; // Skip invalid dates
    
    const periodKey = format(date, formatKey);

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

// Process balance history data (re-export from chartUtils)
export const processBalanceHistory = (
  expenses: Expense[],
  settlements: any[] = []
): BalanceHistoryData[] => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  // Combine and sort all transactions by date
  const allTransactions = [
    ...validExpenses.map(e => ({ ...e, type: 'expense' })),
    ...settlements.filter(s => safeParseDate(s.date)).map(s => ({ ...s, type: 'settlement' })),
  ].sort((a, b) => {
    const dateA = safeParseDate(a.date);
    const dateB = safeParseDate(b.date);
    if (!dateA || !dateB) return 0;
    return dateA.getTime() - dateB.getTime();
  });

  let runningBalance = 0;
  let cumulativeExpenses = 0;
  let totalSettlements = 0;

  return allTransactions.map(transaction => {
    if (transaction.type === 'expense') {
      cumulativeExpenses += transaction.amount;
      // Taha's expenses are positive (he owes), Burak's are negative (he's owed)
      if (transaction.paidById === 'taha') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
      }
    } else {
      totalSettlements += transaction.amount;
      // Settlements adjust the balance
      runningBalance -= transaction.amount;
    }

    return {
      date: transaction.date,
      balance: runningBalance,
      cumulativeExpenses,
      settlements: totalSettlements,
      runningBalance,
    };
  });
};

// Enhanced category data with trends and comparisons
export const processAdvancedCategoryData = (
  expenses: Expense[]
): CategoryData[] => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  const totalAmount = validExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group by category
  const categoryGroups = validExpenses.reduce((acc, expense) => {
    const category = expense.category;

    if (!acc[category]) {
      acc[category] = {
        category,
        amount: 0,
        count: 0,
        expenses: [],
      };
    }

    acc[category].amount += expense.amount;
    acc[category].count += 1;
    acc[category].expenses.push(expense);

    return acc;
  }, {} as Record<string, any>);

  // Process and enhance category data
  return Object.values(categoryGroups)
    .map(category => ({
      category: category.category,
      amount: category.amount,
      percentage: (category.amount / totalAmount) * 100,
      count: category.count,
      color: getCategoryColor(category.category),
      avgAmount: category.amount / category.count,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Time pattern analysis
export const processTimePatternData = (expenses: Expense[]): TimePatternData[] => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  const patterns = validExpenses.reduce((acc, expense) => {
    const date = safeParseDate(expense.date);
    if (!date) return acc; // Skip invalid dates
    
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const key = `${dayOfWeek}-${hour}`;

    if (!acc[key]) {
      acc[key] = {
        dayOfWeek,
        hour,
        amount: 0,
        count: 0,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        timeSlot: getTimeSlot(hour),
      };
    }

    acc[key].amount += expense.amount;
    acc[key].count += 1;

    return acc;
  }, {} as Record<string, TimePatternData>);

  return Object.values(patterns);
};

// Helper function to determine time slot
function getTimeSlot(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  if (hour >= 18 && hour < 22) return 'Evening';
  return 'Night';
}

// Weekly spending analysis
export const processWeeklySpendingData = (expenses: Expense[]) => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  const weeklyGroups = validExpenses.reduce((acc, expense) => {
    const date = safeParseDate(expense.date);
    if (!date) return acc; // Skip invalid dates
    
    const weekStart = startOfWeek(date);
    const weekKey = format(weekStart, 'yyyy-[W]ww');

    if (!acc[weekKey]) {
      acc[weekKey] = {
        week: weekKey,
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        weekEnd: format(endOfWeek(date), 'yyyy-MM-dd'),
        totalAmount: 0,
        expenseCount: 0,
        tahaAmount: 0,
        burakAmount: 0,
        dailyBreakdown: {},
      };
    }

    acc[weekKey].totalAmount += expense.amount;
    acc[weekKey].expenseCount += 1;

    if (expense.paidById === 'taha') {
      acc[weekKey].tahaAmount += expense.amount;
    } else {
      acc[weekKey].burakAmount += expense.amount;
    }

    // Daily breakdown
    const dayKey = format(date, 'yyyy-MM-dd');
    if (!acc[weekKey].dailyBreakdown[dayKey]) {
      acc[weekKey].dailyBreakdown[dayKey] = 0;
    }
    acc[weekKey].dailyBreakdown[dayKey] += expense.amount;

    return acc;
  }, {} as Record<string, any>);

  return Object.values(weeklyGroups)
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
};

// Spending velocity analysis (rate of spending over time)
export const processSpendingVelocity = (expenses: Expense[]) => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (validExpenses.length < 2) return [];

  const sortedExpenses = [...validExpenses].sort((a, b) => {
    const dateA = safeParseDate(a.date);
    const dateB = safeParseDate(b.date);
    if (!dateA || !dateB) return 0;
    return dateA.getTime() - dateB.getTime();
  });

  let cumulativeAmount = 0;
  const velocityData = [];

  for (let i = 0; i < sortedExpenses.length; i++) {
    cumulativeAmount += sortedExpenses[i].amount;

    const currentDate = safeParseDate(sortedExpenses[i].date);
    const startDate = safeParseDate(sortedExpenses[0].date);
    
    if (!currentDate || !startDate) continue;

    const daysSinceStart = i === 0 ? 1 :
      Math.max(1, Math.ceil(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ));

    let velocity = 0;
    if (i > 0) {
      const prevDate = safeParseDate(sortedExpenses[i-1].date);
      if (prevDate) {
        velocity = sortedExpenses[i].amount /
          Math.max(1, (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    velocityData.push({
      date: sortedExpenses[i].date,
      cumulativeAmount,
      dailyAverage: cumulativeAmount / daysSinceStart,
      expenseCount: i + 1,
      velocity,
    });
  }

  return velocityData;
};

// Category trend analysis
export const processCategoryTrends = (
  expenses: Expense[],
  periodDays: number = 30
): any[] => {
  // Filter out expenses with invalid dates first
  const validExpenses = filterValidExpenses(expenses);
  if (!validExpenses.length) return [];

  const cutoffDate = subDays(new Date(), periodDays);

  const currentPeriod = validExpenses.filter(e => {
    const expenseDate = safeParseDate(e.date);
    return expenseDate && expenseDate >= cutoffDate;
  });

  const previousPeriod = validExpenses.filter(e => {
    const expenseDate = safeParseDate(e.date);
    return expenseDate && 
           expenseDate < cutoffDate &&
           expenseDate >= subDays(cutoffDate, periodDays);
  });

  const currentCategories = processAdvancedCategoryData(currentPeriod);
  const previousCategories = processAdvancedCategoryData(previousPeriod);

  return currentCategories.map(current => {
    const previous = previousCategories.find(p => p.category === current.category);
    const previousAmount = previous?.amount || 0;

    const change = current.amount - previousAmount;
    const changePercent = previousAmount > 0 ? (change / previousAmount) * 100 : 0;

    return {
      ...current,
      previousAmount,
      change,
      changePercent,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  });
};

// Budget vs actual analysis
export const processBudgetAnalysis = (
  expenses: Expense[],
  budgets: Record<string, number> = {}
) => {
  const categoryData = processAdvancedCategoryData(expenses);

  return categoryData.map(category => {
    const budget = budgets[category.category] || 0;
    const actual = category.amount;
    const variance = actual - budget;
    const variancePercent = budget > 0 ? (variance / budget) * 100 : 0;

    return {
      ...category,
      budget,
      actual,
      variance,
      variancePercent,
      status: variance > 0 ? 'over' : variance < 0 ? 'under' : 'on-target',
    };
  });
};

// Expense frequency analysis
export const processExpenseFrequency = (expenses: Expense[]) => {
  const frequencyData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const user = expense.paidById;

    if (!acc[category]) {
      acc[category] = {
        category,
        totalCount: 0,
        users: {},
        avgDaysBetween: 0,
        dates: [],
      };
    }

    acc[category].totalCount += 1;
    acc[category].dates.push(expense.date);

    if (!acc[category].users[user]) {
      acc[category].users[user] = 0;
    }
    acc[category].users[user] += 1;

    return acc;
  }, {} as Record<string, any>);

  // Calculate average days between expenses
  Object.values(frequencyData).forEach((category: any) => {
    if (category.dates.length > 1) {
      const sortedDates = category.dates.sort();
      const daysBetween = [];

      for (let i = 1; i < sortedDates.length; i++) {
        const days = Math.ceil(
          (new Date(sortedDates[i]).getTime() - new Date(sortedDates[i-1]).getTime())
          / (1000 * 60 * 60 * 24)
        );
        daysBetween.push(days);
      }

      category.avgDaysBetween = daysBetween.reduce((sum, days) => sum + days, 0) / daysBetween.length;
    }
  });

  return Object.values(frequencyData);
};

// Import helper function
function getCategoryColor(category: string): string {
  // This should import from chartTheme, but avoiding circular dependency for now
  const colors: Record<string, string> = {
    Food: '#3B82F6',
    Groceries: '#10B981',
    Transportation: '#F59E0B',
    Utilities: '#EF4444',
    Entertainment: '#8B5CF6',
    Healthcare: '#06B6D4',
    Shopping: '#F97316',
    Travel: '#84CC16',
    Other: '#6B7280',
  };
  return colors[category] || '#6B7280';
}
