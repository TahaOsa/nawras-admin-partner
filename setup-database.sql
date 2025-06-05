-- Nawras Admin Database Setup
-- Copy and paste this into Supabase SQL Editor and run it

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settlements table
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10,2) NOT NULL,
    paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    paid_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert users
INSERT INTO users (email, name) VALUES 
    ('taha@nawrasinchina.com', 'Taha'),
    ('burak@nawrasinchina.com', 'Burak');

-- Get user IDs for sample data
DO $$
DECLARE
    taha_id UUID;
    burak_id UUID;
BEGIN
    SELECT id INTO taha_id FROM users WHERE email = 'taha@nawrasinchina.com';
    SELECT id INTO burak_id FROM users WHERE email = 'burak@nawrasinchina.com';
    
    -- Insert sample expenses
    INSERT INTO expenses (amount, description, category, paid_by_id, date) VALUES 
        (25.50, 'Lunch', 'Food', taha_id, '2024-01-15'),
        (60.99, 'Groceries', 'Food', burak_id, '2024-01-16'),
        (15.75, 'Coffee', 'Food', taha_id, '2024-01-17'),
        (120.00, 'Utilities', 'Bills', burak_id, '2024-01-18'),
        (45.30, 'Gas', 'Transportation', taha_id, '2024-01-19');
END $$; 