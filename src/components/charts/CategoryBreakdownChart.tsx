// Category breakdown chart component using Recharts

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatPercentage } from '../../lib/chartUtils';
import { chartTheme } from '../../lib/chartTheme';
import type { CategoryBreakdownChartProps } from '../../types/charts';

// Helper function to safely convert to number
function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function CategoryBreakdownChart({
  data,
  height = 400,
  showPercentages = true,
  innerRadius = 60,
  outerRadius = 120,
  onSliceClick,
}: CategoryBreakdownChartProps) {
  // Validate and sanitize input data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <BaseChart
        title="Expense Categories"
        subtitle="Breakdown of spending by category"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">🥧</div>
            <p className="text-gray-500 text-sm">No categories available</p>
            <p className="text-gray-400 text-xs">Add some expenses to see breakdown</p>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Transform data for chart display with proper validation
  const chartData = data
    .filter(item => item && item.category && safeNumber(item.amount) > 0) // Filter out invalid items
    .map(item => ({
      ...item,
      amount: safeNumber(item.amount),
      percentage: safeNumber(item.percentage),
      category: item.category || 'Unknown',
      color: item.color || chartTheme.colors.primary[0],
    }));

  // If no valid data after filtering, show empty state
  if (chartData.length === 0) {
    return (
      <BaseChart
        title="Expense Categories"
        subtitle="Breakdown of spending by category"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">🥧</div>
            <p className="text-gray-500 text-sm">No valid categories</p>
            <p className="text-gray-400 text-xs">Check your expense data</p>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string, props: any) => {
    if (name === 'amount') {
      return [
        formatCurrency(safeNumber(value)),
        `${props.payload.category} (${formatPercentage(safeNumber(props.payload.percentage))})`
      ];
    }
    return [value, name];
  };

  // Custom label formatter for pie slices
  const renderLabel = (entry: any) => {
    if (!showPercentages) return '';
    const percentage = safeNumber(entry.percentage);
    return percentage > 5 ? `${percentage.toFixed(1)}%` : '';
  };

  // Handle slice clicks
  const handleClick = (data: any) => {
    if (onSliceClick) {
      onSliceClick(data);
    }
  };

  // Custom legend formatter
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700">
              {entry.value} ({formatCurrency(safeNumber(chartData[index]?.amount))})
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Calculate safe totals
  const totalAmount = chartData.reduce((sum, item) => sum + safeNumber(item.amount), 0);
  const avgAmount = chartData.length > 0 ? totalAmount / chartData.length : 0;

  return (
    <BaseChart
      title="Expense Categories"
      subtitle="Breakdown of spending by category"
      height={height}
      exportable={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="amount"
            onClick={handleClick}
            style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={chartTheme.colors.neutral[1]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatter={tooltipFormatter} />}
          />
          <Legend
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Categories</div>
          <div className="text-lg font-semibold text-gray-900">
            {chartData.length}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Total Amount</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(totalAmount)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Top Category</div>
          <div className="text-lg font-semibold text-gray-900">
            {chartData[0]?.category || 'None'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500">Avg per Category</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(avgAmount)}
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default CategoryBreakdownChart;
