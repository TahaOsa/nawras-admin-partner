import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Expense = Database['public']['Tables']['expenses']['Row'];
type Settlement = Database['public']['Tables']['settlements']['Row'];
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert'];
type SettlementInsert = Database['public']['Tables']['settlements']['Insert'];

export class SupabaseService {
  // User operations
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  // Expense operations
  static async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getExpenseById(id: string): Promise<Expense | null> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createExpense(expense: ExpenseInsert): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExpense(id: string, updates: Partial<ExpenseInsert>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getExpensesByUser(userId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('paid_by_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Settlement operations
  static async getSettlements(): Promise<Settlement[]> {
    const { data, error } = await supabase
      .from('settlements')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createSettlement(settlement: SettlementInsert): Promise<Settlement> {
    const { data, error } = await supabase
      .from('settlements')
      .insert(settlement)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics and calculations
  static async getExpensesSummary() {
    const expenses = await this.getExpenses();
    const users = await this.getUsers();

    const summary = {
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      byUser: {} as Record<string, { total: number; count: number; name: string }>,
      byCategory: {} as Record<string, { total: number; count: number }>
    };

    // Create user lookup
    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {} as Record<string, string>);

    // Calculate by user and category
    expenses.forEach(expense => {
      // By user
      if (!summary.byUser[expense.paid_by_id]) {
        summary.byUser[expense.paid_by_id] = {
          total: 0,
          count: 0,
          name: userLookup[expense.paid_by_id] || 'Unknown'
        };
      }
      summary.byUser[expense.paid_by_id].total += expense.amount;
      summary.byUser[expense.paid_by_id].count += 1;

      // By category
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = { total: 0, count: 0 };
      }
      summary.byCategory[expense.category].total += expense.amount;
      summary.byCategory[expense.category].count += 1;
    });

    return summary;
  }

  static async getBalanceCalculation() {
    const expenses = await this.getExpenses();
    const settlements = await this.getSettlements();
    const users = await this.getUsers();

    const balances = {} as Record<string, number>;

    // Initialize balances
    users.forEach(user => {
      balances[user.id] = 0;
    });

    // Calculate total paid by each user
    const totalPaid = {} as Record<string, number>;
    expenses.forEach(expense => {
      totalPaid[expense.paid_by_id] = (totalPaid[expense.paid_by_id] || 0) + expense.amount;
    });

    // Calculate total expenses and fair share
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const fairShare = totalExpenses / users.length;

    // Calculate initial balances (what they owe or are owed)
    users.forEach(user => {
      const userPaid = totalPaid[user.id] || 0;
      balances[user.id] = userPaid - fairShare;
    });

    // Adjust for settlements
    settlements.forEach(settlement => {
      balances[settlement.paid_by_id] -= settlement.amount; // Payer reduces debt/increases credit
      balances[settlement.paid_to_id] += settlement.amount; // Receiver increases debt/reduces credit
    });

    return {
      balances,
      totalExpenses,
      fairShare,
      totalPaid,
      users: users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {} as Record<string, string>)
    };
  }
} 