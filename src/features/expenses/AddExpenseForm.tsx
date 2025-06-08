import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Save, X, DollarSign, User, Calendar, Tag } from 'lucide-react';
import { useCreateExpense } from '../../hooks';
import { useCommonTranslation } from '../../hooks/useI18n';
import { DEFAULT_CATEGORIES, UserId } from '../../types';
import type { CreateExpenseRequest } from '../../types';

interface FormData {
  amount: string;
  description: string;
  category: string;
  paidById: string;
  date: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  category?: string;
  paidById?: string;
  date?: string;
}

const AddExpenseForm: React.FC = () => {
  const { t } = useCommonTranslation();
  const [, setLocation] = useLocation();
  const createExpenseMutation = useCreateExpense();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    description: '',
    category: '',
    paidById: '',
    date: new Date().toISOString().split('T')[0], // Today's date
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim()) {
      newErrors.amount = t('pages.addExpense.validation.amountRequired');
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = t('pages.addExpense.validation.amountPositive');
    } else if (amount > 10000) {
      newErrors.amount = t('pages.addExpense.validation.amountLimit');
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = t('pages.addExpense.validation.descriptionRequired');
    } else if (formData.description.trim().length < 3) {
      newErrors.description = t('pages.addExpense.validation.descriptionMinLength');
    } else if (formData.description.trim().length > 100) {
      newErrors.description = t('pages.addExpense.validation.descriptionMaxLength');
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = t('pages.addExpense.validation.categoryRequired');
    }

    // Paid by validation
    if (!formData.paidById) {
      newErrors.paidById = t('pages.addExpense.validation.paidByRequired');
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = t('pages.addExpense.validation.dateRequired');
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      if (selectedDate > today) {
        newErrors.date = t('pages.addExpense.validation.dateNotFuture');
      } else if (selectedDate < oneYearAgo) {
        newErrors.date = t('pages.addExpense.validation.dateNotTooOld');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData: CreateExpenseRequest = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        paidById: formData.paidById,
        date: formData.date,
      };

      console.log('Submitting expense data:', expenseData);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? window.location.origin : 'http://localhost:8080'));

      const result = await createExpenseMutation.mutateAsync(expenseData);
      console.log('Expense created successfully:', result);
      
      // Success - redirect to dashboard
      setLocation('/');
    } catch (error) {
      console.error('Failed to create expense:', error);
      // Error is handled by the mutation hook and will be displayed in the UI
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setLocation('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              {t('pages.addExpense.amount')}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                max="10000"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              {t('pages.addExpense.description')}
            </label>
            <input
              type="text"
              id="description"
              placeholder={t('pages.addExpense.descriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : (
                <p className="text-sm text-gray-500">{t('pages.addExpense.descriptionHelper')}</p>
              )}
              <p className="text-sm text-gray-400">{formData.description.length}/100</p>
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              {t('pages.addExpense.category')}
            </label>
                          <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">{t('pages.addExpense.selectCategory')}</option>
                {DEFAULT_CATEGORIES.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Paid By Field */}
          <div>
            <label htmlFor="paidById" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              {t('pages.addExpense.paidBy')}
            </label>
            <select
              id="paidById"
              value={formData.paidById}
              onChange={(e) => handleInputChange('paidById', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paidById ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{t('pages.addExpense.selectPayer')}</option>
              <option value={UserId.TAHA}>Taha</option>
              <option value={UserId.BURAK}>Burak</option>
            </select>
            {errors.paidById && (
              <p className="mt-1 text-sm text-red-600">{errors.paidById}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              {t('pages.addExpense.date')}
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="inline h-4 w-4 mr-2" />
            {t('pages.addExpense.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="inline h-4 w-4 mr-2" />
            {isSubmitting ? t('buttons.saving') : t('pages.addExpense.saveExpense')}
          </button>
        </div>

        {/* Error Display */}
        {createExpenseMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {createExpenseMutation.error instanceof Error 
                ? createExpenseMutation.error.message 
                : 'Failed to create expense. Please try again.'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddExpenseForm;
