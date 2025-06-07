import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Helper function to safely parse dates
function safeParseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Invalid date string:', dateString, error);
    return null;
  }
}

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
    
    res.json({ 
      success: true, 
      data: data || [] 
    });
  } catch (error) {
    console.error('Error fetching settlements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch settlements' 
    });
  }
});

// Create new settlement
app.post('/api/settlements', async (req, res) => {
  try {
    console.log('Settlement request body:', req.body);
    
    // Handle both camelCase (frontend) and snake_case (database) formats
    const { 
      amount, 
      paidBy, paid_by, // Accept both formats
      paidTo, paid_to, // Accept both formats  
      description, 
      date 
    } = req.body;
    
    // Use camelCase if provided, fallback to snake_case
    const paidByValue = paidBy || paid_by;
    const paidToValue = paidTo || paid_to;
    
    // Enhanced validation
    if (!amount || typeof amount === 'undefined' || amount === null) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount is required and must be a valid number' 
      });
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount must be a positive number' 
      });
    }
    
    if (parsedAmount > 50000) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount cannot exceed $50,000' 
      });
    }
    
    if (!paidByValue || !paidToValue || !date) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: amount, paidBy, paidTo, date' 
      });
    }
    
    // Validate users exist
    const validUsers = ['taha', 'burak'];
    if (!validUsers.includes(paidByValue) || !validUsers.includes(paidToValue)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user IDs. Must be either "taha" or "burak"' 
      });
    }
    
    // Prevent self-payment
    if (paidByValue === paidToValue) {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot create settlement where payer and recipient are the same person' 
      });
    }
    
    // Validate date format
    const settlementDate = new Date(date);
    if (isNaN(settlementDate.getTime())) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid date format. Please use YYYY-MM-DD format' 
      });
    }
    
    // Check if date is too far in the past or future
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (settlementDate > tomorrow) {
      return res.status(400).json({ 
        success: false,
        error: 'Settlement date cannot be in the future' 
      });
    }
    
    if (settlementDate < oneYearAgo) {
      return res.status(400).json({ 
        success: false,
        error: 'Settlement date cannot be more than a year ago' 
      });
    }
    
    // Validate description length
    const finalDescription = description || '';
    if (finalDescription.length > 500) {
      return res.status(400).json({ 
        success: false,
        error: 'Description cannot exceed 500 characters' 
      });
    }
    
    // Create settlement with better error handling
    const { data, error } = await supabase
      .from('nawras_settlements')
      .insert({
        amount: parsedAmount,
        paid_by: paidByValue,
        paid_to: paidToValue,
        description: finalDescription,
        date: date
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating settlement:', error);
      
      // Handle specific Supabase errors
      if (error.code === '23505') {
        return res.status(409).json({ 
          success: false,
          error: 'A settlement with these details already exists' 
        });
      }
      
      if (error.code === '23503') {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid user reference in settlement' 
        });
      }
      
      // Generic database error
      return res.status(500).json({ 
        success: false,
        error: 'Database error occurred while creating settlement' 
      });
    }
    
    if (!data) {
      return res.status(500).json({ 
        success: false,
        error: 'No data returned after settlement creation' 
      });
    }
    
    console.log('Settlement created successfully:', data);
    
    res.status(201).json({ 
      success: true,
      data: {
        id: data.id,
        amount: data.amount,
        paidBy: data.paid_by,
        paidTo: data.paid_to,
        description: data.description,
        date: data.date,
        createdAt: data.created_at
      }
    });
  } catch (error) {
    console.error('Error creating settlement:', error);
    
    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        error: `Validation error: ${error.message}` 
      });
    }
    
    if (error.name === 'TypeError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid data format in request' 
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occurred while creating the settlement' 
    });
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
      const date = safeParseDate(expense.date);
      if (!date) return acc; // Skip invalid dates
      const month = date.toISOString().slice(0, 7);
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
      const date = safeParseDate(expense.date);
      if (!date) return acc; // Skip invalid dates
      const month = date.toISOString().slice(0, 7);
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
      const expenseCount = userExpenses.length;
      const avgExpense = expenseCount > 0 ? totalAmount / expenseCount : 0;

      return {
        user: user.name || user.user_id,
        totalAmount,
        expenseCount,
        avgExpense: Math.round(avgExpense * 100) / 100
      };
    });

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user analytics' });
  }
});

