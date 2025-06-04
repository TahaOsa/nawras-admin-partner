import React from 'react';
import { SettlementForm } from '../features';

const SettlementPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Record Settlement
        </h1>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>💡 Tip:</strong> Use this form to record when one person pays back money to settle shared expenses.
          </p>
        </div>

        <SettlementForm />
      </div>
    </div>
  );
};

export default SettlementPage;
