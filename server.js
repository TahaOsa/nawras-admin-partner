import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Supabase client
const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODY3NTUsImV4cCI6MjA2NDU2Mjc1NX0.iAp-OtmHThl9v0y42Gt9y-FdKQKucocRx874_LmIwuU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Nawras Admin Partner API - Connected to Supabase',
    database: 'Connected'
  });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nawras_users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all expenses with user information
app.get('/api/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nawras_expenses')
      .select(`
        *,
        paid_by:nawras_users!nawras_expenses_paid_by_id_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { amount, category, description, paid_by_id, date } = req.body;
    
    const { data, error } = await supabase
      .from('nawras_expenses')
      .insert({
        amount,
        category,
        description,
        paid_by_id,
        date
      })
      .select(`
        *,
        paid_by:nawras_users!nawras_expenses_paid_by_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('nawras_expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        paid_by:nawras_users!nawras_expenses_paid_by_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('nawras_expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Get all settlements with user information
app.get('/api/settlements', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('nawras_settlements')
      .select(`
        *,
        paid_by_user:nawras_users!nawras_settlements_paid_by_fkey(*),
        paid_to_user:nawras_users!nawras_settlements_paid_to_fkey(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching settlements:', error);
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
});

// Create new settlement
app.post('/api/settlements', async (req, res) => {
  try {
    const { amount, paid_by, paid_to, description, date } = req.body;
    
    const { data, error } = await supabase
      .from('nawras_settlements')
      .insert({
        amount,
        paid_by,
        paid_to,
        description,
        date
      })
      .select(`
        *,
        paid_by_user:nawras_users!nawras_settlements_paid_by_fkey(*),
        paid_to_user:nawras_users!nawras_settlements_paid_to_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating settlement:', error);
    res.status(500).json({ error: 'Failed to create settlement' });
  }
});

// Dashboard analytics endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get all data in parallel
    const [expensesResult, settlementsResult, usersResult] = await Promise.all([
      supabase
        .from('nawras_expenses')
        .select(`*, paid_by:nawras_users!nawras_expenses_paid_by_id_fkey(*)`),
      supabase
        .from('nawras_settlements')
        .select(`*, paid_by_user:nawras_users!nawras_settlements_paid_by_fkey(*), paid_to_user:nawras_users!nawras_settlements_paid_to_fkey(*)`),
      supabase
        .from('nawras_users')
        .select('*')
    ]);

    if (expensesResult.error) throw expensesResult.error;
    if (settlementsResult.error) throw settlementsResult.error;
    if (usersResult.error) throw usersResult.error;

    const expenses = expensesResult.data || [];
    const settlements = settlementsResult.data || [];
    const users = usersResult.data || [];

    // Calculate analytics
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalSettlements = settlements.reduce((sum, settlement) => sum + Number(settlement.amount), 0);

    // Expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {});

    // Monthly expenses (last 6 months)
    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + Number(expense.amount);
      return acc;
    }, {});

    // User balances with partnership logic (50/50 split)
    const userBalances = users.map(user => {
      const userExpenses = expenses
        .filter(expense => expense.paid_by_id === user.user_id)
        .reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      const settlementsOut = settlements
        .filter(settlement => settlement.paid_by === user.user_id)
        .reduce((sum, settlement) => sum + Number(settlement.amount), 0);
      
      const settlementsIn = settlements
        .filter(settlement => settlement.paid_to === user.user_id)
        .reduce((sum, settlement) => sum + Number(settlement.amount), 0);

      // Partnership calculation: each partner owes 50% of total expenses
      const eachPartnerShare = totalExpenses / 2;
      const partnershipBalance = userExpenses - eachPartnerShare;

      return {
        user_id: user.user_id,
        name: user.name,
        balance: partnershipBalance, // Updated to partnership balance
        partnershipBalance: partnershipBalance,
        totalPaid: userExpenses,
        totalOwes: eachPartnerShare,
        totalExpenses: userExpenses, // Keep for backward compatibility
        settlementsOut,
        settlementsIn
      };
    });

    res.json({
      totalExpenses,
      totalSettlements,
      expensesByCategory,
      monthlyExpenses,
      userBalances,
      recentExpenses: expenses.slice(0, 5),
      recentSettlements: settlements.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Analytics endpoints
app.get('/api/analytics/monthly', async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    const { data: expenses, error } = await supabase
      .from('nawras_expenses')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;

    // Group by month
    const monthlyData = (expenses || []).reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { period: month, totalAmount: 0, expenseCount: 0 };
      }
      acc[month].totalAmount += Number(expense.amount);
      acc[month].expenseCount += 1;
      return acc;
    }, {});

    const result = Object.values(monthlyData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching monthly analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch monthly analytics' });
  }
});

app.get('/api/analytics/categories', async (req, res) => {
  try {
    const { data: expenses, error } = await supabase
      .from('nawras_expenses')
      .select('*');
    
    if (error) throw error;

    // Group by category
    const categoryData = (expenses || []).reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = { category, totalAmount: 0, expenseCount: 0 };
      }
      acc[category].totalAmount += Number(expense.amount);
      acc[category].expenseCount += 1;
      return acc;
    }, {});

    const result = Object.values(categoryData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category analytics' });
  }
});

app.get('/api/analytics/users', async (req, res) => {
  try {
    const [expensesResult, usersResult] = await Promise.all([
      supabase.from('nawras_expenses').select('*'),
      supabase.from('nawras_users').select('*')
    ]);

    if (expensesResult.error) throw expensesResult.error;
    if (usersResult.error) throw usersResult.error;

    const expenses = expensesResult.data || [];
    const users = usersResult.data || [];

    // Calculate user spending
    const userData = users.map(user => {
      const userExpenses = expenses.filter(expense => expense.paid_by_id === user.user_id);
      const totalAmount = userExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      return {
        user: user.name,
        totalAmount,
        expenseCount: userExpenses.length,
        avgExpense: userExpenses.length > 0 ? totalAmount / userExpenses.length : 0
      };
    });

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user analytics' });
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database: Connected to Supabase`);
});

export default app;
