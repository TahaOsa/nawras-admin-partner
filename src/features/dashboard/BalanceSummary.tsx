import React from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettlements } from '../../hooks/useSettlements';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

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
                                         color.includes('red') ? 'bg-red-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const BalanceSummary: React.FC = () => {
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: _settlements = [], isLoading: settlementsLoading } = useSettlements();

  if (expensesLoading || settlementsLoading) {
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

  // Calculate balances
  const tahaExpenses = expenses
    .filter(e => e.paidById === 'taha')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const burakExpenses = expenses
    .filter(e => e.paidById === 'burak')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpenses = tahaExpenses + burakExpenses;
  
  // Calculate settlements (for future use)
  // const totalSettlements = settlements.reduce((sum, s) => sum + s.amount, 0);
  
  // Calculate net balance (who owes whom)
  const rawBalance = tahaExpenses - burakExpenses;
  const netBalance = Math.abs(rawBalance);
  const balanceOwer = rawBalance > 0 ? 'Burak owes Taha' : rawBalance < 0 ? 'Taha owes Burak' : 'Balanced';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <BalanceCard
        title="Taha's Expenses"
        amount={tahaExpenses}
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        color="text-blue-600"
        subtitle={`${expenses.filter(e => e.paidById === 'taha').length} transactions`}
      />
      
      <BalanceCard
        title="Burak's Expenses"
        amount={burakExpenses}
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        color="text-green-600"
        subtitle={`${expenses.filter(e => e.paidById === 'burak').length} transactions`}
      />
      
      <BalanceCard
        title="Total Combined"
        amount={totalExpenses}
        icon={<Users className="h-6 w-6 text-gray-600" />}
        color="text-gray-900"
        subtitle={`${expenses.length} total expenses`}
      />
      
      <BalanceCard
        title="Current Balance"
        amount={netBalance}
        icon={rawBalance > 0 ? 
          <TrendingUp className="h-6 w-6 text-red-600" /> : 
          rawBalance < 0 ? 
          <TrendingDown className="h-6 w-6 text-red-600" /> :
          <DollarSign className="h-6 w-6 text-green-600" />
        }
        color={rawBalance === 0 ? "text-green-600" : "text-red-600"}
        subtitle={balanceOwer}
      />
    </div>
  );
};
