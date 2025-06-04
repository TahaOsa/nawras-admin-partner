import React, { useMemo } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { ShoppingCart, Car, Home, Coffee, Zap, MoreHorizontal } from 'lucide-react';

// Interface for category data structure
// interface CategoryData {
//   name: string;
//   amount: number;
//   percentage: number;
//   icon: React.ReactNode;
//   color: string;
// }

const categoryIcons: { [key: string]: { icon: React.ReactNode; color: string } } = {
  'Food': { icon: <Coffee className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
  'Transportation': { icon: <Car className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
  'Utilities': { icon: <Zap className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-600' },
  'Shopping': { icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' },
  'Housing': { icon: <Home className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
  'Other': { icon: <MoreHorizontal className="h-5 w-5" />, color: 'bg-gray-100 text-gray-600' },
};

export const CategoryBreakdown: React.FC = () => {
  const { data: expenses = [], isLoading } = useExpenses();

  const categoryData = useMemo(() => {
    if (!expenses.length) return [];

    // Group expenses by category
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });

    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    // Convert to array and calculate percentages
    return Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        icon: categoryIcons[name]?.icon || categoryIcons['Other'].icon,
        color: categoryIcons[name]?.color || categoryIcons['Other'].color,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Show top 6 categories
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categoryData.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-500">
          <Coffee className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg mb-1">No expenses yet</p>
          <p className="text-sm">Add expenses to see category breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
        <div className="text-sm text-gray-500">
          {categoryData.length} categories
        </div>
      </div>

      <div className="space-y-4">
        {categoryData.map((category) => (
          <div key={category.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {expenses.filter(e => (e.category || 'Other') === category.name).length} transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${category.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  category.color.includes('orange') ? 'bg-orange-500' :
                  category.color.includes('blue') ? 'bg-blue-500' :
                  category.color.includes('yellow') ? 'bg-yellow-500' :
                  category.color.includes('purple') ? 'bg-purple-500' :
                  category.color.includes('green') ? 'bg-green-500' :
                  'bg-gray-500'
                }`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Spending</span>
          <span className="font-semibold text-gray-900">
            ${categoryData.reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
