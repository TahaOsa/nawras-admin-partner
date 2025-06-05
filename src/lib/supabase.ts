import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // You'll need to get this from your Supabase project

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be generated/updated as we build the schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          amount: number
          description: string
          category: string
          paid_by_id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          category: string
          paid_by_id: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          category?: string
          paid_by_id?: string
          date?: string
          created_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          amount: number
          paid_by_id: string
          paid_to_id: string
          description: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          amount: number
          paid_by_id: string
          paid_to_id: string
          description?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          amount?: number
          paid_by_id?: string
          paid_to_id?: string
          description?: string | null
          date?: string
          created_at?: string
        }
      }
    }
  }
} 