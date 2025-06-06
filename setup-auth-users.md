# 🔐 SUPABASE AUTH USERS SETUP GUIDE

## 👥 **USERS TO CREATE**

Based on your existing database, you need to create these two users in Supabase Auth:

### **User 1: Taha**
- **Email**: `taha@nawrasinchina.com`
- **Password**: `taha2024`
- **Name**: Taha

### **User 2: Burak**  
- **Email**: `burak@nawrasinchina.com`
- **Password**: `burak2024`
- **Name**: Burak

---

## 🛠️ **SETUP METHODS**

### **METHOD 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/projects
   - Select your project: `khsdtnhjvgucpgybadki`

2. **Navigate to Authentication**:
   - Click "Authentication" in the sidebar
   - Click "Users" tab

3. **Create User 1 (Taha)**:
   - Click "Add user" button
   - Fill in:
     - Email: `taha@nawrasinchina.com`
     - Password: `taha2024`
     - Confirm password: `taha2024`
   - Click "Add user"

4. **Create User 2 (Burak)**:
   - Click "Add user" button again
   - Fill in:
     - Email: `burak@nawrasinchina.com`
     - Password: `burak2024`
     - Confirm password: `burak2024`
   - Click "Add user"

5. **Verify Users**:
   - Both users should appear in the users list
   - Make sure their status is "Confirmed"

---

### **METHOD 2: SQL Commands (Alternative)**

If you prefer SQL, you can run these in the Supabase SQL Editor:

```sql
-- Create Taha user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
) VALUES (
  gen_random_uuid(),
  'taha@nawrasinchina.com',
  crypt('taha2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Taha"}',
  '{}'
);

-- Create Burak user  
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data
) VALUES (
  gen_random_uuid(),
  'burak@nawrasinchina.com',
  crypt('burak2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Burak"}',
  '{}'
);
```

---

## ✅ **VERIFICATION STEPS**

After creating the users, test the authentication:

### **Test 1: Login as Taha**
1. Go to: https://partner.nawrasinchina.com/
2. You should see the login page
3. Enter:
   - Email: `taha@nawrasinchina.com`
   - Password: `taha2024`
4. Click "Sign In"
5. Should redirect to dashboard

### **Test 2: Login as Burak**
1. Sign out from Taha's account
2. Enter:
   - Email: `burak@nawrasinchina.com`
   - Password: `burak2024`
3. Click "Sign In"
4. Should redirect to dashboard

### **Test 3: Test Add Expense**
1. While logged in, try adding an expense
2. Should work without API errors
3. Check if expense appears in database

---

## 🔧 **TROUBLESHOOTING**

### **If Login Fails:**
- Check browser console for errors
- Verify users exist in Supabase Auth dashboard
- Ensure passwords are correct
- Check that users are "Confirmed" status

### **If API Errors Occur:**
- Check browser console for API calls
- Verify Supabase connection
- Test API endpoints manually

### **Common Issues:**
- **"Invalid login credentials"**: User doesn't exist or wrong password
- **"Email not confirmed"**: User needs to be confirmed in dashboard
- **"Too many requests"**: Wait and try again

---

## 📋 **NEXT STEPS AFTER SETUP**

1. ✅ Create both users in Supabase Auth
2. ✅ Test login functionality
3. ✅ Test Add Expense feature
4. ✅ Test all app functionality
5. ✅ Verify user session persistence
6. ✅ Test sign out functionality

Once these users are created, your authentication system will be fully operational! 