// Analytics endpoint - balance history  
app.get('/api/analytics/balance-history', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get expenses and settlements in chronological order
    const [expensesResult, settlementsResult] = await Promise.all([
      supabase
        .from('nawras_expenses')
        .select('*')
        .order('date', { ascending: true }),
      supabase
        .from('nawras_settlements')
        .select('*')
        .order('date', { ascending: true })
    ]);

    if (expensesResult.error) throw expensesResult.error;
    if (settlementsResult.error) throw settlementsResult.error;

    const expenses = expensesResult.data || [];
    const settlements = settlementsResult.data || [];

    // Create balance history data
    const balanceHistory = [];
    let runningBalance = 0;
    let cumulativeExpenses = 0;
    let cumulativeSettlements = 0;

    // Combine and sort all transactions by date
    const allTransactions = [
      ...expenses.map(e => ({ ...e, type: 'expense' })),
      ...settlements.map(s => ({ ...s, type: 'settlement' }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    allTransactions.forEach(transaction => {
      const amount = Number(transaction.amount) || 0;
      
      if (transaction.type === 'expense') {
        // For expenses: if Taha paid, it's negative for balance (Burak owes Taha)
        // if Burak paid, it's positive for balance (Taha owes Burak)
        if (transaction.paid_by_id === 'taha') {
          runningBalance -= amount / 2; // Taha paid, so Burak owes half
        } else {
          runningBalance += amount / 2; // Burak paid, so Taha owes half
        }
        cumulativeExpenses += amount;
      } else if (transaction.type === 'settlement') {
        // For settlements: adjust the balance
        if (transaction.paid_by === 'taha') {
          runningBalance += amount; // Taha paid settlement
        } else {
          runningBalance -= amount; // Burak paid settlement
        }
        cumulativeSettlements += amount;
      }

      balanceHistory.push({
        date: transaction.date,
        balance: runningBalance, // This is the field the frontend expects
        runningBalance: runningBalance, // Keep for compatibility 
        cumulativeExpenses: cumulativeExpenses,
        settlements: cumulativeSettlements,
        type: transaction.type,
        amount: amount,
        description: transaction.description || 'Transaction'
      });
    });

    res.json({ 
      success: true, 
      data: balanceHistory 
    });
  } catch (error) {
    console.error('Error fetching balance history:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch balance history' 
    });
  }
});

// Analytics endpoint - time patterns
app.get('/api/analytics/time-patterns', async (req, res) => {
  try {
    const { period } = req.query;
    
    const { data, error } = await supabase
      .from('nawras_expenses')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;

    const expenses = data || [];
    
    // Create time pattern data with proper structure
    const timePatterns = [];
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    // Group by day of week and hour
    const patterns = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayOfWeek = dayMap[dayName] || 0;
      const hour = date.getHours();
      const amount = Number(expense.amount) || 0;
      
      const key = `${dayOfWeek}-${hour}`;
      if (!patterns[key]) {
        patterns[key] = {
          dayOfWeek: dayOfWeek,  // Number as expected by frontend
          hour: hour,
          amount: 0,
          count: 0,
          dayName: dayName,
          timeSlot: hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
        };
      }
      
      patterns[key].amount += amount;
      patterns[key].count += 1;
    });
    
    // Convert to array and ensure proper structure
    const timePatternArray = Object.values(patterns).map(pattern => ({
      dayOfWeek: pattern.dayOfWeek,
      hour: pattern.hour,
      amount: pattern.amount,
      count: pattern.count,
      dayName: pattern.dayName,
      timeSlot: pattern.timeSlot
    }));

    res.json({ 
      success: true, 
      data: timePatternArray 
    });
  } catch (error) {
    console.error('Error fetching time patterns:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch time patterns' 
    });
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
