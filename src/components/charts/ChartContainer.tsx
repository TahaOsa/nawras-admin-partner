// Responsive chart container with automatic sizing

import { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import type { ChartContainerProps } from '../../types/charts';
import { chartBreakpoints } from '../../lib/chartTheme';
import { calculateChartDimensions } from '../../lib/chartUtils';

export function ChartContainer({
  minHeight = 200,
  aspectRatio = 16/9,
  breakpoints = chartBreakpoints,
  className = '',
  children,
}: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Update dimensions and breakpoint on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // Determine breakpoint
      let currentBreakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (containerWidth < 640) {
        currentBreakpoint = 'mobile';
      } else if (containerWidth < 1024) {
        currentBreakpoint = 'tablet';
      }

      setBreakpoint(currentBreakpoint);

      // Calculate dimensions
      const newDimensions = calculateChartDimensions(
        containerWidth,
        aspectRatio,
        minHeight,
        typeof breakpoints[currentBreakpoint].height === 'number'
          ? breakpoints[currentBreakpoint].height as number
          : 400
      );

      setDimensions(newDimensions);
    };

    // Initial calculation
    updateDimensions();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [aspectRatio, minHeight, breakpoints]);

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{
        minHeight,
        height: dimensions.height || minHeight
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <div className="w-full h-full">
          {children}
        </div>
      </ResponsiveContainer>
    </div>
  );
}

// Hook for responsive chart behavior
export function useResponsiveChart() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  const breakpoint: 'mobile' | 'tablet' | 'desktop' =
    isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}

// Custom tooltip component for charts
export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter
}: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      {label && (
        <p className="text-sm font-medium text-gray-900 mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {formatter ? formatter(entry.value, entry.name)[0] : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Custom legend component for charts
export function CustomLegend({ payload }: any) {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default ChartContainer;
