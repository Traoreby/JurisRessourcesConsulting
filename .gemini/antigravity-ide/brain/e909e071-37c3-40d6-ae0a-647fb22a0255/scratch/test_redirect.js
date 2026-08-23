const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLink() {
  const email = 'test_redirect_format_' + Date.now() + '@example.com';
  
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
    return;
  }
  
  console.log('Action Link:', data.properties.action_link);
  
  // Follow the redirect to see where Supabase sends us
  const https = require('https');
  const url = new URL(data.properties.action_link);
  
  const req = https.get(url, (res) => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Redirect Location:', res.headers.location);
  });
  
  req.on('error', (e) => {
    console.error(e);
  });
}

checkLink();
