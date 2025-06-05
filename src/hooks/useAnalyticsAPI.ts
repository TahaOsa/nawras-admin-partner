// React hooks for fetching analytics data from API endpoints

import { useQuery } from '@tanstack/react-query';
import { config } from '@/lib/config';
import type {
  AnalyticsFilters,
  MonthlyData,
  CategoryData,
  UserComparisonData,
  BalanceHistoryData,
  TimePatternData,
  AnalyticsResponse
} from '../types/analytics';

const API_BASE_URL = config.apiBaseUrl;

// Fetch monthly analytics data
export function useMonthlyAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'monthly', filters],
    queryFn: async (): Promise<MonthlyData[]> => {
      const params = new URLSearchParams();

      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.granularity) params.append('granularity', filters.granularity);

      const response = await fetch(`${API_BASE_URL}/api/analytics/monthly?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch monthly analytics');
      }

      const result: AnalyticsResponse<MonthlyData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch monthly analytics');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fetch category analytics data
export function useCategoryAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'categories', filters],
    queryFn: async (): Promise<CategoryData[]> => {
      const params = new URLSearchParams();

      if (filters?.period) params.append('period', filters.period);
      if (filters?.groupBy) params.append('groupBy', filters.groupBy);

      const response = await fetch(`${API_BASE_URL}/api/analytics/categories?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
      }

      const result: AnalyticsResponse<CategoryData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch category analytics');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fetch user comparison analytics data
export function useUserAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'users', filters],
    queryFn: async (): Promise<UserComparisonData[]> => {
      const params = new URLSearchParams();

      if (filters?.period) params.append('period', filters.period);
      if (filters?.granularity) params.append('granularity', filters.granularity);

      const response = await fetch(`${API_BASE_URL}/api/analytics/users?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user analytics');
      }

      const result: AnalyticsResponse<UserComparisonData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user analytics');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fetch balance history analytics data
export function useBalanceHistoryAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'balance-history', filters],
    queryFn: async (): Promise<BalanceHistoryData[]> => {
      const params = new URLSearchParams();

      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`${API_BASE_URL}/api/analytics/balance-history?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch balance history analytics');
      }

      const result: AnalyticsResponse<BalanceHistoryData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch balance history analytics');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Fetch time patterns analytics data
export function useTimePatternAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ['analytics', 'time-patterns', filters],
    queryFn: async (): Promise<TimePatternData[]> => {
      const params = new URLSearchParams();

      if (filters?.period) params.append('period', filters.period);

      const response = await fetch(`${API_BASE_URL}/api/analytics/time-patterns?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch time pattern analytics');
      }

      const result: AnalyticsResponse<TimePatternData> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch time pattern analytics');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Combined analytics hook for dashboard
export function useDashboardAnalytics(filters?: AnalyticsFilters) {
  const monthlyQuery = useMonthlyAnalytics(filters);
  const categoryQuery = useCategoryAnalytics(filters);
  const userQuery = useUserAnalytics(filters);

  return {
    monthly: {
      data: monthlyQuery.data || [],
      isLoading: monthlyQuery.isLoading,
      error: monthlyQuery.error,
      refetch: monthlyQuery.refetch,
    },
    categories: {
      data: categoryQuery.data || [],
      isLoading: categoryQuery.isLoading,
      error: categoryQuery.error,
      refetch: categoryQuery.refetch,
    },
    users: {
      data: userQuery.data || [],
      isLoading: userQuery.isLoading,
      error: userQuery.error,
      refetch: userQuery.refetch,
    },
    isLoading: monthlyQuery.isLoading || categoryQuery.isLoading || userQuery.isLoading,
    error: monthlyQuery.error || categoryQuery.error || userQuery.error,
    refetchAll: () => {
      monthlyQuery.refetch();
      categoryQuery.refetch();
      userQuery.refetch();
    },
  };
}

// Analytics summary hook for quick stats
export function useAnalyticsSummary(period: string = '6months') {
  return useQuery({
    queryKey: ['analytics', 'summary', period],
    queryFn: async () => {
      // Fetch all analytics data for summary
      const [monthlyRes, categoryRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/monthly?period=${period}`),
        fetch(`${API_BASE_URL}/api/analytics/categories?period=${period}`),
        fetch(`${API_BASE_URL}/api/analytics/users?period=${period}`),
      ]);

      if (!monthlyRes.ok || !categoryRes.ok || !userRes.ok) {
        throw new Error('Failed to fetch analytics summary');
      }

      const [monthly, categories, users] = await Promise.all([
        monthlyRes.json(),
        categoryRes.json(),
        userRes.json(),
      ]);

      // Calculate summary statistics
      const totalExpenses = monthly.data?.reduce((sum: number, month: MonthlyData) =>
        sum + month.totalExpenses, 0) || 0;

      const totalCategories = categories.data?.length || 0;
      const topCategory = categories.data?.[0]?.category || 'None';

      const currentBalance = users.metadata?.currentBalance || 0;
      const balanceTrend = users.metadata?.trend || 'balanced';

      return {
        totalExpenses,
        totalCategories,
        topCategory,
        currentBalance,
        balanceTrend,
        period,
        lastUpdated: new Date().toISOString(),
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
