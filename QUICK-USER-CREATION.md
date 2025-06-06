# 🚀 QUICK USER CREATION GUIDE

You're right - the users don't exist yet! Here are **3 easy methods** to create them:

---

## 🎯 **METHOD 1: Supabase Dashboard (EASIEST)**

### Step-by-Step:
1. **Go to**: https://supabase.com/dashboard/project/khsdtnhjvgucpgybadki/auth/users
2. **Click**: "Add user" button  
3. **Create Taha**:
   - Email: `taha@nawrasinchina.com`
   - Password: `taha2024`
   - Auto Confirm User: ✅ **CHECK THIS BOX**
   - Click "Add user"
4. **Create Burak**:
   - Email: `burak@nawrasinchina.com` 
   - Password: `burak2024`
   - Auto Confirm User: ✅ **CHECK THIS BOX**
   - Click "Add user"

### ⚠️ **IMPORTANT**: Make sure to check "Auto Confirm User" so they can login immediately!

---

## 🎯 **METHOD 2: SQL Script (FAST)**

1. **Go to**: https://supabase.com/dashboard/project/khsdtnhjvgucpgybadki/sql/new
2. **Copy and paste** the contents of `create-users.sql`
3. **Click "Run"**
4. Should see "2 rows inserted" message

---

## 🎯 **METHOD 3: Node.js Script (AUTOMATED)**

1. **Edit** `create-users.js` file
2. **Get Service Role Key**:
   - Go to: https://supabase.com/dashboard/project/khsdtnhjvgucpgybadki/settings/api
   - Copy the "service_role" key (the long one, not anon)
   - Replace `YOUR_SERVICE_ROLE_KEY_HERE` in the file
3. **Run**: `node create-users.js`

---

## ✅ **VERIFICATION**

After creating users, check:

1. **Supabase Dashboard**: Should see 2 users in Auth > Users
2. **Test Login**: Go to https://partner.nawrasinchina.com/
   - Try: `taha@nawrasinchina.com` / `taha2024`
   - Try: `burak@nawrasinchina.com` / `burak2024`

---

## 🔍 **IF USERS STILL DON'T APPEAR**

- Refresh the Supabase Auth page
- Check that you're in the right project (`khsdtnhjvgucpgybadki`)
- Make sure "Auto Confirm User" was checked
- Check browser console for any errors

---

## 🎉 **RECOMMENDATION**

**Use METHOD 1** (Dashboard) - it's the easiest and most reliable! Just make sure to check the "Auto Confirm User" checkbox.

Once you see the 2 users in the Supabase Auth dashboard, your app will be fully functional! 🚀 