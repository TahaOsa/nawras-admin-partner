import React from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettlements } from '../../hooks/useSettlements';
import { calculateBalance } from '../../lib/expense-utils';
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

  // Use new partnership calculation logic
  const balance = calculateBalance(expenses);
  
  // Create balance description
  const getBalanceDescription = () => {
    if (balance.whoOwesWhom === 'balanced') {
      return 'Perfect balance!';
    } else if (balance.whoOwesWhom === 'burak_owes_taha') {
      return 'Burak owes Taha';
    } else {
      return 'Taha owes Burak';
    }
  };

  const getBalanceDetails = () => {
    const tahaTransactions = expenses.filter(e => e.paidById === 'taha').length;
    const burakTransactions = expenses.filter(e => e.paidById === 'burak').length;
    
    return {
      tahaInfo: `Paid $${balance.tahaPaid.toFixed(2)}, owes $${balance.tahaOwes.toFixed(2)}`,
      burakInfo: `Paid $${balance.burakPaid.toFixed(2)}, owes $${balance.burakOwes.toFixed(2)}`,
      tahaTransactions: `${tahaTransactions} transactions`,
      burakTransactions: `${burakTransactions} transactions`
    };
  };

  const details = getBalanceDetails();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <BalanceCard
        title="Taha's Account"
        amount={balance.tahaPaid}
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        color="text-blue-600"
        subtitle={details.tahaInfo}
      />
      
      <BalanceCard
        title="Burak's Account"
        amount={balance.burakPaid}
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        color="text-green-600"
        subtitle={details.burakInfo}
      />
      
      <BalanceCard
        title="Partnership Total"
        amount={balance.combinedTotal}
        icon={<Users className="h-6 w-6 text-purple-600" />}
        color="text-purple-600"
        subtitle={`Each partner owes $${balance.tahaOwes.toFixed(2)}`}
      />
      
      <BalanceCard
        title="Current Balance"
        amount={balance.netBalance}
        icon={balance.whoOwesWhom === 'balanced' ? 
          <Calculator className="h-6 w-6 text-green-600" /> :
          balance.whoOwesWhom === 'burak_owes_taha' ? 
          <TrendingUp className="h-6 w-6 text-red-600" /> : 
          <TrendingDown className="h-6 w-6 text-red-600" />
        }
        color={balance.whoOwesWhom === 'balanced' ? "text-green-600" : "text-red-600"}
        subtitle={getBalanceDescription()}
      />
    </div>
  );
};
