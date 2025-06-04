// Top categories horizontal bar chart component using Recharts

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatPercentage } from '../../lib/chartUtils';
import { chartTheme, getCategoryColor } from '../../lib/chartTheme';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TopCategoriesChartProps } from '../../types/charts';

export function TopCategoriesChart({
  data,
  height = 400,
  maxCategories = 5,
  showTrends = true,
  onCategoryClick,
}: TopCategoriesChartProps) {
  // Limit and transform data for chart display
  const chartData = data
    .slice(0, maxCategories)
    .map(item => ({
      ...item,
      amount: Number(item.amount.toFixed(2)),
      percentage: Number(item.percentage.toFixed(1)),
      avgAmount: Number(item.avgAmount.toFixed(2)),
    }));

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, _name: string, props: any) => {
    const formattedValue = formatCurrency(value);
    const category = props.payload;

    return [
      formattedValue,
      `${category.category} (${formatPercentage(category.percentage)})`
    ];
  };

  // Handle category clicks
  const handleClick = (data: any) => {
    if (onCategoryClick) {
      onCategoryClick(data);
    }
  };

  // Render trend icon
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <BaseChart
      title={`Top ${maxCategories} Categories`}
      subtitle="Highest spending categories"
      height={height}
      exportable={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          onClick={handleClick}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartTheme.colors.neutral[2]}
            strokeWidth={1}
          />
          <XAxis
            type="number"
            fontSize={chartTheme.fonts.sizes.small}
            fontFamily={chartTheme.fonts.family}
            fill={chartTheme.colors.neutral[6]}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis
            type="category"
            dataKey="category"
            fontSize={chartTheme.fonts.sizes.small}
            fontFamily={chartTheme.fonts.family}
            fill={chartTheme.colors.neutral[6]}
            width={70}
          />
          <Tooltip
            content={<CustomTooltip formatter={tooltipFormatter} />}
          />

          <Bar
            dataKey="amount"
            radius={[0, 4, 4, 0]}
            name="Amount"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getCategoryColor(entry.category)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Category Details */}
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h4>
        {chartData.map((category) => (
          <div
            key={category.category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => handleClick(category)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category.category) }}
                />
                <span className="font-medium text-gray-900">
                  {category.category}
                </span>
              </div>
              {showTrends && (
                <div className="flex items-center gap-1">
                  {renderTrendIcon(category.trend || 'stable')}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(category.amount)}
                </div>
                <div className="text-gray-500">
                  {formatPercentage(category.percentage)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-600">
                  {category.count} expense{category.count !== 1 ? 's' : ''}
                </div>
                <div className="text-gray-500">
                  Avg: {formatCurrency(category.avgAmount)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600">Top Category</div>
          <div className="text-lg font-semibold text-blue-900">
            {chartData[0]?.category || 'None'}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm text-green-600">Total Amount</div>
          <div className="text-lg font-semibold text-green-900">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0))}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-sm text-purple-600">Categories</div>
          <div className="text-lg font-semibold text-purple-900">
            {chartData.length}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-sm text-orange-600">Avg per Category</div>
          <div className="text-lg font-semibold text-orange-900">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length || 0)}
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default TopCategoriesChart;
