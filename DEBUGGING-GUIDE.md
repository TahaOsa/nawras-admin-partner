# 🔍 DEBUGGING GUIDE: Add Expense Functionality

## Quick Debugging Steps

### 1. Check Browser Console
1. Open developer tools (F12)
2. Go to Console tab
3. Try to add an expense
4. Look for error messages

**Expected Debug Output:**
```
[DEBUG] Submitting expense data: {amount: 25.50, category: "Food", ...}
[DEBUG] API Base URL: https://partner.nawrasinchina.com
[DEBUG] Creating expense: {url: "https://partner.nawrasinchina.com/api/expenses", ...}
[DEBUG] Request body: {...}
[DEBUG] API Response: {status: 201, statusText: "Created", ok: true}
[DEBUG] API Success Response: {...}
[DEBUG] Mapped expense: {...}
[DEBUG] Expense created successfully: {...}
```

### 2. Check Network Tab
1. Open developer tools (F12)
2. Go to Network tab
3. Try to add an expense
4. Look for API calls to `/api/expenses`

**Expected Network Call:**
- Method: POST
- URL: `https://partner.nawrasinchina.com/api/expenses`
- Status: 201 Created
- Response: JSON with expense data

### 3. Common Issues & Solutions

#### Issue: "Failed to fetch" or CORS Error
**Cause:** API base URL misconfiguration
**Solution:** Check if `VITE_API_BASE_URL` is correctly set

#### Issue: "404 Not Found"
**Cause:** Wrong API endpoint URL
**Solution:** Verify the endpoint URL in network tab

#### Issue: "500 Internal Server Error"
**Cause:** Server-side error
**Solution:** Check server logs

#### Issue: Form validation errors showing
**Cause:** Client-side validation failing
**Solution:** Check form field values and validation logic

### 4. Manual API Testing
Test the API directly using curl:
```bash
curl -X POST -k https://partner.nawrasinchina.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":25.50,"category":"Food","description":"Test","paid_by_id":"taha","date":"2025-06-06"}'
```

### 5. Environment Variables Check
In browser console, check:
```javascript
console.log('Environment:', {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
});
```

## Files to Deploy
After making changes, run:
```bash
npm run build
npm run deploy
```

This will:
1. Build with production environment variables
2. Commit and push changes to trigger deployment 