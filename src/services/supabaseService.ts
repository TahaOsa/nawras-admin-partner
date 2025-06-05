import { supabase } from '@/lib/supabase'
import type { ExpenseRow, ExpenseInsert, UserRow, SettlementRow, SettlementInsert } from '@/types/database'

// Users
export const getUsers = async (): Promise<UserRow[]> => {
  const { data, error } = await supabase
    .from('nawras_users')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data || []
}

export const getUserById = async (userId: string): Promise<UserRow | null> => {
  const { data, error } = await supabase
    .from('nawras_users')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// Expenses
export const getExpenses = async (): Promise<(ExpenseRow & { paid_by: UserRow })[]> => {
  const { data, error } = await supabase
    .from('nawras_expenses')
    .select(`
      *,
      paid_by:nawras_users!nawras_expenses_paid_by_id_fkey(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const createExpense = async (expense: ExpenseInsert): Promise<ExpenseRow> => {
  const { data, error } = await supabase
    .from('nawras_expenses')
    .insert(expense)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateExpense = async (id: string, updates: Partial<ExpenseInsert>): Promise<ExpenseRow> => {
  const { data, error } = await supabase
    .from('nawras_expenses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('nawras_expenses')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Settlements
export const getSettlements = async (): Promise<(SettlementRow & { paid_by_user: UserRow; paid_to_user: UserRow })[]> => {
  const { data, error } = await supabase
    .from('nawras_settlements')
    .select(`
      *,
      paid_by_user:nawras_users!nawras_settlements_paid_by_fkey(*),
      paid_to_user:nawras_users!nawras_settlements_paid_to_fkey(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const createSettlement = async (settlement: SettlementInsert): Promise<SettlementRow> => {
  const { data, error } = await supabase
    .from('nawras_settlements')
    .insert(settlement)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Dashboard Analytics
export const getDashboardData = async () => {
  const [expenses, settlements, users] = await Promise.all([
    getExpenses(),
    getSettlements(),
    getUsers()
  ])

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const totalSettlements = settlements.reduce((sum, settlement) => sum + Number(settlement.amount), 0)

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
    return acc
  }, {} as Record<string, number>)

  // Calculate monthly expenses
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toISOString().slice(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + Number(expense.amount)
    return acc
  }, {} as Record<string, number>)

  // Calculate user balances
  const userBalances = users.map(user => {
    const userExpenses = expenses
      .filter(expense => expense.paid_by_id === user.user_id)
      .reduce((sum, expense) => sum + Number(expense.amount), 0)
    
    const settlementsOut = settlements
      .filter(settlement => settlement.paid_by === user.user_id)
      .reduce((sum, settlement) => sum + Number(settlement.amount), 0)
    
    const settlementsIn = settlements
      .filter(settlement => settlement.paid_to === user.user_id)
      .reduce((sum, settlement) => sum + Number(settlement.amount), 0)

    const balance = userExpenses - settlementsOut + settlementsIn

    return {
      user_id: user.user_id,
      name: user.name,
      balance,
      totalExpenses: userExpenses,
      settlementsOut,
      settlementsIn
    }
  })

  return {
    totalExpenses,
    totalSettlements,
    expensesByCategory,
    monthlyExpenses,
    userBalances,
    recentExpenses: expenses.slice(0, 5),
    recentSettlements: settlements.slice(0, 5)
  }
} 