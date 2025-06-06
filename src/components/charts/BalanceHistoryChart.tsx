// Balance history chart component using Recharts

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BaseChart } from './BaseChart';
import { CustomTooltip } from './ChartContainer';
import { formatCurrency, formatChartDate } from '../../lib/chartUtils';
import { chartTheme, getBalanceColor } from '../../lib/chartTheme';
import type { BalanceHistoryChartProps } from '../../types/charts';

// Helper function to safely convert data
const safeToFixed = (value: any, decimals: number = 2): number => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return Number(Number(value).toFixed(decimals));
};

// Helper function to validate data item
const isValidDataItem = (item: any): boolean => {
  return item && 
         typeof item === 'object' && 
         item.date &&
         typeof item.balance !== 'undefined' &&
         typeof item.cumulativeExpenses !== 'undefined' &&
         typeof item.settlements !== 'undefined' &&
         typeof item.runningBalance !== 'undefined';
};

export function BalanceHistoryChart({
  data,
  height = 400,
  showSettlements = true,
  onPointClick,
}: BalanceHistoryChartProps) {
  // Early return if no data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <BaseChart
        title="Balance History"
        subtitle="Track balance changes over time"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-2">No balance data available</div>
            <div className="text-gray-400 text-sm">Add some expenses to see the balance history</div>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Filter and transform data for chart display with error handling
  const chartData = data
    .filter(isValidDataItem)
    .map(item => {
      try {
        return {
          ...item,
          date: formatChartDate(item.date, 'day'), // Convert to readable date format
          balance: safeToFixed(item.balance),
          cumulativeExpenses: safeToFixed(item.cumulativeExpenses),
          settlements: safeToFixed(item.settlements),
          runningBalance: safeToFixed(item.runningBalance),
        };
      } catch (error) {
        console.warn('Error processing chart data item:', error, item);
        return null;
      }
    })
    .filter(Boolean); // Remove any null items

  // If no valid data after filtering, show empty state
  if (chartData.length === 0) {
    return (
      <BaseChart
        title="Balance History"
        subtitle="Track balance changes over time"
        height={height}
        exportable={true}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-2">Invalid balance data</div>
            <div className="text-gray-400 text-sm">Please check your data format</div>
          </div>
        </div>
      </BaseChart>
    );
  }

  // Custom tooltip formatter
  const tooltipFormatter = (value: number, name: string) => {
    const formattedValue = formatCurrency(value);
    let displayName = name;

    switch (name) {
      case 'balance':
        displayName = 'Balance';
        break;
      case 'cumulativeExpenses':
        displayName = 'Total Expenses';
        break;
      case 'settlements':
        displayName = 'Settlements';
        break;
      case 'runningBalance':
        displayName = 'Running Balance';
        break;
    }

    return [formattedValue, displayName];
  };

  // Custom label formatter for tooltip
  const labelFormatter = (label: string) => {
    return `Date: ${label}`;
  };

  // Handle point clicks
  const handleClick = (data: any) => {
    if (onPointClick) {
      onPointClick(data);
    }
  };

  // Calculate current balance status
  const currentBalance = chartData[chartData.length - 1]?.runningBalance || 0;
  const balanceStatus = currentBalance > 0 ? 'Taha owes Burak' :
                      currentBalance < 0 ? 'Burak owes Taha' :
                      'Balanced';

  return (
    <BaseChart
      title="Balance History"
      subtitle="Track balance changes over time"
      height={height}
      exportable={true}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            dataKey="date"
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
            content={<CustomTooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />}
          />
          <Legend
            wrapperStyle={{
              fontSize: chartTheme.fonts.sizes.small,
              fontFamily: chartTheme.fonts.family,
              paddingTop: '20px'
            }}
          />

          {/* Zero line reference */}
          <ReferenceLine
            y={0}
            stroke={chartTheme.colors.neutral[4]}
            strokeDasharray="2 2"
            strokeWidth={2}
          />

          {/* Running balance area */}
          <Area
            type="monotone"
            dataKey="runningBalance"
            stroke={getBalanceColor(currentBalance)}
            fill={getBalanceColor(currentBalance)}
            fillOpacity={0.3}
            strokeWidth={3}
            name="Running Balance"
            dot={{ fill: getBalanceColor(currentBalance), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: getBalanceColor(currentBalance), strokeWidth: 2 }}
          />

          {/* Settlements line if enabled */}
          {showSettlements && (
            <Area
              type="monotone"
              dataKey="settlements"
              stroke={chartTheme.colors.primary[2]}
              fill={chartTheme.colors.primary[2]}
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Settlements"
              dot={{ fill: chartTheme.colors.primary[2], strokeWidth: 2, r: 3 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Balance Status Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className={`rounded-lg p-3 ${
          currentBalance > 0 ? 'bg-red-50' :
          currentBalance < 0 ? 'bg-green-50' :
          'bg-gray-50'
        }`}>
          <div className={`text-sm ${
            currentBalance > 0 ? 'text-red-600' :
            currentBalance < 0 ? 'text-green-600' :
            'text-gray-500'
          }`}>
            Current Status
          </div>
          <div className={`text-lg font-semibold ${
            currentBalance > 0 ? 'text-red-900' :
            currentBalance < 0 ? 'text-green-900' :
            'text-gray-900'
          }`}>
            {balanceStatus}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm text-blue-600">Current Balance</div>
          <div className="text-lg font-semibold text-blue-900">
            {formatCurrency(Math.abs(currentBalance))}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-sm text-purple-600">Total Expenses</div>
          <div className="text-lg font-semibold text-purple-900">
            {formatCurrency(chartData[chartData.length - 1]?.cumulativeExpenses || 0)}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-sm text-orange-600">Total Settlements</div>
          <div className="text-lg font-semibold text-orange-900">
            {formatCurrency(chartData[chartData.length - 1]?.settlements || 0)}
          </div>
        </div>
      </div>
    </BaseChart>
  );
}

export default BalanceHistoryChart;
