const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLink() {
  const email = 'test_generate_link_' + Date.now() + '@example.com';
  
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email: email,
    options: {
      redirectTo: 'https://www.jrcsarl.com/auth/callback?next=/admin/update-password',
      data: { full_name: 'Test', requires_password_update: true }
    }
  });
  
  if (error) {
    console.error('Error generating link:', error);
  } else {
    console.log('Generated Link properties:');
    console.log(data.properties);
  }
}

checkLink();
