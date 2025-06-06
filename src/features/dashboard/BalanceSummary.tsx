import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { DollarSign, TrendingUp, TrendingDown, Users, Calculator } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ title, amount, icon, color, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          ${Math.abs(amount).toFixed(2)}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color.includes('blue') ? 'bg-blue-100' : 
                                         color.includes('green') ? 'bg-green-100' : 
                                         color.includes('red') ? 'bg-red-100' : 
                                         color.includes('purple') ? 'bg-purple-100' :
                                         'bg-gray-100'}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const BalanceSummary: React.FC = () => {
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!dashboardData || !dashboardData.userBalances || dashboardData.userBalances.length < 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 text-center text-gray-500 py-8">
          Unable to load balance data
        </div>
      </div>
    );
  }

  // Get user balances from API (partnership calculations already done by backend)
  const tahaData = dashboardData.userBalances.find(u => u.user_id === 'taha');
  const burakData = dashboardData.userBalances.find(u => u.user_id === 'burak');

  if (!tahaData || !burakData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 text-center text-gray-500 py-8">
          User balance data not found
        </div>
      </div>
    );
  }

  // Calculate who owes whom and net balance
  const netBalance = Math.abs(tahaData.partnershipBalance);
  const whoOwesWhom = tahaData.partnershipBalance < 0 ? 'taha_owes_burak' : 
                     tahaData.partnershipBalance > 0 ? 'burak_owes_taha' : 'balanced';

  const getBalanceDescription = () => {
    if (whoOwesWhom === 'balanced') {
      return 'Perfect balance!';
    } else if (whoOwesWhom === 'burak_owes_taha') {
      return 'Burak owes Taha';
    } else {
      return 'Taha owes Burak';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <BalanceCard
        title="Taha's Account"
        amount={tahaData.totalPaid}
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        color="text-blue-600"
        subtitle={`Paid $${tahaData.totalPaid.toFixed(2)}, owes $${tahaData.totalOwes.toFixed(2)}`}
      />
      
      <BalanceCard
        title="Burak's Account"
        amount={burakData.totalPaid}
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        color="text-green-600"
        subtitle={`Paid $${burakData.totalPaid.toFixed(2)}, owes $${burakData.totalOwes.toFixed(2)}`}
      />
      
      <BalanceCard
        title="Partnership Total"
        amount={dashboardData.totalExpenses}
        icon={<Users className="h-6 w-6 text-purple-600" />}
        color="text-purple-600"
        subtitle={`Each partner owes $${(dashboardData.totalExpenses / 2).toFixed(2)}`}
      />
      
      <BalanceCard
        title="Current Balance"
        amount={netBalance}
        icon={whoOwesWhom === 'balanced' ? 
          <Calculator className="h-6 w-6 text-green-600" /> :
          whoOwesWhom === 'burak_owes_taha' ? 
          <TrendingUp className="h-6 w-6 text-red-600" /> : 
          <TrendingDown className="h-6 w-6 text-red-600" />
        }
        color={whoOwesWhom === 'balanced' ? "text-green-600" : "text-red-600"}
        subtitle={getBalanceDescription()}
      />
    </div>
  );
};
