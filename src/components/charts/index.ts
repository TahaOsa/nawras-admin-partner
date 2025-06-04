// Export all chart components and utilities

// Base components
export { default as BaseChart } from './BaseChart';
export { default as ChartContainer, useResponsiveChart, CustomTooltip, CustomLegend } from './ChartContainer';

// Chart components
export { default as MonthlyTrendsChart } from './MonthlyTrendsChart';
export { default as CategoryBreakdownChart } from './CategoryBreakdownChart';
export { default as UserComparisonChart } from './UserComparisonChart';
export { default as BalanceHistoryChart } from './BalanceHistoryChart';
export { default as TopCategoriesChart } from './TopCategoriesChart';
export { default as TimePatternChart } from './TimePatternChart';

// Chart utilities and types
export type {
  BaseChartProps,
  ChartContainerProps,
  ChartTheme,
  ChartBreakpoints,
  MonthlyTrendsChartProps,
  CategoryBreakdownChartProps,
  UserComparisonChartProps,
  BalanceHistoryChartProps,
  TopCategoriesChartProps,
} from '../../types/charts';

// Chart theme and styling
export {
  chartTheme,
  chartBreakpoints,
  chartColorSchemes,
  getChartColors,
  getCategoryColor,
  getUserColor,
  getTrendColor,
  getBalanceColor,
  commonChartConfig,
  getResponsiveDimensions,
  chartMargins,
  chartAnimations,
  gridStyles,
  axisStyles,
  tooltipStyles,
  legendStyles,
} from '../../lib/chartTheme';

// Chart utilities
export {
  formatCurrency,
  formatPercentage,
  formatChartDate,
  processMonthlyData,
  processCategoryData,
  processUserComparisonData,
  processBalanceHistory,
  processTopCategoriesData,
  validateChartData,
  generateEmptyChartData,
  calculateChartDimensions,
  debounce,
} from '../../lib/chartUtils';

// Data processing functions
export {
  processAdvancedMonthlyData,
  processAdvancedCategoryData,
  processTimePatternData,
  processWeeklySpendingData,
  processSpendingVelocity,
  processCategoryTrends,
  processBudgetAnalysis,
  processExpenseFrequency,
} from '../../lib/dataProcessing';

// Analytics hooks
export {
  useAnalytics,
  useMonthlyTrends,
  useCategoryAnalytics,
  useUserComparison,
  useBalanceHistory,
  useChartData,
  useRealtimeChartUpdates,
  useChartExport,
  useChartPerformance,
} from '../../hooks/useAnalytics';

// Analytics API hooks
export {
  useMonthlyAnalytics,
  useCategoryAnalytics as useCategoryAnalyticsAPI,
  useUserAnalytics,
  useBalanceHistoryAnalytics,
  useTimePatternAnalytics,
  useDashboardAnalytics,
  useAnalyticsSummary,
} from '../../hooks/useAnalyticsAPI';

// Analytics types
export type {
  MonthlyData,
  CategoryData,
  UserComparisonData,
  BalanceHistoryData,
  TimePatternData,
  TopCategoryData,
  AnalyticsMetadata,
  AnalyticsResponse,
  ChartDataPoint,
  TrendDataPoint,
  ComparisonDataPoint,
  AnalyticsFilters,
  ExportData,
  ReportSummary,
} from '../../types/analytics';
