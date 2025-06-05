-- Nawras Admin Expense Tracker Database Schema
-- Project: khsdtnhjvgucpgybadki

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    paid_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample users (Taha and Burak)
INSERT INTO users (id, email, name) VALUES 
    ('taha-uuid-placeholder', 'taha@nawrasinchina.com', 'Taha'),
    ('burak-uuid-placeholder', 'burak@nawrasinchina.com', 'Burak')
ON CONFLICT (email) DO NOTHING;

-- Get actual UUIDs for the sample data (run this separately to get the actual IDs)
-- SELECT id, email, name FROM users WHERE email IN ('taha@nawrasinchina.com', 'burak@nawrasinchina.com');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by_id ON expenses(paid_by_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_settlements_paid_by_id ON settlements(paid_by_id);
CREATE INDEX IF NOT EXISTS idx_settlements_paid_to_id ON settlements(paid_to_id);
CREATE INDEX IF NOT EXISTS idx_settlements_date ON settlements(date);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Policies (basic - can be enhanced later with proper auth)
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON settlements FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating updated_at on users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 