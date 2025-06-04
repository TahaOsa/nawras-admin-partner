import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import type { Expense } from '../types';
import { useDeleteExpense } from '../hooks/useExpenses';
import { formatCurrency } from '../lib/expense-utils';

interface DeleteExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteExpenseModal({ expense, isOpen, onClose, onSuccess }: DeleteExpenseModalProps) {
  const deleteExpenseMutation = useDeleteExpense();

  const handleDelete = async () => {
    try {
      await deleteExpenseMutation.mutateAsync(expense.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={deleteExpenseMutation.isPending}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>

          {/* Expense Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Description:</span>
                <span className="font-medium text-gray-900 text-right max-w-48 truncate">
                  {expense.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="font-medium text-gray-900">{expense.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Paid by:</span>
                <span className="font-medium text-gray-900 capitalize">{expense.paidById}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {deleteExpenseMutation.isError && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              Failed to delete expense. Please try again.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={deleteExpenseMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              disabled={deleteExpenseMutation.isPending}
            >
              {deleteExpenseMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Expense
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
