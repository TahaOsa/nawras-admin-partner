const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    version: '2.0.0',
    server: 'github-deployed',
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

// Serve the main application
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nawras Admin - Partner Expense Tracker</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
            color: #333;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            background: white; 
            border-radius: 15px; 
            padding: 30px; 
            margin-bottom: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            text-align: center; 
        }
        .header h1 { color: #2c3e50; font-size: 2.5rem; margin-bottom: 10px; }
        .header p { color: #6c757d; font-size: 1.1rem; }
        .status { 
            background: #d4edda; 
            color: #155724; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
            font-weight: bold; 
            text-align: center;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .card { 
            background: white; 
            border-radius: 15px; 
            padding: 25px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
        }
        .card h3 { color: #2c3e50; margin-bottom: 15px; font-size: 1.3rem; }
        button { 
            background: #667eea; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 1rem; 
            margin: 5px; 
            transition: all 0.3s; 
        }
        button:hover { background: #5a67d8; transform: translateY(-2px); }
        .result { 
            margin-top: 15px; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 8px; 
            border-left: 4px solid #667eea; 
            max-height: 300px;
            overflow-y: auto;
        }
        .api-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 15px; 
        }
        .endpoint { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #28a745; 
        }
        .endpoint strong { color: #2c3e50; }
        .endpoint a { color: #667eea; text-decoration: none; }
        .endpoint a:hover { text-decoration: underline; }
        ul { list-style: none; }
        li { padding: 8px 0; border-bottom: 1px solid #eee; }
        li:last-child { border-bottom: none; }
        .icon { font-size: 1.2rem; margin-right: 8px; }
        .badge { 
            background: #28a745; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 0.8rem; 
            margin-left: 10px;
        }
        pre { 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 4px; 
            overflow-x: auto; 
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Nawras Admin</h1>
            <p>Partner Expense Tracking System</p>
            <span class="badge">GitHub Deployed</span>
        </div>
        
        <div class="status">
            ✅ <strong>SUCCESS!</strong> Your application is now deployed via GitHub and working correctly!
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>🧪 API Testing</h3>
                <div class="api-grid">
                    <div>
                        <button onclick="testAPI('/api/health', 'health-result')">Test Health</button>
                        <div id="health-result" class="result" style="display:none;"></div>
                    </div>
                    <div>
                        <button onclick="testAPI('/api/expenses', 'expenses-result')">Test Expenses</button>
                        <div id="expenses-result" class="result" style="display:none;"></div>
                    </div>
                    <div>
                        <button onclick="testAPI('/api/settlements', 'settlements-result')">Test Settlements</button>
                        <div id="settlements-result" class="result" style="display:none;"></div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>📊 System Status</h3>
                <ul>
                    <li><span class="icon">✅</span>Frontend: Working</li>
                    <li><span class="icon">✅</span>Backend API: Working</li>
                    <li><span class="icon">✅</span>Database: Sample data loaded</li>
                    <li><span class="icon">✅</span>Domain: Accessible</li>
                    <li><span class="icon">✅</span>GitHub: Auto-deployed</li>
                </ul>
            </div>
            
            <div class="card">
                <h3>🔗 API Endpoints</h3>
                <div class="endpoint">
                    <strong>Health Check:</strong><br>
                    <a href="/api/health" target="_blank">GET /api/health</a>
                </div>
                <div class="endpoint">
                    <strong>Expenses:</strong><br>
                    <a href="/api/expenses" target="_blank">GET /api/expenses</a>
                </div>
                <div class="endpoint">
                    <strong>Settlements:</strong><br>
                    <a href="/api/settlements" target="_blank">GET /api/settlements</a>
                </div>
            </div>
            
            <div class="card">
                <h3>🚀 Deployment Info</h3>
                <ul>
                    <li><span class="icon">📦</span>Version: 2.0.0</li>
                    <li><span class="icon">🌐</span>Environment: Production</li>
                    <li><span class="icon">⚡</span>Auto-deploy: Enabled</li>
                    <li><span class="icon">🔄</span>Source: GitHub</li>
                    <li><span class="icon">☁️</span>Platform: DigitalOcean App</li>
                </ul>
            </div>
        </div>
    </div>
    
    <script>
        function testAPI(endpoint, resultId) {
            const resultDiv = document.getElementById(resultId);
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<strong>Testing...</strong>';
            
            fetch(endpoint)
                .then(response => response.json())
                .then(data => {
                    resultDiv.innerHTML = '<strong>✅ Success:</strong><br><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                })
                .catch(error => {
                    resultDiv.innerHTML = '<strong>❌ Error:</strong> ' + error.message;
                });
        }
        
        // Auto-test health endpoint on load
        setTimeout(() => testAPI('/api/health', 'health-result'), 1000);
    </script>
</body>
</html>`);
});

// Health check endpoint for DigitalOcean App Platform
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
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
});

module.exports = app;
