import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { ExpenseFilters } from '../types';
import { UserId } from '../types';

interface QuickSearchProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onClearFilters: () => void;
  placeholder?: string;
  className?: string;
  showQuickFilters?: boolean;
}

export function QuickSearch({
  filters,
  onFiltersChange,
  onClearFilters,
  placeholder = "Search expenses...",
  className = '',
  showQuickFilters = true
}: QuickSearchProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({
          ...filters,
          search: searchValue || undefined,
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const updateFilter = useCallback((key: keyof ExpenseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  }, [filters, onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== undefined && value !== '' && value !== null
  );

  const clearSearch = () => {
    setSearchValue('');
    onFiltersChange({
      ...filters,
      search: undefined,
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      {showQuickFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Quick Filters */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Category:</span>
            <button
              onClick={() => updateFilter('category', filters.category === 'Food' ? undefined : 'Food')}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.category === 'Food'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Food
            </button>
            <button
              onClick={() => updateFilter('category', filters.category === 'Groceries' ? undefined : 'Groceries')}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.category === 'Groceries'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Groceries
            </button>
            <button
              onClick={() => updateFilter('category', filters.category === 'Transportation' ? undefined : 'Transportation')}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.category === 'Transportation'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Transport
            </button>
          </div>

          {/* Paid By Quick Filters */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Paid by:</span>
            <button
              onClick={() => updateFilter('paidBy', filters.paidBy === UserId.TAHA ? undefined : UserId.TAHA)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.paidBy === UserId.TAHA
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Taha
            </button>
            <button
              onClick={() => updateFilter('paidBy', filters.paidBy === UserId.BURAK ? undefined : UserId.BURAK)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.paidBy === UserId.BURAK
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Burak
            </button>
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="text-xs text-gray-500">
          {Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length} filter(s) active
        </div>
      )}
    </div>
  );
}
