// Chart component types and configurations

import type { ReactNode } from 'react';

export interface ChartBreakpoints {
  mobile: {
    width: string | number;
    height: number;
  };
  tablet: {
    width: string | number;
    height: number;
  };
  desktop: {
    width: string | number;
    height: number;
  };
}

export interface ChartTheme {
  colors: {
    primary: string[];
    secondary: string[];
    success: string;
    warning: string;
    error: string;
    neutral: string[];
  };
  fonts: {
    family: string;
    sizes: {
      small: number;
      medium: number;
      large: number;
    };
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface BaseChartProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  height?: number;
  responsive?: boolean;
  exportable?: boolean;
  className?: string;
  children: ReactNode;
}

export interface ChartContainerProps {
  minHeight?: number;
  aspectRatio?: number;
  breakpoints?: ChartBreakpoints;
  className?: string;
  children: ReactNode;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
}

export interface ChartLegendProps {
  payload?: any[];
  iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Specific chart component props
export interface MonthlyTrendsChartProps {
  data: any[];
  height?: number;
  showTrend?: boolean;
  showComparison?: boolean;
  onDataPointClick?: (data: any) => void;
}

export interface CategoryBreakdownChartProps {
  data: any[];
  height?: number;
  showPercentages?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  onSliceClick?: (data: any) => void;
}

export interface UserComparisonChartProps {
  data: any[];
  height?: number;
  showDifference?: boolean;
  stackedView?: boolean;
  onBarClick?: (data: any) => void;
}

export interface BalanceHistoryChartProps {
  data: any[];
  height?: number;
  showSettlements?: boolean;
  showProjection?: boolean;
  onPointClick?: (data: any) => void;
}

export interface TopCategoriesChartProps {
  data: any[];
  height?: number;
  maxCategories?: number;
  showTrends?: boolean;
  onCategoryClick?: (data: any) => void;
}

// Chart configuration types
export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  animation: {
    duration: number;
    easing: string;
  };
  tooltip: {
    enabled: boolean;
    shared: boolean;
    intersect: boolean;
  };
  legend: {
    display: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}

// Export configuration
export interface ChartExportConfig {
  format: 'png' | 'svg' | 'pdf';
  quality: number;
  width: number;
  height: number;
  backgroundColor: string;
  filename: string;
}

// Chart data processing types
export interface DataProcessor<T, R> {
  process: (data: T[]) => R[];
  validate: (data: T[]) => boolean;
  transform?: (item: T) => R;
}

export interface ChartDataValidation {
  required: string[];
  types: Record<string, 'string' | 'number' | 'boolean' | 'date'>;
  ranges?: Record<string, { min?: number; max?: number }>;
}

// Chart state management
export interface ChartState {
  loading: boolean;
  error: string | null;
  data: any[];
  filters: any;
  selectedDataPoint: any | null;
  zoomLevel: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface ChartAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'SET_DATA' | 'SET_FILTERS' | 'SELECT_DATA_POINT' | 'ZOOM' | 'SET_TIME_RANGE';
  payload?: any;
}

// Responsive chart utilities
export interface ResponsiveChartHook {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}
