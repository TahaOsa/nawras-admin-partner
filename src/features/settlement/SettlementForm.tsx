import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Save, X, DollarSign, Users, Calendar, MessageSquare } from 'lucide-react';
import { useCreateSettlement } from '../../hooks/useSettlements';
import { useCommonTranslation } from '../../hooks/useI18n';
import { UserId } from '../../types';
import type { CreateSettlementRequest } from '../../types';

interface FormData {
  amount: string;
  paidBy: string;
  paidTo: string;
  description: string;
  date: string;
}

interface FormErrors {
  amount?: string;
  paidBy?: string;
  paidTo?: string;
  description?: string;
  date?: string;
}

const SettlementForm: React.FC = () => {
  const { t } = useCommonTranslation();
  const [, setLocation] = useLocation();
  const createSettlementMutation = useCreateSettlement();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    paidBy: '',
    paidTo: '',
    description: '',
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
      newErrors.amount = t('pages.recordSettlement.validation.amountRequired');
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = t('pages.recordSettlement.validation.amountPositive');
    } else if (amount > 10000) {
      newErrors.amount = t('pages.recordSettlement.validation.amountLimit');
    }

    // Paid by validation
    if (!formData.paidBy) {
      newErrors.paidBy = t('pages.recordSettlement.validation.payerRequired');
    }

    // Paid to validation
    if (!formData.paidTo) {
      newErrors.paidTo = t('pages.recordSettlement.validation.receiverRequired');
    }

    // Same person validation
    if (formData.paidBy && formData.paidTo && formData.paidBy === formData.paidTo) {
      newErrors.paidBy = t('pages.recordSettlement.validation.samePerson');
      newErrors.paidTo = t('pages.recordSettlement.validation.samePerson');
    }

    // Description validation (optional but with length limit)
    if (formData.description.trim().length > 200) {
      newErrors.description = t('pages.recordSettlement.validation.descriptionLimit');
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = t('pages.recordSettlement.validation.dateRequired');
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      if (selectedDate > today) {
        newErrors.date = t('pages.recordSettlement.validation.dateNotFuture');
      } else if (selectedDate < oneYearAgo) {
        newErrors.date = t('pages.recordSettlement.validation.dateNotTooOld');
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

    // Clear cross-field validation errors
    if ((field === 'paidBy' || field === 'paidTo') && errors.paidBy && errors.paidTo) {
      setErrors(prev => ({ ...prev, paidBy: undefined, paidTo: undefined }));
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
      const settlementData: CreateSettlementRequest = {
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        paidTo: formData.paidTo,
        description: formData.description.trim(),
        date: formData.date,
      };

      await createSettlementMutation.mutateAsync(settlementData);
      
      // Success - redirect to dashboard
      setLocation('/');
    } catch (error) {
      console.error('Failed to create settlement:', error);
      // Error is handled by the mutation hook
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
              {t('pages.recordSettlement.settlementAmount')}
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

          {/* Paid By Field */}
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              {t('pages.recordSettlement.whoIsPaying')}
            </label>
            <select
              id="paidBy"
              value={formData.paidBy}
              onChange={(e) => handleInputChange('paidBy', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paidBy ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{t('pages.recordSettlement.selectPayer')}</option>
              <option value={UserId.TAHA}>Taha</option>
              <option value={UserId.BURAK}>Burak</option>
            </select>
            {errors.paidBy && (
              <p className="mt-1 text-sm text-red-600">{errors.paidBy}</p>
            )}
          </div>

          {/* Paid To Field */}
          <div>
            <label htmlFor="paidTo" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              {t('pages.recordSettlement.whoIsReceiving')}
            </label>
            <select
              id="paidTo"
              value={formData.paidTo}
              onChange={(e) => handleInputChange('paidTo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paidTo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{t('pages.recordSettlement.selectReceiver')}</option>
              <option value={UserId.TAHA}>Taha</option>
              <option value={UserId.BURAK}>Burak</option>
            </select>
            {errors.paidTo && (
              <p className="mt-1 text-sm text-red-600">{errors.paidTo}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              {t('pages.recordSettlement.description')}
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder={t('pages.recordSettlement.placeholder')}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={200}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : (
                <span className="text-sm text-gray-500">Brief description of the settlement</span>
              )}
              <span className="text-sm text-gray-400">{formData.description.length}/200</span>
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              {t('pages.recordSettlement.settlementDate')}
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
            {t('pages.recordSettlement.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="inline h-4 w-4 mr-2" />
            {isSubmitting ? t('buttons.saving') : t('pages.recordSettlement.recordSettlement')}
          </button>
        </div>

        {/* Error Display */}
        {createSettlementMutation.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {createSettlementMutation.error instanceof Error 
                ? createSettlementMutation.error.message 
                : 'Failed to create settlement. Please try again.'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SettlementForm;
