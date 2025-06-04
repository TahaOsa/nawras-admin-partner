import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { Expense, UpdateExpenseRequest } from '../types';
import { useUpdateExpense } from '../hooks/useExpenses';

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditExpenseModal({ expense, isOpen, onClose, onSuccess }: EditExpenseModalProps) {
  const [formData, setFormData] = useState<UpdateExpenseRequest>({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    paidById: expense.paidById,
    date: expense.date,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateExpenseMutation = useUpdateExpense();

  // Reset form when expense changes
  useEffect(() => {
    setFormData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      paidById: expense.paidById,
      date: expense.date,
    });
    setErrors({});
  }, [expense]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.paidById) {
      newErrors.paidById = 'Please select who paid';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateExpenseMutation.mutateAsync({
        id: expense.id,
        expense: formData,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const handleInputChange = (field: keyof UpdateExpenseRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={updateExpenseMutation.isPending}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateExpenseMutation.isPending}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateExpenseMutation.isPending}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateExpenseMutation.isPending}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Paid By */}
          <div>
            <label htmlFor="paidById" className="block text-sm font-medium text-gray-700 mb-1">
              Paid By
            </label>
            <select
              id="paidById"
              value={formData.paidById || ''}
              onChange={(e) => handleInputChange('paidById', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paidById ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateExpenseMutation.isPending}
            >
              <option value="">Select person</option>
              <option value="taha">Taha</option>
              <option value="burak">Burak</option>
            </select>
            {errors.paidById && <p className="text-red-500 text-sm mt-1">{errors.paidById}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateExpenseMutation.isPending}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Error Message */}
          {updateExpenseMutation.isError && (
            <div className="text-red-500 text-sm">
              Failed to update expense. Please try again.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={updateExpenseMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              disabled={updateExpenseMutation.isPending}
            >
              {updateExpenseMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
