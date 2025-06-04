// Chart theme configuration and styling utilities

import type { ChartTheme, ChartBreakpoints } from '../types/charts';

// Main chart theme
export const chartTheme: ChartTheme = {
  colors: {
    primary: [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
    ],
    secondary: [
      '#93C5FD', // Light Blue
      '#6EE7B7', // Light Green
      '#FCD34D', // Light Yellow
      '#FCA5A5', // Light Red
      '#C4B5FD', // Light Purple
      '#67E8F9', // Light Cyan
      '#FDBA74', // Light Orange
      '#BEF264', // Light Lime
    ],
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    neutral: [
      '#F9FAFB', // Gray 50
      '#F3F4F6', // Gray 100
      '#E5E7EB', // Gray 200
      '#D1D5DB', // Gray 300
      '#9CA3AF', // Gray 400
      '#6B7280', // Gray 500
      '#4B5563', // Gray 600
      '#374151', // Gray 700
      '#1F2937', // Gray 800
      '#111827', // Gray 900
    ],
  },
  fonts: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      small: 12,
      medium: 14,
      large: 16,
    },
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

// Responsive breakpoints for charts
export const chartBreakpoints: ChartBreakpoints = {
  mobile: {
    width: '100%',
    height: 250,
  },
  tablet: {
    width: '100%',
    height: 300,
  },
  desktop: {
    width: '100%',
    height: 400,
  },
};

// Chart-specific color schemes
export const chartColorSchemes = {
  categories: {
    Food: '#3B82F6',
    Groceries: '#10B981',
    Transportation: '#F59E0B',
    Utilities: '#EF4444',
    Entertainment: '#8B5CF6',
    Healthcare: '#06B6D4',
    Shopping: '#F97316',
    Travel: '#84CC16',
    Other: '#6B7280',
  },
  users: {
    taha: '#3B82F6',
    burak: '#10B981',
  },
  trends: {
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#6B7280',
  },
  balance: {
    positive: '#10B981',
    negative: '#EF4444',
    zero: '#6B7280',
  },
};

// Chart styling utilities
export const getChartColors = (count: number): string[] => {
  const colors = [...chartTheme.colors.primary];
  while (colors.length < count) {
    colors.push(...chartTheme.colors.secondary);
  }
  return colors.slice(0, count);
};

export const getCategoryColor = (category: string): string => {
  return chartColorSchemes.categories[category as keyof typeof chartColorSchemes.categories]
    || chartTheme.colors.neutral[5];
};

export const getUserColor = (userId: string): string => {
  return chartColorSchemes.users[userId as keyof typeof chartColorSchemes.users]
    || chartTheme.colors.primary[0];
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable'): string => {
  switch (trend) {
    case 'up':
      return chartColorSchemes.trends.positive;
    case 'down':
      return chartColorSchemes.trends.negative;
    default:
      return chartColorSchemes.trends.neutral;
  }
};

export const getBalanceColor = (balance: number): string => {
  if (balance > 0) return chartColorSchemes.balance.positive;
  if (balance < 0) return chartColorSchemes.balance.negative;
  return chartColorSchemes.balance.zero;
};

// Common chart configurations
export const commonChartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
    easing: 'easeInOutQuart',
  },
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
  },
  legend: {
    display: true,
    position: 'bottom' as const,
  },
};

// Responsive chart dimensions
export const getResponsiveDimensions = (
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  customHeight?: number
) => {
  const base = chartBreakpoints[breakpoint];
  return {
    width: base.width,
    height: customHeight || base.height,
  };
};

// Chart margin configurations
export const chartMargins = {
  default: { top: 20, right: 30, left: 20, bottom: 5 },
  withLegend: { top: 20, right: 30, left: 20, bottom: 60 },
  compact: { top: 10, right: 15, left: 10, bottom: 5 },
  detailed: { top: 30, right: 40, left: 40, bottom: 80 },
};

// Animation configurations
export const chartAnimations = {
  fast: { duration: 300, easing: 'ease-out' },
  normal: { duration: 750, easing: 'ease-in-out' },
  slow: { duration: 1200, easing: 'ease-in-out' },
  none: { duration: 0, easing: 'linear' },
};

// Grid and axis styling
export const gridStyles = {
  strokeDasharray: '3 3',
  stroke: chartTheme.colors.neutral[2],
  strokeWidth: 1,
};

export const axisStyles = {
  fontSize: chartTheme.fonts.sizes.small,
  fontFamily: chartTheme.fonts.family,
  fill: chartTheme.colors.neutral[6],
};

// Tooltip styling
export const tooltipStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: `1px solid ${chartTheme.colors.neutral[2]}`,
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  fontSize: chartTheme.fonts.sizes.small,
  fontFamily: chartTheme.fonts.family,
  padding: '12px',
};

// Legend styling
export const legendStyles = {
  fontSize: chartTheme.fonts.sizes.small,
  fontFamily: chartTheme.fonts.family,
  fill: chartTheme.colors.neutral[7],
};
