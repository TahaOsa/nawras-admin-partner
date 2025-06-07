// User comparison chart component using Recharts

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatChartDate } from '../../lib/chartUtils';
import { chartTheme, getUserColor } from '../../lib/chartTheme';
import type { UserComparisonChartProps } from '../../types/charts';

// Helper function to safely convert to number
function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function UserComparisonChart({
  data,
  height = 400,
  showDifference = true,
  stackedView = false,
  onBarClick,
}: UserComparisonChartProps) {
  // Validate and sanitize input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <BaseChart
        title="User Spending Comparison"
        subtitle="Compare expenses between Taha and Burak"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500 text-sm">No comparison data available</p>
            <p className="text-gray-400 text-xs">Add expenses to compare users</p>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Transform data for chart display with proper validation
  const chartData = data
    .filter(item => item && item.period) // Filter out invalid items
    .map(item => {
      const taha = safeNumber(item.taha);
      const burak = safeNumber(item.burak);
      const difference = safeNumber(item.difference, taha - burak);
      
      return {
        ...item,
        period: formatChartDate(item.period + '-01', 'month'), // Convert "2024-01" to "Jan 2024"
        taha,
        burak,
        difference,
        absDifference: Math.abs(difference),
      };
    });

  // If no valid data after filtering, show empty state
  if (chartData.length === 0) {
    return (
      <BaseChart
        title="User Spending Comparison"
        subtitle="Compare expenses between Taha and Burak"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500 text-sm">No valid comparison data</p>
            <p className="text-gray-400 text-xs">Check your date formatting</p>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string) => {
    const formattedValue = formatCurrency(safeNumber(value));
    let displayName = name;

    switch (name) {
      case 'taha':
        displayName = 'Taha';
        break;
      case 'burak':
        displayName = 'Burak';
        break;
      case 'difference':
        displayName = 'Difference';
        break;
      case 'absDifference':
        displayName = 'Difference';
        break;
    }

    return [formattedValue, displayName];
  };

  // Handle bar clicks
  const handleClick = (data: any) => {
    if (onBarClick) {
      onBarClick(data);
    }
  };

  // Calculate safe totals
  const tahaTotal = chartData.reduce((sum, item) => sum + safeNumber(item.taha), 0);
  const burakTotal = chartData.reduce((sum, item) => sum + safeNumber(item.burak), 0);
  const netDifference = chartData.reduce((sum, item) => sum + safeNumber(item.difference), 0);

  return (
    <BaseChart
      title="User Spending Comparison"
      subtitle="Compare expenses between Taha and Burak"
      height={height}
      exportable={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          onClick={handleClick}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartTheme.colors.neutral[2]}
            strokeWidth={1}
          />
          <XAxis
            dataKey="period"
            fontSize={chartTheme.fonts.sizes.small}
            fontFamily={chartTheme.fonts.family}
            fill={chartTheme.colors.neutral[6]}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            fontSize={chartTheme.fonts.sizes.small}
            fontFamily={chartTheme.fonts.family}
            fill={chartTheme.colors.neutral[6]}
            tickFormatter={(value) => formatCurrency(safeNumber(value))}
          />
          <Tooltip
            content={<CustomTooltip formatter={tooltipFormatter} />}
          />
          <Legend
            wrapperStyle={{
              fontSize: chartTheme.fonts.sizes.small,
              fontFamily: chartTheme.fonts.family,
              paddingTop: '20px'
            }}
          />

          {/* User spending bars */}
          <Bar
            dataKey="taha"
            fill={getUserColor('taha')}
            name="Taha"
            radius={[2, 2, 0, 0]}
            stackId={stackedView ? 'stack' : undefined}
          />
          <Bar
            dataKey="burak"
            fill={getUserColor('burak')}
            name="Burak"
            radius={[2, 2, 0, 0]}
            stackId={stackedView ? 'stack' : undefined}
          />

          {/* Difference bar if enabled */}
          {showDifference && !stackedView && (
            <Bar
              dataKey="absDifference"
              fill={chartTheme.colors.neutral[4]}
              name="Difference"
              radius={[2, 2, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* Summary statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600">Taha Total</div>
          <div className="text-lg font-semibold text-blue-900">
            {formatCurrency(tahaTotal)}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-600">Burak Total</div>
          <div className="text-lg font-semibold text-green-900">
            {formatCurrency(burakTotal)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Net Difference</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(netDifference)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Periods</div>
          <div className="text-lg font-semibold text-gray-900">
            {chartData.length}
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default UserComparisonChart;
