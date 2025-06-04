// React Query hooks for settlement management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSettlements,
  fetchSettlementById,
  createSettlement
} from '../services/settlements';

// Query keys for React Query
export const settlementKeys = {
  all: ['settlements'] as const,
  lists: () => [...settlementKeys.all, 'list'] as const,
  list: (filters?: { paidBy?: string; paidTo?: string; limit?: number }) => [...settlementKeys.lists(), filters] as const,
  details: () => [...settlementKeys.all, 'detail'] as const,
  detail: (id: number) => [...settlementKeys.details(), id] as const,
};

/**
 * Hook to fetch all settlements with optional filters
 */
export function useSettlements(filters?: { paidBy?: string; paidTo?: string; limit?: number }) {
  return useQuery({
    queryKey: settlementKeys.list(filters),
    queryFn: () => fetchSettlements(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single settlement by ID
 */
export function useSettlement(id: number) {
  return useQuery({
    queryKey: settlementKeys.detail(id),
    queryFn: () => fetchSettlementById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

/**
 * Hook to create a new settlement
 */
export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettlement,
    onSuccess: (newSettlement) => {
      // Invalidate and refetch settlements list
      queryClient.invalidateQueries({ queryKey: settlementKeys.lists() });

      // Optionally add the new settlement to the cache
      queryClient.setQueryData(settlementKeys.detail(newSettlement.id), newSettlement);

      // Also invalidate expenses to update balance calculations
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Failed to create settlement:', error);
    },
  });
}

/**
 * Hook to get recent settlements (convenience hook)
 */
export function useRecentSettlements(limit: number = 5) {
  return useSettlements({ limit });
}

/**
 * Hook to get settlements by user (who paid)
 */
export function useSettlementsByPayer(userId: string) {
  return useSettlements({ paidBy: userId });
}

/**
 * Hook to get settlements by recipient (who received)
 */
export function useSettlementsByRecipient(userId: string) {
  return useSettlements({ paidTo: userId });
}
