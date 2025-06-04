// Category breakdown chart component using Recharts

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatPercentage } from '../../lib/chartUtils';
import { chartTheme } from '../../lib/chartTheme';
import type { CategoryBreakdownChartProps } from '../../types/charts';

export function CategoryBreakdownChart({
  data,
  height = 400,
  showPercentages = true,
  innerRadius = 60,
  outerRadius = 120,
  onSliceClick,
}: CategoryBreakdownChartProps) {
  // Transform data for chart display
  const chartData = data.map(item => ({
    ...item,
    amount: Number(item.amount.toFixed(2)),
    percentage: Number(item.percentage.toFixed(1)),
  }));

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string, props: any) => {
    if (name === 'amount') {
      return [
        formatCurrency(value),
        `${props.payload.category} (${formatPercentage(props.payload.percentage)})`
      ];
    }
    return [value, name];
  };

  // Custom label formatter for pie slices
  const renderLabel = (entry: any) => {
    if (!showPercentages) return '';
    return entry.percentage > 5 ? `${entry.percentage.toFixed(1)}%` : '';
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
              {entry.value} ({formatCurrency(chartData[index]?.amount || 0)})
            </span>
          </div>
        ))}
      </div>
    );
  };

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
            {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0))}
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
            {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length || 0)}
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default CategoryBreakdownChart;
