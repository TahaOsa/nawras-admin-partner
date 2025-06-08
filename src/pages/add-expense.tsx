// Add Expense page component
import React from 'react';
import { AddExpenseForm } from '../features';
import { useCommonTranslation } from '../hooks/useI18n';

const AddExpensePage: React.FC = () => {
  const { t } = useCommonTranslation();
  
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('pages.addExpense.title')}
        </h1>

        <AddExpenseForm />
      </div>
    </div>
  );
};

export default AddExpensePage;
