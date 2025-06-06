// React Query hook for dashboard data
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '../services/dashboard';

// Query keys for dashboard
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
} 