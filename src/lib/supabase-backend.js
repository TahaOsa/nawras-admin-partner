import { createClient } from '@supabase/supabase-js';

// Supabase configuration for backend
const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4Njc1NSwiZXhwIjoyMDY0NTYyNzU1fQ.iU85jP7cXz8DsF9RgroSB6qIX5x1KzUqW0n5zBcNvBA';

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Backend service class
export class SupabaseBackendService {
  // Initialize database with sample data
  static async initializeDatabase() {
    try {
      console.log('🔄 Checking database setup...');
      
      // Try to check if users table exists by querying it
      const { data: existingUsers, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (userError) {
        if (userError.code === '42P01') {
          console.log('📋 Tables not found, please run the setup SQL script in Supabase dashboard');
          console.log('📋 Go to https://supabase.com/dashboard → SQL Editor and run setup-database.sql');
          return { 
            success: false, 
            error: 'Database tables not found. Please run setup-database.sql in Supabase SQL Editor first.' 
          };
        } else {
          throw userError;
        }
      }

      // If users exist, check if we have sample data
      if (!existingUsers || existingUsers.length === 0) {
        console.log('📦 Tables exist but no sample data found, creating...');
        await this.createSampleData();
      } else {
        console.log('✅ Database already has data, ready to use');
      }

      console.log('✅ Database initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async createTables() {
    // Create tables one by one for better error handling
    try {
      // Create users table
      const { error: usersError } = await supabase.rpc('sql', {
        query: `
          CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              email VARCHAR(255) UNIQUE NOT NULL,
              name VARCHAR(255) NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });

      if (usersError) {
        console.log('Users table might already exist, continuing...');
      }

      // Create expenses table
      const { error: expensesError } = await supabase.rpc('sql', {
        query: `
          CREATE TABLE IF NOT EXISTS expenses (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              amount DECIMAL(10,2) NOT NULL,
              description TEXT NOT NULL,
              category VARCHAR(100) NOT NULL,
              paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              date DATE NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });

      if (expensesError) {
        console.log('Expenses table might already exist, continuing...');
      }

      // Create settlements table
      const { error: settlementsError } = await supabase.rpc('sql', {
        query: `
          CREATE TABLE IF NOT EXISTS settlements (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              amount DECIMAL(10,2) NOT NULL,
              paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              paid_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              description TEXT,
              date DATE NOT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });

      if (settlementsError) {
        console.log('Settlements table might already exist, continuing...');
      }

      console.log('✅ Tables created successfully');
    } catch (error) {
      // If table creation fails, we'll try direct table operations instead
      console.log('Table creation via RPC failed, tables might already exist');
    }
  }

  static async createSampleData() {
    // Create users
    const { data: users, error: userError } = await supabase
      .from('users')
      .insert([
        { email: 'taha@nawrasinchina.com', name: 'Taha' },
        { email: 'burak@nawrasinchina.com', name: 'Burak' }
      ])
      .select();

    if (userError) throw userError;

    const taha = users.find(u => u.email === 'taha@nawrasinchina.com');
    const burak = users.find(u => u.email === 'burak@nawrasinchina.com');

    // Create sample expenses
    const { error: expenseError } = await supabase
      .from('expenses')
      .insert([
        { amount: 25.50, description: 'Lunch', category: 'Food', paid_by_id: taha.id, date: '2024-01-15' },
        { amount: 60.99, description: 'Groceries', category: 'Food', paid_by_id: burak.id, date: '2024-01-16' },
        { amount: 15.75, description: 'Coffee', category: 'Food', paid_by_id: taha.id, date: '2024-01-17' },
        { amount: 120.00, description: 'Utilities', category: 'Bills', paid_by_id: burak.id, date: '2024-01-18' },
        { amount: 45.30, description: 'Gas', category: 'Transportation', paid_by_id: taha.id, date: '2024-01-19' }
      ]);

    if (expenseError) throw expenseError;

    return { taha, burak };
  }

  // Expense operations
  static async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        user:users!paid_by_id(name, email)
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createExpense(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select(`
        *,
        user:users!paid_by_id(name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExpense(id, updates) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:users!paid_by_id(name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteExpense(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // User operations
  static async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Settlement operations
  static async getSettlements() {
    const { data, error } = await supabase
      .from('settlements')
      .select(`
        *,
        paid_by:users!paid_by_id(name, email),
        paid_to:users!paid_to_id(name, email)
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createSettlement(settlement) {
    const { data, error } = await supabase
      .from('settlements')
      .insert(settlement)
      .select(`
        *,
        paid_by:users!paid_by_id(name, email),
        paid_to:users!paid_to_id(name, email)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics
  static async getExpensesSummary() {
    const expenses = await this.getExpenses();
    const users = await this.getUsers();

    const summary = {
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      byUser: {},
      byCategory: {}
    };

    // Calculate by user and category
    expenses.forEach(expense => {
      const userId = expense.paid_by_id;
      const userName = expense.user?.name || 'Unknown';

      // By user
      if (!summary.byUser[userId]) {
        summary.byUser[userId] = { total: 0, count: 0, name: userName };
      }
      summary.byUser[userId].total += expense.amount;
      summary.byUser[userId].count += 1;

      // By category
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = { total: 0, count: 0 };
      }
      summary.byCategory[expense.category].total += expense.amount;
      summary.byCategory[expense.category].count += 1;
    });

    return summary;
  }
} 