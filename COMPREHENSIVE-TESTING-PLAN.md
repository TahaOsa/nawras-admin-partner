# Comprehensive Testing Plan - Partnership Expense System

## 🎯 Test Objectives
Verify that the 50/50 partnership expense splitting system is working correctly on the live website: **partner.nawrasinchina.com**

## 🔐 Test Users
- **Taha**: `taha@nawrasinchina.com` / Password: `taha2024`
- **Burak**: `burak@nawrasinchina.com` / Password: `burak2024`

## 📋 Test Suite

### **Test 1: Authentication System**
**Objective**: Verify login/logout functionality

**Steps**:
1. Navigate to `https://partner.nawrasinchina.com`
2. Verify login page is displayed
3. Test login with Taha's credentials
4. Verify successful login and redirect to dashboard
5. Verify user info displayed in sidebar
6. Test logout functionality
7. Repeat with Burak's credentials

**Expected Results**:
- ✅ Login page loads correctly
- ✅ Valid credentials allow access
- ✅ User name shown in sidebar
- ✅ Logout returns to login page
- ✅ Protected routes require authentication

### **Test 2: Dashboard Partnership Calculations**
**Objective**: Verify 50/50 partnership logic is working

**Steps**:
1. Login as Taha
2. Navigate to Dashboard
3. Check balance summary cards:
   - Taha's Account (amount paid vs owed)
   - Burak's Account (amount paid vs owed)
   - Partnership Total (combined expenses)
   - Current Balance (who owes whom)

**Expected Results**:
- ✅ Dashboard shows partnership accounting
- ✅ Each partner owes 50% of total expenses
- ✅ Balance = Amount Paid - Amount Owed
- ✅ Correct calculation of who owes whom
- ✅ Professional UI with clear partnership data

### **Test 3: Add Expense Functionality**
**Objective**: Verify expense creation and partnership calculation update

**Steps**:
1. Login as Taha
2. Navigate to Add Expense page
3. Fill out expense form:
   - Amount: $75.00
   - Category: Food
   - Description: "Partnership test lunch"
   - Date: Current date
   - Paid by: Taha
4. Submit expense
5. Verify expense creation success
6. Return to dashboard
7. Verify partnership calculations updated correctly

**Expected Results**:
- ✅ Add expense form loads correctly
- ✅ All fields work properly
- ✅ Expense created successfully
- ✅ Dashboard reflects new expense
- ✅ Partnership balance recalculated
- ✅ Both partners' accounts updated

### **Test 4: Expense History & Tracking**
**Objective**: Verify expense records are maintained

**Steps**:
1. Navigate to Expenses/History page
2. Verify all expenses are listed
3. Check expense details display correctly
4. Verify expenses are NOT auto-deleted
5. Check filtering and sorting functionality

**Expected Results**:
- ✅ All expenses listed chronologically
- ✅ Expense details accurate
- ✅ No automatic deletion
- ✅ Proper categorization
- ✅ Filter/sort functions work

### **Test 5: Settlement System**
**Objective**: Verify settlement is separate from expenses

**Steps**:
1. Navigate to Settlement page
2. Verify current balance displayed
3. Test settlement creation (if available)
4. Verify settlements don't affect expense records
5. Check settlement history

**Expected Results**:
- ✅ Settlement page shows current balance
- ✅ Settlements are separate from expenses
- ✅ Expense records remain intact
- ✅ Settlement history tracked separately

### **Test 6: Charts & Analytics**
**Objective**: Verify partnership data in visualizations

**Steps**:
1. Check dashboard charts
2. Verify category breakdowns
3. Check monthly spending trends
4. Verify user comparison charts

**Expected Results**:
- ✅ Charts display partnership data correctly
- ✅ Category breakdowns accurate
- ✅ Monthly trends show combined data
- ✅ User comparisons show individual contributions

### **Test 7: Cross-User Verification**
**Objective**: Verify data consistency across users

**Steps**:
1. Login as Taha, note balance calculations
2. Logout and login as Burak
3. Verify same balance data shown
4. Add expense as Burak
5. Verify both users see updated calculations

**Expected Results**:
- ✅ Same data shown to both users
- ✅ Real-time updates across sessions
- ✅ Consistent partnership calculations
- ✅ Proper expense attribution

### **Test 8: API Endpoints**
**Objective**: Verify backend partnership calculations

**API Tests**:
```bash
# Test dashboard API
curl -k https://partner.nawrasinchina.com/api/dashboard

# Test expense creation
curl -X POST -k https://partner.nawrasinchina.com/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount":50,"category":"Food","description":"API test","paid_by_id":"taha","date":"2025-06-06"}'

# Test expense retrieval
curl -k https://partner.nawrasinchina.com/api/expenses
```

**Expected Results**:
- ✅ Dashboard API returns partnership balance data
- ✅ Expense creation works via API
- ✅ Balance calculations include new partnership fields
- ✅ All endpoints respond correctly

## 🧮 Partnership Logic Verification

**Example Calculation Test**:
- Total Expenses: $400
- Taha Paid: $180
- Burak Paid: $220
- Each Partner Owes: $200 (50% of $400)
- Taha Balance: $180 - $200 = -$20 (debt)
- Burak Balance: $220 - $200 = +$20 (credit)
- **Result**: Taha owes Burak $20

## 🚨 Critical Issues to Watch For

1. **Incorrect Balance Calculation**: Old simple balance vs new partnership logic
2. **Expense Auto-Deletion**: Expenses should NEVER be auto-deleted
3. **Settlement Interference**: Settlements should not affect expense records
4. **Authentication Bypass**: All pages should require login
5. **Data Inconsistency**: Both users should see identical data
6. **API Errors**: All endpoints should respond correctly

## 📊 Success Criteria

- ✅ All 8 test scenarios pass
- ✅ Partnership 50/50 logic working correctly
- ✅ No critical issues found
- ✅ Professional UI/UX maintained
- ✅ Data integrity preserved
- ✅ Industry standards followed (like Splitwise)

## 🔄 Automated Testing Script

If Browserbase MCP becomes available, create automated test script:
1. Authentication flow testing
2. Dashboard verification
3. Expense creation and verification
4. Partnership calculation validation
5. Cross-user data consistency
6. Settlement system isolation 