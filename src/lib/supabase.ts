import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODY3NTUsImV4cCI6MjA2NDU2Mjc1NX0.iAp-OtmHThl9v0y42Gt9y-FdKQKucocRx874_LmIwuU'

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