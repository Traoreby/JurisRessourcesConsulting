const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testWorkflow() {
  const email = 'test_invite_' + Date.now() + '@example.com';
  console.log(`1. Creation of user via inviteUserByEmail: ${email}`);
  
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: 'Test Invite' }
  });
  
  if (inviteError) {
    console.error('Error inviting user:', inviteError);
    return;
  }
  
  console.log('User created:', inviteData.user.id);
  
  // Wait a sec for the trigger to insert the profile
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('2. Checking if profile is created with role ADMIN');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', inviteData.user.id).single();
  console.log('Profile:', profile);
  
  console.log('3. Checking user confirmed_at status');
  const { data: authData } = await supabase.auth.admin.listUsers();
  const createdUser = authData.users.find(u => u.id === inviteData.user.id);
  console.log('Confirmed At:', createdUser?.confirmed_at);
  
  console.log('4. Cleaning up test user');
  await supabase.auth.admin.deleteUser(inviteData.user.id);
  console.log('Cleanup complete.');
}

testWorkflow();
