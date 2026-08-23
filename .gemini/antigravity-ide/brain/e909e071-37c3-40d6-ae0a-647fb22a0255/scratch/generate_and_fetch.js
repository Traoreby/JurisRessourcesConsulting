const { createClient } = require('@supabase/supabase-js');

async function testHash() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const email = 'test_hash_parser_' + Date.now() + '@example.com';
  
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email: email,
    options: {
      redirectTo: 'http://localhost:3001/auth/callback?next=/admin/update-password',
      data: { full_name: 'Test', requires_password_update: true }
    }
  });
  
  if (error) {
    console.error('Error generating link:', error);
    return;
  }
  
  const https = require('https');
  const url = new URL(data.properties.action_link);
  
  const req = https.get(url, (res) => {
    const redirectLocation = res.headers.location;
    console.log('Redirect Location:', redirectLocation);
  });
  
  req.on('error', (e) => {
    console.error(e);
  });
}

testHash();
