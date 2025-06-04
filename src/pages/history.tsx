import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Download, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { useExpenses, useSettlements } from '../hooks';
import { formatCurrency } from '../lib';
import { ExpenseFiltersComponent } from '../components';
import type { ExpenseFilters } from '../types';


type FilterType = 'all' | 'expense' | 'settlement';

interface HistoryItem {
  id: string;
  type: 'expense' | 'settlement';
  date: string;
  amount: number;
  description: string;
  paidBy?: string;
  paidTo?: string;
  category?: string;
  createdAt: string;
}

const HistoryPage: React.FC = () => {
  // Enhanced filter state
  const [expenseFilters, setExpenseFilters] = useState<ExpenseFilters>({
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Legacy filter state for settlements
  const [filterType, setFilterType] = useState<FilterType>('all');

  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(expenseFilters);
  const { data: settlements = [], isLoading: settlementsLoading } = useSettlements();

  // Combine and transform data
  const historyItems = useMemo((): HistoryItem[] => {
    const expenseItems: HistoryItem[] = expenses.map(expense => ({
      id: `expense-${expense.id}`,
      type: 'expense' as const,
      date: expense.date,
      amount: expense.amount,
      description: expense.description,
      paidBy: expense.paidById,
      category: expense.category,
      createdAt: expense.createdAt,
    }));

    const settlementItems: HistoryItem[] = settlements.map(settlement => ({
      id: `settlement-${settlement.id}`,
      type: 'settlement' as const,
      date: settlement.date,
      amount: settlement.amount,
      description: settlement.description || 'Settlement payment',
      paidBy: settlement.paidBy,
      paidTo: settlement.paidTo,
      createdAt: settlement.createdAt,
    }));

    return [...expenseItems, ...settlementItems];
  }, [expenses, settlements]);

  // Filter and sort items (settlements are filtered client-side, expenses server-side)
  const filteredAndSortedItems = useMemo(() => {
    let filtered = historyItems;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Sort items (expenses are already sorted by server, but we need to sort combined list)
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (expenseFilters.sortBy || 'date') {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        case 'paidBy':
          comparison = (a.paidBy || '').localeCompare(b.paidBy || '');
          break;
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }

      return (expenseFilters.sortOrder || 'desc') === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [historyItems, filterType, expenseFilters.sortBy, expenseFilters.sortOrder]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSettlements = settlements.reduce((sum, set) => sum + set.amount, 0);
    const expenseCount = expenses.length;
    const settlementCount = settlements.length;

    return {
      totalExpenses,
      totalSettlements,
      expenseCount,
      settlementCount,
      totalTransactions: expenseCount + settlementCount,
    };
  }, [expenses, settlements]);

  const isLoading = expensesLoading || settlementsLoading;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Transaction History
          </h1>

          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
                <p className="text-2xl font-bold text-red-600">
                  {isLoading ? '...' : formatCurrency(summaryStats.totalExpenses)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {summaryStats.expenseCount} transaction{summaryStats.expenseCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Settlements</h3>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : formatCurrency(summaryStats.totalSettlements)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {summaryStats.settlementCount} payment{summaryStats.settlementCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Net Activity</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {isLoading ? '...' : formatCurrency(summaryStats.totalExpenses - summaryStats.totalSettlements)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Outstanding balance</p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Transactions</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : summaryStats.totalTransactions}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <ExpenseFiltersComponent
          filters={expenseFilters}
          onFiltersChange={setExpenseFilters}
          onClearFilters={() => setExpenseFilters({
            sortBy: 'date',
            sortOrder: 'desc'
          })}
          showAdvanced={true}
          className="mb-6"
        />

        {/* Transaction Type Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Show:</span>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Transactions</option>
                <option value="expense">Expenses Only</option>
                <option value="settlement">Settlements Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No transactions found</p>
              <p className="text-gray-400 text-sm">
                {expenseFilters.search ? 'Try adjusting your search or filters' : 'Start by adding some expenses or settlements'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'expense'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type === 'expense' ? (
                            <>
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Expense
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Settlement
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.description}</div>
                        {item.category && (
                          <div className="text-sm text-gray-500">{item.category}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          item.type === 'expense' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(item.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.type === 'expense' ? (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.paidBy === 'taha'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {item.paidBy === 'taha' ? 'Taha' : 'Burak'}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.paidBy === 'taha'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {item.paidBy === 'taha' ? 'Taha' : 'Burak'}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.paidTo === 'taha'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {item.paidTo === 'taha' ? 'Taha' : 'Burak'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && filteredAndSortedItems.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredAndSortedItems.length} of {historyItems.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
