// Base chart wrapper component with common functionality

import { useState } from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import type { BaseChartProps } from '../../types/charts';

export function BaseChart({
  title,
  subtitle,
  loading = false,
  error,
  height = 400,
  responsive = true,
  exportable = false,
  className = '',
  children,
}: BaseChartProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportable) return;
    
    setIsExporting(true);
    try {
      // TODO: Implement export functionality
      console.log('Exporting chart:', title);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate export
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing chart:', title);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Chart Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Refresh chart"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          {exportable && (
            <button
              onClick={handleExport}
              disabled={isExporting || loading || !!error}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export chart"
            >
              <Download className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div 
        className="p-4"
        style={{ 
          height: responsive ? 'auto' : height,
          minHeight: responsive ? height : 'auto'
        }}
      >
        {loading ? (
          <ChartLoadingState height={height} />
        ) : error ? (
          <ChartErrorState error={error} onRetry={handleRefresh} />
        ) : (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading state component
function ChartLoadingState({ height }: { height: number }) {
  return (
    <div 
      className="flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-sm text-gray-500">Loading chart data...</p>
      </div>
    </div>
  );
}

// Error state component
function ChartErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="text-center max-w-sm">
        <div className="h-12 w-12 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Failed to load chart
        </h4>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
}

export default BaseChart;
