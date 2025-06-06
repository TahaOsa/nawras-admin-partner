// Test file to verify partnership calculation logic
import { calculateBalance } from './src/lib/expense-utils.js';

// Test data
const testExpenses = [
  {
    id: 1,
    amount: 100,
    description: 'Groceries',
    category: 'Food',
    paidById: 'taha',
    date: '2024-01-01',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    amount: 60,
    description: 'Gas',
    category: 'Transportation',
    paidById: 'burak',
    date: '2024-01-02',
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: 3,
    amount: 80,
    description: 'Restaurant',
    category: 'Food',
    paidById: 'taha',
    date: '2024-01-03',
    createdAt: '2024-01-03T10:00:00Z'
  }
];

console.log('Testing Partnership Calculation Logic');
console.log('=====================================');

const result = calculateBalance(testExpenses);

console.log('Test Expenses:');
testExpenses.forEach((expense, index) => {
  console.log(`  ${index + 1}. ${expense.paidById} paid $${expense.amount} for ${expense.description}`);
});

console.log('\nPartnership Calculation Results:');
console.log(`  Total Expenses: $${result.combinedTotal}`);
console.log(`  Taha Paid: $${result.tahaPaid}`);
console.log(`  Burak Paid: $${result.burakPaid}`);
console.log(`  Each Partner Owes: $${result.tahaOwes}`);
console.log(`  Taha's Balance: $${result.tahaBalance.toFixed(2)} (${result.tahaBalance > 0 ? 'credit' : 'debt'})`);
console.log(`  Burak's Balance: $${result.burakBalance.toFixed(2)} (${result.burakBalance > 0 ? 'credit' : 'debt'})`);
console.log(`  Net Balance: $${result.netBalance.toFixed(2)}`);
console.log(`  Who Owes Whom: ${result.whoOwesWhom}`);

console.log('\nExpected Results:');
console.log('  Total: $240 (100 + 60 + 80)');
console.log('  Each owes: $120 (240 / 2)');
console.log('  Taha: paid $180, owes $120 = +$60 credit');
console.log('  Burak: paid $60, owes $120 = -$60 debt');
console.log('  Result: Burak owes Taha $60');

const isCorrect = (
  result.combinedTotal === 240 &&
  result.tahaPaid === 180 &&
  result.burakPaid === 60 &&
  result.tahaOwes === 120 &&
  result.burakOwes === 120 &&
  result.tahaBalance === 60 &&
  result.burakBalance === -60 &&
  result.netBalance === 60 &&
  result.whoOwesWhom === 'burak_owes_taha'
);

console.log(`\n✅ Test ${isCorrect ? 'PASSED' : 'FAILED'}`);

if (!isCorrect) {
  console.log('❌ Some calculations are incorrect. Please check the logic.');
} 