// React hooks for analytics data and chart functionality

import { useState, useEffect, useMemo } from 'react';
import type {
  AnalyticsFilters
} from '../types/analytics';
import { useExpenses, useSettlements } from './index';
import {
  processAdvancedMonthlyData,
  processAdvancedCategoryData,
  processUserComparisonData,
  processBalanceHistory,
  processTimePatternData,
  processCategoryTrends
} from '../lib/dataProcessing';

// Main analytics hook
export function useAnalytics(filters?: AnalyticsFilters) {
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses();
  const { data: settlements = [], isLoading: settlementsLoading } = useSettlements();

  const isLoading = expensesLoading || settlementsLoading;
  const error = expensesError;

  // Process analytics data
  const analyticsData = useMemo(() => {
    if (!expenses.length) return null;

    return {
      monthly: processAdvancedMonthlyData(expenses, filters),
      categories: processAdvancedCategoryData(expenses),
      userComparison: processUserComparisonData(expenses),
      balanceHistory: processBalanceHistory(expenses, settlements),
      timePatterns: processTimePatternData(expenses),
      categoryTrends: processCategoryTrends(expenses),
    };
  }, [expenses, settlements, filters]);

  return {
    data: analyticsData,
    isLoading,
    error,
    refetch: () => {
      // Trigger refetch of underlying data
    },
  };
}

// Monthly trends hook
export function useMonthlyTrends(filters?: AnalyticsFilters) {
  const { data: expenses = [], isLoading, error } = useExpenses();

  const monthlyData = useMemo(() => {
    return processAdvancedMonthlyData(expenses, filters);
  }, [expenses, filters]);

  return {
    data: monthlyData,
    isLoading,
    error,
  };
}

// Category analytics hook
export function useCategoryAnalytics(_compareWithPrevious: boolean = false) {
  const { data: expenses = [], isLoading, error } = useExpenses();

  const categoryData = useMemo(() => {
    return processAdvancedCategoryData(expenses);
  }, [expenses]);

  const categoryTrends = useMemo(() => {
    return processCategoryTrends(expenses);
  }, [expenses]);

  return {
    data: categoryData,
    trends: categoryTrends,
    isLoading,
    error,
  };
}

// User comparison hook
export function useUserComparison(granularity: 'month' | 'week' = 'month') {
  const { data: expenses = [], isLoading, error } = useExpenses();

  const comparisonData = useMemo(() => {
    return processUserComparisonData(expenses, granularity);
  }, [expenses, granularity]);

  return {
    data: comparisonData,
    isLoading,
    error,
  };
}

// Balance history hook
export function useBalanceHistory() {
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses();
  const { data: settlements = [], isLoading: settlementsLoading } = useSettlements();

  const isLoading = expensesLoading || settlementsLoading;
  const error = expensesError;

  const balanceData = useMemo(() => {
    return processBalanceHistory(expenses, settlements);
  }, [expenses, settlements]);

  return {
    data: balanceData,
    isLoading,
    error,
  };
}

// Chart data hook with caching and optimization
export function useChartData<T>(
  processor: (data: any[]) => T[],
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
  } = {}
) {
  const { enabled = true, refetchInterval, staleTime = 5 * 60 * 1000 } = options;

  const [cachedData, setCachedData] = useState<T[] | null>(null);
  const [lastProcessed, setLastProcessed] = useState<number>(0);

  const processedData = useMemo(() => {
    if (!enabled) return cachedData;

    const now = Date.now();
    if (cachedData && (now - lastProcessed) < staleTime) {
      return cachedData;
    }

    try {
      const result = processor(dependencies);
      setCachedData(result);
      setLastProcessed(now);
      return result;
    } catch (error) {
      console.error('Chart data processing error:', error);
      return cachedData || [];
    }
  }, [processor, dependencies, enabled, cachedData, lastProcessed, staleTime]);

  // Auto-refresh if refetchInterval is set
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      setLastProcessed(0); // Force reprocessing
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled]);

  return {
    data: processedData || [],
    isStale: cachedData && (Date.now() - lastProcessed) > staleTime,
    lastUpdated: new Date(lastProcessed),
  };
}

// Real-time chart updates hook
export function useRealtimeChartUpdates(_chartId: string) {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  // Listen for data changes that should trigger chart updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expense-data-updated') {
        triggerUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    updateTrigger,
    triggerUpdate,
  };
}

// Chart export hook
export function useChartExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportChart = async (
    chartElement: HTMLElement | null,
    options: {
      format: 'png' | 'svg' | 'pdf';
      filename: string;
      quality?: number;
    }
  ) => {
    if (!chartElement) {
      setExportError('Chart element not found');
      return false;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      // TODO: Implement actual export functionality
      // This would use libraries like html2canvas, jsPDF, etc.
      console.log('Exporting chart:', options);

      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportChart,
    isExporting,
    exportError,
  };
}

// Chart performance monitoring hook
export function useChartPerformance(_chartId: string) {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    dataProcessingTime: 0,
    lastRender: 0,
  });

  const startTiming = (operation: 'render' | 'dataProcessing') => {
    return {
      end: () => {
        const endTime = performance.now();
        setMetrics(prev => ({
          ...prev,
          [`${operation}Time`]: endTime - performance.now(),
          lastRender: operation === 'render' ? Date.now() : prev.lastRender,
        }));
      }
    };
  };

  return {
    metrics,
    startTiming,
  };
}
