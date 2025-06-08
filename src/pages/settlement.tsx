import React from 'react';
import { SettlementForm } from '../features';
import { useCommonTranslation } from '../hooks/useI18n';

const SettlementPage: React.FC = () => {
  const { t } = useCommonTranslation();
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('pages.recordSettlement.title')}
        </h1>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>💡 {t('pages.recordSettlement.tip')}</strong>
          </p>
        </div>

        <SettlementForm />
      </div>
    </div>
  );
};

export default SettlementPage;
