// Dashboard homepage component
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Calendar, TrendingUp, Edit2, Trash2 } from 'lucide-react';

import { useExpenses } from '../hooks';
import { formatCurrency } from '../lib';
import { EditExpenseModal, DeleteExpenseModal, QuickSearch, DashboardCharts } from '../components';
import { BalanceSummary } from '../features/dashboard';
import type { Expense, ExpenseFilters } from '../types';

const HomePage: React.FC = () => {
  // Filter state for recent expenses
  const [recentExpensesFilters, setRecentExpensesFilters] = useState<ExpenseFilters>({
    limit: 4,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch filtered expenses for recent expenses display
  const { data: recentExpenses = [], isLoading: recentExpensesLoading, error: recentExpensesError } = useExpenses(recentExpensesFilters);
  
  // Also fetch all expenses for the expenses count display
  const { data: allExpenses = [] } = useExpenses();

  // Modal states
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Combined loading and error states
  const isLoading = recentExpensesLoading;
  const error = recentExpensesError;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your expense overview.
            </p>
          </div>
          <Link href="/add-expense">
            <a className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </a>
          </Link>
        </div>

        {/* Balance Summary Cards */}
        <BalanceSummary />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Expenses */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
              <Link href="/history">
                <a className="text-sm text-blue-600 hover:text-blue-700">View all</a>
              </Link>
            </div>

            {/* Quick Search for Recent Expenses */}
            <div className="mb-4">
              <QuickSearch
                filters={recentExpensesFilters}
                onFiltersChange={setRecentExpensesFilters}
                onClearFilters={() => setRecentExpensesFilters({
                  limit: 4,
                  sortBy: 'date',
                  sortOrder: 'desc'
                })}
                placeholder="Search recent expenses..."
                showQuickFilters={true}
              />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-red-500 text-xl">⚠️</span>
                  </div>
                  <p className="text-red-600 mb-3">Failed to load expenses</p>
                  <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
              ) : recentExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-3">No expenses found</p>
                  <Link href="/add-expense">
                    <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Add your first expense
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            expense.paidById === 'taha'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {expense.paidById === 'taha' ? 'Taha' : 'Burak'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {expense.category} • {(() => {
                            try {
                              const date = new Date(expense.date);
                              return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                              });
                            } catch (error) {
                              return 'Invalid Date';
                            }
                          })()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingExpense(expense)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit expense"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingExpense(expense)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {allExpenses.length > recentExpenses.length && (
                    <div className="text-center pt-2">
                      <Link href="/history">
                        <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View {allExpenses.length - recentExpenses.length} more expenses
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/add-expense">
                <a className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Add Expense</span>
                </a>
              </Link>
              <Link href="/settlement">
                <a className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Calendar className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Settle Balance</span>
                </a>
              </Link>
              <Link href="/reports">
                <a className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">View Reports</span>
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <DashboardCharts />
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            // Expense list will automatically refresh due to React Query
            setEditingExpense(null);
          }}
        />
      )}

      {/* Delete Expense Modal */}
      {deletingExpense && (
        <DeleteExpenseModal
          expense={deletingExpense}
          isOpen={!!deletingExpense}
          onClose={() => setDeletingExpense(null)}
          onSuccess={() => {
            // Expense list will automatically refresh due to React Query
            setDeletingExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
