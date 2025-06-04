// Monthly trends chart component using Recharts

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatChartDate } from '../../lib/chartUtils';
import { chartTheme, getUserColor } from '../../lib/chartTheme';
import type { MonthlyTrendsChartProps } from '../../types/charts';

export function MonthlyTrendsChart({
  data,
  height = 400,
  showComparison = true,
  onDataPointClick,
}: MonthlyTrendsChartProps) {
  // Transform data for chart display
  const chartData = data.map(item => ({
    ...item,
    month: formatChartDate(item.month + '-01', 'month'), // Convert "2024-01" to "Jan 2024"
    totalExpenses: Number(item.totalExpenses.toFixed(2)),
    tahaExpenses: Number(item.tahaExpenses.toFixed(2)),
    burakExpenses: Number(item.burakExpenses.toFixed(2)),
  }));

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string) => {
    const formattedValue = formatCurrency(value);
    const displayName = name === 'totalExpenses' ? 'Total' :
                       name === 'tahaExpenses' ? 'Taha' :
                       name === 'burakExpenses' ? 'Burak' : name;
    return [formattedValue, displayName];
  };

  // Handle data point clicks
  const handleClick = (data: any) => {
    if (onDataPointClick) {
      onDataPointClick(data);
    }
  };

  return (
    <BaseChart
      title="Monthly Expense Trends"
      subtitle="Track spending patterns over time"
      height={height}
      exportable={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="month"
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
            tickFormatter={(value) => formatCurrency(value)}
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

          {/* Total expenses line */}
          <Line
            type="monotone"
            dataKey="totalExpenses"
            stroke={chartTheme.colors.primary[0]}
            strokeWidth={3}
            dot={{ fill: chartTheme.colors.primary[0], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: chartTheme.colors.primary[0], strokeWidth: 2 }}
            name="Total Expenses"
          />

          {/* Individual user lines if comparison is enabled */}
          {showComparison && (
            <>
              <Line
                type="monotone"
                dataKey="tahaExpenses"
                stroke={getUserColor('taha')}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: getUserColor('taha'), strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: getUserColor('taha'), strokeWidth: 2 }}
                name="Taha's Expenses"
              />
              <Line
                type="monotone"
                dataKey="burakExpenses"
                stroke={getUserColor('burak')}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: getUserColor('burak'), strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: getUserColor('burak'), strokeWidth: 2 }}
                name="Burak's Expenses"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </BaseChart>
  );
}

export default MonthlyTrendsChart;
