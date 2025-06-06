import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpenses } from '../../hooks/useExpenses';

// Interface for chart data structure
// interface ChartData {
//   month: string;
//   taha: number;
//   burak: number;
//   total: number;
// }

export const ExpenseChart: React.FC = () => {
  const { data: expenses = [], isLoading } = useExpenses();

  const chartData = useMemo(() => {
    if (!expenses.length) return [];

    // Group expenses by month
    const monthlyData: { [key: string]: { taha: number; burak: number } } = {};

    expenses.forEach(expense => {
      try {
        const date = new Date(expense.date);
        if (isNaN(date.getTime())) {
          return; // Skip invalid dates
        }
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { taha: 0, burak: 0 };
        }

        if (expense.paidById === 'taha') {
          monthlyData[monthKey].taha += expense.amount;
        } else if (expense.paidById === 'burak') {
          monthlyData[monthKey].burak += expense.amount;
        }
      } catch (error) {
        // Skip expenses with invalid date formats
        return;
      }
    });

    // Convert to chart format and sort by date
    return Object.entries(monthlyData)
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        return {
          month: monthName,
          monthKey: monthKey, // Keep the original key for sorting
          taha: Math.round(data.taha * 100) / 100,
          burak: Math.round(data.burak * 100) / 100,
          total: Math.round((data.taha + data.burak) * 100) / 100,
        };
      })
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trends</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">No expense data available</p>
            <p className="text-sm">Add some expenses to see the chart</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
          <p className="text-sm text-gray-600 mt-1 pt-1 border-t">
            Total: ${payload.reduce((sum: number, entry: any) => sum + entry.value, 0).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Expense Trends</h3>
        <div className="text-sm text-gray-500">
          Last {chartData.length} month{chartData.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="taha" 
              name="Taha" 
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="burak" 
              name="Burak" 
              fill="#10b981" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
