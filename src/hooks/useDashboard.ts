// React Query hook for dashboard data
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../services/dashboard';

// Query keys for React Query
export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
};

/**
 * Hook to fetch dashboard data including partnership balances
 */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: (failureCount, error) => {
      // Only retry network errors, not application errors
      if (failureCount >= 2) return false;
      if (error?.message?.includes('Failed to fetch')) return true;
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

  });
} 