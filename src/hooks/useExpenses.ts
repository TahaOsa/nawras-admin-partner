// React Query hooks for expense management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ExpenseFilters,
  UpdateExpenseRequest
} from '../types';
import {
  fetchExpenses,
  fetchExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from '../services/expenses';
import { dashboardKeys } from './useDashboard';

// Query keys for React Query
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters?: ExpenseFilters) => [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: number) => [...expenseKeys.details(), id] as const,
};

/**
 * Hook to fetch all expenses with optional filters
 */
export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: expenseKeys.list(filters),
    queryFn: () => fetchExpenses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Hook to fetch a single expense by ID
 */
export function useExpense(id: number) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => fetchExpenseById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

/**
 * Hook to create a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      // Invalidate and refetch expenses list
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });

      // Invalidate dashboard data to update balance calculations
      queryClient.invalidateQueries({ queryKey: dashboardKeys.data() });

      // Optionally add the new expense to the cache
      queryClient.setQueryData(expenseKeys.detail(newExpense.id), newExpense);
    },
    onError: (error) => {
      console.error('Failed to create expense:', error);
    },
  });
}

/**
 * Hook to update an existing expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, expense }: { id: number; expense: UpdateExpenseRequest }) =>
      updateExpense(id, expense),
    onSuccess: (updatedExpense) => {
      // Update the specific expense in cache
      queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);

      // Invalidate expenses list to refetch
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });

      // Invalidate dashboard data to update balance calculations
      queryClient.invalidateQueries({ queryKey: dashboardKeys.data() });
    },
    onError: (error) => {
      console.error('Failed to update expense:', error);
    },
  });
}

/**
 * Hook to delete an expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (_, deletedId) => {
      // Remove the expense from cache
      queryClient.removeQueries({ queryKey: expenseKeys.detail(deletedId) });

      // Invalidate expenses list to refetch
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });

      // Invalidate dashboard data to update balance calculations
      queryClient.invalidateQueries({ queryKey: dashboardKeys.data() });
    },
    onError: (error) => {
      console.error('Failed to delete expense:', error);
    },
  });
}

/**
 * Hook to get recent expenses (convenience hook)
 */
export function useRecentExpenses(limit: number = 5) {
  return useExpenses({ limit });
}

/**
 * Hook to get expenses by user
 */
export function useExpensesByUser(userId: string) {
  return useExpenses({ paidBy: userId });
}

/**
 * Hook to get expenses by category
 */
export function useExpensesByCategory(category: string) {
  return useExpenses({ category });
}
