import React from 'react';
import { Link } from 'wouter';
import { useExpenses } from '../../hooks/useExpenses';
import { Calendar, DollarSign, User, ArrowRight, Plus } from 'lucide-react';

interface ExpenseItemProps {
  expense: {
    id: number;
    description: string;
    amount: number;
    category: string;
    paidById: string;
    date: string;
  };
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getUserName = (userId: string) => {
    return userId === 'taha' ? 'Taha' : userId === 'burak' ? 'Burak' : userId;
  };

  const getUserColor = (userId: string) => {
    return userId === 'taha' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50';
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg group">
      <div className="flex items-center space-x-4 flex-1">
        <div className={`p-2 rounded-full ${getUserColor(expense.paidById)}`}>
          <User className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900 truncate">{expense.description}</p>
            <p className="font-semibold text-gray-900 ml-4">${expense.amount.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(expense.date)}</span>
            </span>
            
            <span className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>{expense.category}</span>
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserColor(expense.paidById)}`}>
              {getUserName(expense.paidById)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentExpenses: React.FC = () => {
  const { data: expenses = [], isLoading } = useExpenses();

  // Get the 5 most recent expenses
  const recentExpenses = React.useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <div className="flex items-center space-x-2">
            <Link href="/add-expense">
              <a className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </a>
            </Link>
            <Link href="/history">
              <a className="inline-flex items-center px-3 py-1.5 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-900 mb-1">No expenses yet</p>
            <p className="text-gray-500 mb-4">Start tracking your expenses by adding your first one</p>
            <Link href="/add-expense">
              <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Expense
              </a>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} />
            ))}
            
            {expenses.length > 5 && (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <Link href="/history">
                  <a className="flex items-center justify-center w-full py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View {expenses.length - 5} more expenses
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
