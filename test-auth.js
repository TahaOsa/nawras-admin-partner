// Test script to verify Supabase authentication setup
// Run this after creating users to test login functionality

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoc2R0bmhqdmd1Y3BneWJhZGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODY3NTUsImV4cCI6MjA2NDU2Mjc1NX0.iAp-OtmHThl9v0y42Gt9y-FdKQKucocRx874_LmIwuU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🔐 Testing Supabase Authentication...\n');

  // Test users
  const users = [
    { email: 'taha@nawrasinchina.com', password: 'taha2024', name: 'Taha' },
    { email: 'burak@nawrasinchina.com', password: 'burak2024', name: 'Burak' }
  ];

  for (const user of users) {
    console.log(`📧 Testing login for ${user.name} (${user.email})...`);
    
    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (error) {
        console.log(`❌ Login failed for ${user.name}: ${error.message}`);
        console.log(`   Possible issues:`);
        console.log(`   - User not created in Supabase Auth`);
        console.log(`   - User not confirmed`);
        console.log(`   - Wrong password`);
        console.log('');
        continue;
      }

      console.log(`✅ Login successful for ${user.name}!`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Last sign in: ${data.user.last_sign_in_at}`);

      // Test sign out
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.log(`⚠️  Sign out error: ${signOutError.message}`);
      } else {
        console.log(`✅ Sign out successful for ${user.name}`);
      }
      
      console.log('');
      
    } catch (err) {
      console.log(`❌ Unexpected error for ${user.name}: ${err.message}`);
      console.log('');
    }
  }

  console.log('🎯 Authentication test completed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. If any tests failed, create those users in Supabase Dashboard');
  console.log('2. Test the login page at https://partner.nawrasinchina.com/');
  console.log('3. Test Add Expense functionality');
}

// Run the test
testAuth().catch(console.error); 