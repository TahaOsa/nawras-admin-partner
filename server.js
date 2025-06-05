import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

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
    version: '11.0.0',
    server: 'clean-api-server',
    environment: process.env.NODE_ENV || 'production'
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

app.get('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === id);
  
  if (!expense) {
    return res.status(404).json({ success: false, error: 'Expense not found' });
  }
  
  res.json({ success: true, data: expense });
});

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

app.put('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const expenseIndex = expenses.findIndex(e => e.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ success: false, error: 'Expense not found' });
  }
  
  const { amount, description, category, paidById } = req.body;
  
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    amount: amount ? parseFloat(amount) : expenses[expenseIndex].amount,
    description: description || expenses[expenseIndex].description,
    category: category || expenses[expenseIndex].category,
    paidById: paidById || expenses[expenseIndex].paidById
  };
  
  res.json({ success: true, data: expenses[expenseIndex] });
});

app.delete('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const expenseIndex = expenses.findIndex(e => e.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ success: false, error: 'Expense not found' });
  }
  
  expenses.splice(expenseIndex, 1);
  res.json({ success: true, message: 'Expense deleted' });
});

app.get('/api/settlements', (req, res) => {
  res.json({ 
    success: true, 
    data: settlements, 
    total: settlements.length,
    totalAmount: settlements.reduce((sum, settlement) => sum + settlement.amount, 0)
  });
});

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

// Auth endpoints (simple mock implementation)
app.post('/api/auth/sign-in', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  const validUsers = {
    'taha@nawrasinchina.com': { password: 'taha2024', name: 'Taha', id: 'taha' },
    'burak@nawrasinchina.com': { password: 'burak2024', name: 'Burak', id: 'burak' }
  };
  
  const user = validUsers[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  const session = {
    id: `session_${Date.now()}`,
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    user: {
      id: user.id,
      email,
      name: user.name,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
  
  res.json({ success: true, data: { user: session.user, session } });
});

app.post('/api/auth/sign-out', (req, res) => {
  res.json({ success: true, message: 'Signed out successfully' });
});

app.get('/api/auth/session', (req, res) => {
  // For demo purposes, return null (no active session)
  // In real app, this would check session tokens/cookies
  res.json({ success: true, data: null });
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '11.0.0'
  });
});

// Serve React App for all other routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  // Serve the React app for all other routes
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Nawras Admin Partner server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 React app: http://localhost:${PORT}`);
});

export default app;
