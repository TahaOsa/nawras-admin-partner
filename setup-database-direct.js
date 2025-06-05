import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4Njc1NSwiZXhwIjoyMDY0NTYyNzU1fQ.iU85jP7cXz8DsF9RgroSB6qIX5x1KzUqW0n5zBcNvBA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLDirect(sql) {
  try {
    console.log(`📝 Executing: ${sql.substring(0, 50)}...`);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ SQL execution failed: ${error}`);
      return false;
    }

    const result = await response.json();
    console.log(`✅ SQL executed successfully`);
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function setupDatabaseDirect() {
  console.log('🚀 Setting up database via direct API calls...');
  
  // Step 1: Create users table
  const createUsersSQL = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  await executeSQLDirect(createUsersSQL);

  // Step 2: Create expenses table
  const createExpensesSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  await executeSQLDirect(createExpensesSQL);

  // Step 3: Create settlements table
  const createSettlementsSQL = `
    CREATE TABLE IF NOT EXISTS settlements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        amount DECIMAL(10,2) NOT NULL,
        paid_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        paid_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  await executeSQLDirect(createSettlementsSQL);

  // Step 4: Insert sample users
  console.log('👥 Creating sample users...');
  
  try {
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .in('email', ['taha@nawrasinchina.com', 'burak@nawrasinchina.com']);

    if (!existingUsers || existingUsers.length === 0) {
      const { data: newUsers, error: userInsertError } = await supabase
        .from('users')
        .insert([
          { email: 'taha@nawrasinchina.com', name: 'Taha' },
          { email: 'burak@nawrasinchina.com', name: 'Burak' }
        ])
        .select();

      if (userInsertError) {
        console.error('❌ Error creating users:', userInsertError);
        return;
      }

      console.log('✅ Users created:', newUsers.map(u => u.name).join(', '));

      // Step 5: Insert sample expenses
      console.log('💰 Creating sample expenses...');
      const taha = newUsers.find(u => u.email === 'taha@nawrasinchina.com');
      const burak = newUsers.find(u => u.email === 'burak@nawrasinchina.com');

      const { error: expenseInsertError } = await supabase
        .from('expenses')
        .insert([
          { amount: 25.50, description: 'Lunch', category: 'Food', paid_by_id: taha.id, date: '2024-01-15' },
          { amount: 60.99, description: 'Groceries', category: 'Food', paid_by_id: burak.id, date: '2024-01-16' },
          { amount: 15.75, description: 'Coffee', category: 'Food', paid_by_id: taha.id, date: '2024-01-17' },
          { amount: 120.00, description: 'Utilities', category: 'Bills', paid_by_id: burak.id, date: '2024-01-18' },
          { amount: 45.30, description: 'Gas', category: 'Transportation', paid_by_id: taha.id, date: '2024-01-19' }
        ]);

      if (expenseInsertError) {
        console.error('❌ Error creating sample expenses:', expenseInsertError);
      } else {
        console.log('✅ Sample expenses created');
      }
    } else {
      console.log('✅ Users already exist, skipping user creation');
    }

    // Step 6: Verify setup
    console.log('🔍 Verifying setup...');
    const { data: users } = await supabase.from('users').select('*');
    const { data: expenses } = await supabase.from('expenses').select('*');
    
    console.log(`✅ Setup complete!`);
    console.log(`   📊 Users: ${users?.length || 0}`);
    console.log(`   💰 Expenses: ${expenses?.length || 0}`);
    console.log(`   🌐 Database URL: ${supabaseUrl}`);
    console.log(`   🎯 Ready for production!`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabaseDirect(); 