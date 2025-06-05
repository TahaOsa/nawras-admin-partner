# 🚀 Supabase Integration Setup Guide

## Project Details
- **Project Name**: nawras-admin-expense-tracker  
- **Project ID**: khsdtnhjvgucpgybadki
- **Project URL**: https://khsdtnhjvgucpgybadki.supabase.co

## 📋 Setup Steps

### 1. Get Your Supabase Keys
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project: `nawras-admin-expense-tracker`
3. Go to **Settings** → **API**
4. Copy these values:
   - **URL**: `https://khsdtnhjvgucpgybadki.supabase.co`
   - **anon public key**: `eyJhbGci...` (starts with eyJ)

### 2. Update Supabase Configuration
1. Open `src/lib/supabase.ts`
2. Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

### 3. Set up Database Schema
1. Go to your Supabase project dashboard
2. Click **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Click **Run**

### 4. Create Sample Data (Optional)
After running the schema, you can add sample expenses:

```sql
-- First, get the user IDs
SELECT id, email, name FROM users WHERE email IN ('taha@nawrasinchina.com', 'burak@nawrasinchina.com');

-- Insert sample expenses (replace the UUID values with actual user IDs from above)
INSERT INTO expenses (amount, description, category, paid_by_id, date) VALUES 
    (25.50, 'Lunch', 'Food', 'TAHA_UUID_HERE', '2024-01-15'),
    (60.99, 'Groceries', 'Food', 'BURAK_UUID_HERE', '2024-01-16'),
    (15.75, 'Coffee', 'Food', 'TAHA_UUID_HERE', '2024-01-17'),
    (120.00, 'Utilities', 'Bills', 'BURAK_UUID_HERE', '2024-01-18'),
    (45.30, 'Gas', 'Transportation', 'TAHA_UUID_HERE', '2024-01-19');
```

### 5. Update Backend to Use Supabase
The backend will need to be updated to use the Supabase service instead of mock data.

### 6. Environment Variables for Production
Add these environment variables to DigitalOcean:

```env
SUPABASE_URL=https://khsdtnhjvgucpgybadki.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## 🔧 Testing the Connection

After setup, you can test the connection by running:

```javascript
// In browser console on your site
import { supabase } from './src/lib/supabase.js';
const { data, error } = await supabase.from('users').select('*');
console.log(data, error);
```

## 📊 Database Structure

### Tables Created:
- **users**: Stores Taha and Burak's information
- **expenses**: All expense records with categories and amounts
- **settlements**: Payment settlements between users

### Features Included:
- ✅ UUID primary keys
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamps
- ✅ Data validation

## 🎯 Next Steps

1. **Complete the setup above**
2. **Test database connection**
3. **Update backend API to use Supabase**
4. **Deploy updated version**

## 🆘 Troubleshooting

### Common Issues:
- **Connection Error**: Check if anon key is correct
- **Table Not Found**: Ensure schema was run successfully
- **Permission Denied**: Verify RLS policies are set up correctly

### Getting Help:
- Check Supabase logs in the dashboard
- Verify API keys are not expired
- Ensure project ID matches 