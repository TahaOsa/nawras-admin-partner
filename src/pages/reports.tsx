// Comprehensive reports page with advanced analytics

import { useState, Component } from 'react';
import type { ReactNode } from 'react';
import { Calendar, Download, TrendingUp, PieChart, BarChart3, DollarSign } from 'lucide-react';
import { useCommonTranslation } from '../hooks/useI18n';
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

// Error boundary component for charts
interface ChartErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ChartErrorBoundaryProps {
  children: ReactNode;
  chartName: string;
}

class ChartErrorBoundary extends Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Error in ${this.props.chartName}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {this.props.chartName} Error
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Unable to render chart data. This might be due to invalid data format.
            </p>
            {this.state.error && (
              <p className="text-gray-400 text-xs mb-4">
                Error: {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading skeleton component
function ChartLoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}

const ReportsPage: React.FC = () => {
  const { t } = useCommonTranslation();
  
  // Filter state
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: 'all',
    granularity: 'month',
  });

  // Fetch all analytics data with error handling
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
    { value: '1month', label: t('pages.analyticsReports.oneMonth') },
    { value: '3months', label: t('pages.analyticsReports.threeMonths') },
    { value: '6months', label: t('pages.analyticsReports.sixMonths') },
    { value: '1year', label: t('pages.analyticsReports.oneYear') },
    { value: 'all', label: t('pages.analyticsReports.allTime') },
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
                {t('pages.analyticsReports.failedToLoad')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {error instanceof Error ? error.message : t('pages.analyticsReports.errorMessage')}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('pages.analyticsReports.tryAgain')}
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
              <h1 className="text-2xl font-bold text-gray-900">{t('pages.analyticsReports.title')}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('pages.analyticsReports.subtitle')}
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
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('pages.analyticsReports.export')}
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
              <ChartErrorBoundary chartName="Monthly Expense Trends">
                <MonthlyTrendsChart
                  data={monthlyData}
                  height={400}
                  showComparison={true}
                  onDataPointClick={(data) => handleChartClick('monthly', data)}
                />
              </ChartErrorBoundary>
            )}
          </div>

          {/* Row 2: Category & User Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Category Breakdown" />
              ) : (
                <ChartErrorBoundary chartName="Category Breakdown">
                  <CategoryBreakdownChart
                    data={categoryData}
                    height={450}
                    showPercentages={true}
                    onSliceClick={(data) => handleChartClick('category', data)}
                  />
                </ChartErrorBoundary>
              )}
            </div>

            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="User Comparison" />
              ) : (
                <ChartErrorBoundary chartName="User Comparison">
                  <UserComparisonChart
                    data={userData}
                    height={450}
                    showDifference={true}
                    onBarClick={(data) => handleChartClick('user', data)}
                  />
                </ChartErrorBoundary>
              )}
            </div>
          </div>

          {/* Row 3: Balance History (Full Width) */}
          <div>
            {isLoading ? (
              <ChartLoadingSkeleton title="Balance History" />
            ) : (
              <ChartErrorBoundary chartName="Balance History">
                <BalanceHistoryChart
                  data={balanceData}
                  height={400}
                  showSettlements={true}
                  onPointClick={(data) => handleChartClick('balance', data)}
                />
              </ChartErrorBoundary>
            )}
          </div>

          {/* Row 4: Top Categories & Time Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Top Categories" />
              ) : (
                <ChartErrorBoundary chartName="Top Categories">
                  <TopCategoriesChart
                    data={categoryData}
                    height={450}
                    maxCategories={5}
                    showTrends={true}
                    onCategoryClick={(data) => handleChartClick('topCategory', data)}
                  />
                </ChartErrorBoundary>
              )}
            </div>

            <div>
              {isLoading ? (
                <ChartLoadingSkeleton title="Time Patterns" />
              ) : (
                <ChartErrorBoundary chartName="Time Patterns">
                  <TimePatternChart
                    data={timePatternData}
                    height={450}
                    onCellClick={(data) => handleChartClick('timePattern', data)}
                  />
                </ChartErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
