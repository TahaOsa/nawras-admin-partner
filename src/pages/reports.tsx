// Comprehensive reports page with advanced analytics

import { useState } from 'react';
import { Calendar, Download, TrendingUp, PieChart, BarChart3, DollarSign } from 'lucide-react';
import { MonthlyTrendsChart } from '../components/charts/MonthlyTrendsChart';
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart';
import { UserComparisonChart } from '../components/charts/UserComparisonChart';
import { BalanceHistoryChart } from '../components/charts/BalanceHistoryChart';
import { TopCategoriesChart } from '../components/charts/TopCategoriesChart';
import { TimePatternChart } from '../components/charts/TimePatternChart';
import {
  useMonthlyAnalytics,
  useCategoryAnalytics,
  useUserAnalytics,
  useBalanceHistoryAnalytics,
  useTimePatternAnalytics
} from '../hooks/useAnalyticsAPI';
import type { AnalyticsFilters } from '../types/analytics';

const ReportsPage: React.FC = () => {
  // Filter state
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'all',
    granularity: 'month',
  });

  // Fetch all analytics data
  const { data: monthlyData = [], isLoading: monthlyLoading, error: monthlyError } = useMonthlyAnalytics(filters);
  const { data: categoryData = [], isLoading: categoryLoading, error: categoryError } = useCategoryAnalytics(filters);
  const { data: userData = [], isLoading: userLoading, error: userError } = useUserAnalytics(filters);
  const { data: balanceData = [], isLoading: balanceLoading, error: balanceError } = useBalanceHistoryAnalytics(filters);
  const { data: timePatternData = [], isLoading: timePatternLoading, error: timePatternError } = useTimePatternAnalytics(filters);

  // Combined loading and error states
  const isLoading = monthlyLoading || categoryLoading || userLoading || balanceLoading || timePatternLoading;
  const error = monthlyError || categoryError || userError || balanceError || timePatternError;

  // Period filter options
  const periodOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  const updatePeriod = (period: string) => {
    setFilters(prev => ({
      ...prev,
      period: period as AnalyticsFilters['period']
    }));
  };

  // Chart interaction handlers
  const handleChartClick = (chartType: string, data: any) => {
    console.log(`${chartType} clicked:`, data);
    // TODO: Implement drill-down functionality
  };

  // Export functionality
  const handleExport = () => {
    console.log('Exporting reports...');
    // TODO: Implement export functionality
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Failed to load reports
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {error instanceof Error ? error.message : 'An error occurred while loading report data'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Reports</h1>
              <p className="text-sm text-gray-500 mt-1">
                Comprehensive insights into your expense patterns and trends
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Period Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={filters.period}
                  onChange={(e) => updatePeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Months</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '...' : monthlyData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isLoading ? '...' : categoryData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Category</p>
                <p className="text-lg font-semibold text-gray-900">
                  {isLoading ? '...' : categoryData[0]?.category || 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Balance Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {isLoading ? '...' : balanceData.length > 0 ?
                    (balanceData[balanceData.length - 1].runningBalance > 0 ? 'Taha Owes' :
                     balanceData[balanceData.length - 1].runningBalance < 0 ? 'Burak Owes' : 'Balanced')
                    : 'Balanced'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Row 1: Monthly Trends (Full Width) */}
          <div>
            {isLoading ? (
              <ChartLoadingSkeleton title="Monthly Expense Trends" />
            ) : (
              <MonthlyTrendsChart
                data={monthlyData}
                height={400}
                showComparison={true}
                onDataPointClick={(data) => handleChartClick('monthly', data)}
              />
            )}
          </div>

          {/* Row 2: Category & User Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Category Breakdown" />
              ) : (
                <CategoryBreakdownChart
                  data={categoryData}
                  height={450}
                  showPercentages={true}
                  onSliceClick={(data) => handleChartClick('category', data)}
                />
              )}
            </div>

            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="User Comparison" />
              ) : (
                <UserComparisonChart
                  data={userData}
                  height={450}
                  showDifference={true}
                  onBarClick={(data) => handleChartClick('user', data)}
                />
              )}
            </div>
          </div>

          {/* Row 3: Balance History (Full Width) */}
          <div>
            {isLoading ? (
              <ChartLoadingSkeleton title="Balance History" />
            ) : (
              <BalanceHistoryChart
                data={balanceData}
                height={400}
                showSettlements={true}
                onPointClick={(data) => handleChartClick('balance', data)}
              />
            )}
          </div>

          {/* Row 4: Top Categories & Time Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Top Categories" />
              ) : (
                <TopCategoriesChart
                  data={categoryData}
                  height={450}
                  maxCategories={5}
                  showTrends={true}
                  onCategoryClick={(data) => handleChartClick('topCategory', data)}
                />
              )}
            </div>

            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Time Patterns" />
              ) : (
                <TimePatternChart
                  data={timePatternData}
                  height={450}
                  onCellClick={(data) => handleChartClick('timePattern', data)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
function ChartLoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
