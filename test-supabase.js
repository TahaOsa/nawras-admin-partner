import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODY3NTUsImV4cCI6MjA2NDU2Mjc1NX0.iAp-OtmHThl9v0y42Gt9y-FdKQKucocRx874_LmIwuU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    // Test connection by querying a non-existent table (should give predictable error)
    const { data, error } = await supabase.from('test_connection').select('*').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('✅ Connection successful! (Table not found as expected)');
        console.log('📋 Now creating users table...');
        
        // Try to create users table using direct table insert (will fail gracefully if table doesn't exist)
        const { data: users, error: userError } = await supabase
          .from('users')
          .select('*')
          .limit(1);
          
        if (userError && userError.code === '42P01') {
          console.log('❌ Users table does not exist');
          console.log('🛠️  Please create tables manually in Supabase dashboard');
          return false;
        } else if (userError) {
          console.log('❌ Other error:', userError);
          return false;
        } else {
          console.log('✅ Users table exists!');
          console.log('📊 Found users:', users);
          return true;
        }
      } else {
        console.log('❌ Connection error:', error);
        return false;
      }
    } else {
      console.log('✅ Connection successful!');
      return true;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

testConnection(); 