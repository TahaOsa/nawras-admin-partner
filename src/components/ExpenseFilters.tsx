import { useState, useCallback } from 'react';
import { Search, Filter, X, Calendar, DollarSign, SortAsc, SortDesc } from 'lucide-react';
import type { ExpenseFilters } from '../types';
import { ExpenseCategory, UserId } from '../types';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onClearFilters: () => void;
  showAdvanced?: boolean;
  className?: string;
}

export function ExpenseFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
  showAdvanced = true,
  className = ''
}: ExpenseFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateFilter = useCallback((key: keyof ExpenseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined, // Remove empty values
    });
  }, [filters, onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== '' && value !== null
  );

  const toggleSortOrder = () => {
    updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Basic Filters Row */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {Object.values(ExpenseCategory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Paid By Filter */}
            <select
              value={filters.paidBy || ''}
              onChange={(e) => updateFilter('paidBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Users</option>
              <option value={UserId.TAHA}>Taha</option>
              <option value={UserId.BURAK}>Burak</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy || 'date'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="description">Sort by Description</option>
              <option value="category">Sort by Category</option>
              <option value="paidBy">Sort by Paid By</option>
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm flex items-center gap-1"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {filters.sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>

            {/* Advanced Toggle */}
            {showAdvanced && (
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-1 transition-colors ${
                  isAdvancedOpen
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Advanced
              </button>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1 text-gray-600"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && isAdvancedOpen && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => updateFilter('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => updateFilter('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Min Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={filters.minAmount || ''}
                onChange={(e) => updateFilter('minAmount', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Max Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="999.99"
                value={filters.maxAmount || ''}
                onChange={(e) => updateFilter('maxAmount', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: "{filters.search}"
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Category: {filters.category}
                  </span>
                )}
                {filters.paidBy && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Paid by: {filters.paidBy === 'taha' ? 'Taha' : 'Burak'}
                  </span>
                )}
                {(filters.startDate || filters.endDate) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Date: {filters.startDate || '...'} to {filters.endDate || '...'}
                  </span>
                )}
                {(filters.minAmount || filters.maxAmount) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    Amount: ${filters.minAmount || '0'} - ${filters.maxAmount || '∞'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
