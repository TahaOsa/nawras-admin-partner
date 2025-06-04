// Dashboard charts component integrating multiple chart types

import { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Calendar } from 'lucide-react';
import { MonthlyTrendsChart } from '../charts/MonthlyTrendsChart';
import { CategoryBreakdownChart } from '../charts/CategoryBreakdownChart';
import { UserComparisonChart } from '../charts/UserComparisonChart';
import { useDashboardAnalytics } from '../../hooks/useAnalyticsAPI';
import type { AnalyticsFilters } from '../../types/analytics';

interface DashboardChartsProps {
  className?: string;
}

export function DashboardCharts({ className = '' }: DashboardChartsProps) {
  // Analytics filters state
  const [analyticsFilters, setAnalyticsFilters] = useState<AnalyticsFilters>({
    period: 'all',
    granularity: 'month',
  });

  // Fetch analytics data
  const { monthly, categories, users, isLoading, error } = useDashboardAnalytics(analyticsFilters);

  // Handle chart interactions
  const handleMonthlyDataClick = (data: any) => {
    console.log('Monthly data clicked:', data);
    // TODO: Navigate to detailed view or update filters
  };

  const handleCategoryClick = (data: any) => {
    console.log('Category clicked:', data);
    // TODO: Filter expenses by category
  };

  const handleUserComparisonClick = (data: any) => {
    console.log('User comparison clicked:', data);
    // TODO: Show detailed user breakdown
  };

  // Period filter options
  const periodOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  const updatePeriod = (period: string) => {
    setAnalyticsFilters(prev => ({
      ...prev,
      period: period as AnalyticsFilters['period']
    }));
  };

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="h-12 w-12 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load analytics
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'An error occurred while loading chart data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Charts Header with Period Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Visual insights into your expense patterns
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={analyticsFilters.period}
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
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartLoadingSkeleton
              title="Monthly Expense Trends"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          ) : (
            <MonthlyTrendsChart
              data={monthly.data}
              height={350}
              showComparison={true}
              onDataPointClick={handleMonthlyDataClick}
            />
          )}
        </div>

        {/* Category Breakdown Chart */}
        <div>
          {isLoading ? (
            <ChartLoadingSkeleton
              title="Expense Categories"
              icon={<PieChart className="h-5 w-5" />}
            />
          ) : (
            <CategoryBreakdownChart
              data={categories.data}
              height={400}
              showPercentages={true}
              onSliceClick={handleCategoryClick}
            />
          )}
        </div>

        {/* User Comparison Chart */}
        <div>
          {isLoading ? (
            <ChartLoadingSkeleton
              title="User Spending Comparison"
              icon={<BarChart3 className="h-5 w-5" />}
            />
          ) : (
            <UserComparisonChart
              data={users.data}
              height={400}
              showDifference={true}
              onBarClick={handleUserComparisonClick}
            />
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">
              {monthly.data.length}
            </div>
            <div className="text-sm text-blue-600">Months Tracked</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-900">
              {categories.data.length}
            </div>
            <div className="text-sm text-green-600">Categories</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-900">
              {categories.data[0]?.category || 'None'}
            </div>
            <div className="text-sm text-purple-600">Top Category</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-900">
              {users.data.length}
            </div>
            <div className="text-sm text-orange-600">Periods</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading skeleton component for charts
function ChartLoadingSkeleton({
  title,
  icon
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
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

export default DashboardCharts;
