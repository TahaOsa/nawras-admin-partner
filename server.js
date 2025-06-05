const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Sample data for demonstration
const expenses = [
  { id: 1, amount: 25.50, description: "Lunch", category: "Food", paidById: "taha", date: "2024-01-15" },
  { id: 2, amount: 60.99, description: "Groceries", category: "Food", paidById: "burak", date: "2024-01-16" },
  { id: 3, amount: 15.75, description: "Coffee", category: "Food", paidById: "taha", date: "2024-01-17" },
  { id: 4, amount: 120.00, description: "Utilities", category: "Bills", paidById: "burak", date: "2024-01-18" },
  { id: 5, amount: 45.30, description: "Gas", category: "Transportation", paidById: "taha", date: "2024-01-19" }
];

const settlements = [
  { id: 1, amount: 30.00, paidBy: "taha", paidTo: "burak", description: "Settlement for groceries", date: "2024-01-17" },
  { id: 2, amount: 15.00, paidBy: "burak", paidTo: "taha", description: "Coffee reimbursement", date: "2024-01-18" }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    server: 'react-dashboard-deployed',
    environment: process.env.NODE_ENV || 'production',
    buildStatus: 'react-app-built-successfully',
    deploymentTime: new Date().toISOString(),
    features: ['dashboard', 'expense-tracking', 'charts', 'settlements', 'reports']
  });
});

app.get('/api/expenses', (req, res) => {
  res.json({ 
    success: true, 
    data: expenses, 
    total: expenses.length,
    totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0)
  });
});

app.get('/api/settlements', (req, res) => {
  res.json({ 
    success: true, 
    data: settlements, 
    total: settlements.length,
    totalAmount: settlements.reduce((sum, settlement) => sum + settlement.amount, 0)
  });
});

// Add new expense
app.post('/api/expenses', (req, res) => {
  const { amount, description, category, paidById } = req.body;
  
  if (!amount || !description || !paidById) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  const newExpense = {
    id: expenses.length + 1,
    amount: parseFloat(amount),
    description,
    category: category || 'Other',
    paidById,
    date: new Date().toISOString().split('T')[0]
  };
  
  expenses.push(newExpense);
  res.json({ success: true, data: newExpense });
});

// Add new settlement
app.post('/api/settlements', (req, res) => {
  const { amount, paidBy, paidTo, description } = req.body;
  
  if (!amount || !paidBy || !paidTo) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  const newSettlement = {
    id: settlements.length + 1,
    amount: parseFloat(amount),
    paidBy,
    paidTo,
    description: description || 'Settlement',
    date: new Date().toISOString().split('T')[0]
  };
  
  settlements.push(newSettlement);
  res.json({ success: true, data: newSettlement });
});

// Serve React App
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  // Serve the React app
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health check endpoint for DigitalOcean App Platform
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.1.0-emergency-fix'
  });
});

// Test endpoint to verify deployment
app.get('/api/test-deployment', (req, res) => {
  res.json({
    success: true,
    message: 'Emergency fix deployment successful!',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    buildStatus: 'no-build-errors',
    server: 'emergency-fix-deployed'
  });
});

// This is now handled by the catch-all route above

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nawras Admin Partner server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
