// Analytics data types for charts and reports

export interface MonthlyData {
  month: string;           // "2024-01", "2024-02"
  totalExpenses: number;   // 450.75
  tahaExpenses: number;    // 200.50
  burakExpenses: number;   // 250.25
  expenseCount: number;    // 12
  avgExpenseAmount: number; // 37.56
}

export interface CategoryData {
  category: string;        // "Food", "Transportation"
  amount: number;          // 150.75
  percentage: number;      // 23.5
  count: number;          // 8
  color: string;          // "#8884d8"
  avgAmount: number;      // 18.84
}

export interface UserComparisonData {
  period: string;          // "2024-01", "Week 1"
  taha: number;           // 125.50
  burak: number;          // 89.25
  difference: number;     // 36.25
  tahaCount: number;      // 5
  burakCount: number;     // 3
}

export interface BalanceHistoryData {
  date: string;           // "2024-01-15"
  balance: number;        // -22.13 (negative = Taha owes)
  cumulativeExpenses: number; // 1250.75
  settlements: number;    // 500.00
  runningBalance: number; // Current balance at this point
}

export interface TimePatternData {
  dayOfWeek: number;      // 0-6 (Sunday-Saturday)
  hour: number;           // 0-23
  amount: number;         // 45.50
  count: number;          // 3
  dayName: string;        // "Monday"
  timeSlot: string;       // "Morning", "Afternoon", "Evening"
}

export interface TopCategoryData {
  category: string;       // "Groceries"
  amount: number;         // 450.75
  percentage: number;     // 35.2
  avgPerExpense: number;  // 37.56
  count: number;          // 12
  trend: 'up' | 'down' | 'stable'; // Trend compared to previous period
}

export interface AnalyticsMetadata {
  totalExpenses: number;
  totalAmount: number;
  dateRange: {
    start: string;
    end: string;
  };
  lastUpdated: string;
  currency: string;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  data: T[];
  metadata: AnalyticsMetadata;
  timestamp: string;
  error?: string;
}

// Chart-specific data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  payload?: any;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface ComparisonDataPoint {
  category: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

// Analytics query parameters
export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  period?: '1week' | '1month' | '3months' | '6months' | '1year' | 'all';
  granularity?: 'day' | 'week' | 'month' | 'year';
  groupBy?: 'category' | 'user' | 'date' | 'amount';
  categories?: string[];
  users?: string[];
}

// Export data types
export interface ExportData {
  type: 'csv' | 'excel' | 'pdf' | 'png' | 'svg';
  filename: string;
  data: any[];
  metadata?: AnalyticsMetadata;
}

export interface ReportSummary {
  title: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}
