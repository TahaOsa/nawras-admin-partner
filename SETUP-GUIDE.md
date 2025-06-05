# 🚀 Nawras Admin Partner - Complete Setup Guide

## **Overview**
Expense tracking application for Taha & Burak with React frontend, Express backend, and Supabase database.

---

## **🔧 OPTION 1: Automated Setup (Recommended)**

### **Step 1: Database Setup via Supabase Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `nawras-admin-expense-tracker` (ID: `khsdtnhjvgucpgybadki`)
3. Navigate to **SQL Editor**
4. Copy and paste the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
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
    ('burak@nawrasinchina.com', 'Burak')
ON CONFLICT (email) DO NOTHING;

-- Insert sample expenses
WITH user_ids AS (
    SELECT 
        (SELECT id FROM users WHERE email = 'taha@nawrasinchina.com') as taha_id,
        (SELECT id FROM users WHERE email = 'burak@nawrasinchina.com') as burak_id
)
INSERT INTO expenses (amount, description, category, paid_by_id, date)
SELECT * FROM (
    VALUES 
        (25.50, 'Lunch', 'Food', (SELECT taha_id FROM user_ids), '2024-01-15'),
        (60.99, 'Groceries', 'Food', (SELECT burak_id FROM user_ids), '2024-01-16'),
        (15.75, 'Coffee', 'Food', (SELECT taha_id FROM user_ids), '2024-01-17'),
        (120.00, 'Utilities', 'Bills', (SELECT burak_id FROM user_ids), '2024-01-18'),
        (45.30, 'Gas', 'Transportation', (SELECT taha_id FROM user_ids), '2024-01-19')
) AS v(amount, description, category, paid_by_id, date);
```

5. Click **Run** to execute

### **Step 2: Application Setup**
```bash
npm install
npm run build
npm start
```

### **Step 3: Verify Setup**
- **Local Development**: http://localhost:8080
- **Production**: https://nawras-admins-khsdtnhjvgucpgybadki.ondigitalocean.app/

---

## **🔧 OPTION 2: Quick Deploy Only**

If database already exists, just deploy:

```bash
npm run deploy
```

This will:
- Add all changes to git
- Commit with "Deploy update" message  
- Push to GitHub
- Auto-trigger DigitalOcean deployment

---

## **📊 Project Architecture**

```
Frontend (React + TypeScript + Vite)
    ↓ API calls  
Backend (Express + ES Modules)
    ↓ Supabase client
Database (Supabase PostgreSQL)
    ↓ Auto-deployment
Production (DigitalOcean App Platform)
```

---

## **🔑 Configuration Details**

### **Supabase Project**
- **Project Name**: nawras-admin-expense-tracker
- **Project ID**: khsdtnhjvgucpgybadki
- **URL**: https://khsdtnhjvgucpgybadki.supabase.co
- **Region**: US East (default)

### **DigitalOcean App**
- **App Name**: nawras-admins
- **Port**: 8080
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm start`
- **Environment**: Production

### **GitHub Repository**
- **Repo**: nawras-admin-partner
- **Auto-Deploy**: ✅ Enabled
- **Branch**: main

---

## **🗃️ Database Schema**

### **users table**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
email VARCHAR(255) UNIQUE NOT NULL
name VARCHAR(255) NOT NULL
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### **expenses table**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
amount DECIMAL(10,2) NOT NULL
description TEXT NOT NULL
category VARCHAR(100) NOT NULL
paid_by_id UUID NOT NULL REFERENCES users(id)
date DATE NOT NULL
created_at TIMESTAMPTZ DEFAULT NOW()
```

### **settlements table**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
amount DECIMAL(10,2) NOT NULL
paid_by_id UUID NOT NULL REFERENCES users(id)
paid_to_id UUID NOT NULL REFERENCES users(id)
description TEXT
date DATE NOT NULL
created_at TIMESTAMPTZ DEFAULT NOW()
```

---

## **🔍 Troubleshooting**

### **Common Issues**

1. **"Failed to load expenses"**
   - Check if database tables exist in Supabase
   - Run the SQL setup script above

2. **Port 8080 already in use**
   ```bash
   # Kill any process using port 8080
   npx kill-port 8080
   npm start
   ```

3. **Build fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### **Verify Setup**
```bash
# Test backend health
curl http://localhost:8080/api/health

# Test expenses endpoint
curl http://localhost:8080/api/expenses
```

---

## **📝 Quick Commands**

```bash
# Development
npm run dev          # Start frontend dev server (port 5173)
npm run server       # Start backend only (port 8080)

# Production
npm run build        # Build for production
npm start            # Start production server
npm run deploy       # Deploy to production

# Utilities
npm run setup-db     # Show database setup instructions
```

---

## **✅ Success Checklist**

- [ ] Supabase database tables created
- [ ] Sample data inserted
- [ ] `npm run build` succeeds
- [ ] `npm start` runs without errors
- [ ] Local app loads at http://localhost:8080
- [ ] Production app loads successfully
- [ ] Expense data displays correctly
- [ ] Add expense functionality works

---

**🎯 You're all set! The app should now be fully functional both locally and in production.** 