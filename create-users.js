// Script to create the two users in Supabase Auth
// This will create Taha and Burak accounts automatically

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://khsdtnhjvgucpgybadki.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY_HERE'; // You need to get this from Supabase dashboard

// Create admin client (you'll need service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUsers() {
  console.log('🔐 Creating users in Supabase Auth...\n');

  const users = [
    {
      email: 'taha@nawrasinchina.com',
      password: 'taha2024',
      name: 'Taha'
    },
    {
      email: 'burak@nawrasinchina.com', 
      password: 'burak2024',
      name: 'Burak'
    }
  ];

  for (const user of users) {
    console.log(`👤 Creating user: ${user.name} (${user.email})...`);
    
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          name: user.name
        }
      });

      if (error) {
        console.log(`❌ Failed to create ${user.name}: ${error.message}`);
      } else {
        console.log(`✅ Successfully created ${user.name}!`);
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   Email: ${data.user.email}`);
        console.log(`   Status: ${data.user.email_confirmed_at ? 'Confirmed' : 'Pending'}`);
      }
      
    } catch (err) {
      console.log(`❌ Unexpected error creating ${user.name}: ${err.message}`);
    }
    
    console.log('');
  }

  console.log('✅ User creation completed!');
  console.log('\n🔍 You can now check the Supabase Auth dashboard to see the users.');
  console.log('🌐 Test login at: https://partner.nawrasinchina.com/');
}

// Instructions for getting the service role key
console.log('📋 INSTRUCTIONS:');
console.log('1. Go to https://supabase.com/dashboard/project/khsdtnhjvgucpgybadki/settings/api');
console.log('2. Copy the "service_role" key (not the anon key)');
console.log('3. Replace YOUR_SERVICE_ROLE_KEY_HERE in this file with that key');
console.log('4. Run: node create-users.js');
console.log('');

// Check if service key is set
if (supabaseServiceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.log('⚠️  Please set your service role key first!');
  console.log('   Edit this file and replace YOUR_SERVICE_ROLE_KEY_HERE with your actual service role key.');
  process.exit(1);
}

// Run the creation
createUsers().catch(console.error); 