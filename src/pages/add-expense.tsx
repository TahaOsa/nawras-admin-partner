// Add Expense page component
import React from 'react';
import { AddExpenseForm } from '../features';

const AddExpensePage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Add New Expense
        </h1>

        <AddExpenseForm />
      </div>
    </div>
  );
};

export default AddExpensePage;
