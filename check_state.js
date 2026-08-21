const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const extractEnv = (key) => {
  const match = envFile.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = extractEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = extractEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkState() {
  console.log('--- Checking auth.users (via admin API) ---');
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching users:', authError.message);
  } else {
    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(` - ID: ${u.id}, Email: ${u.email}`));
  }

  console.log('\n--- Checking public.profiles ---');
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('*');
  if (profileError) {
    console.error('Error fetching profiles:', profileError.message);
  } else {
    console.log(`Found ${profiles.length} profiles.`);
    profiles.forEach(p => console.log(` - ID: ${p.id}, Email: ${p.email}, Role: ${p.role}`));
  }
}

checkState();
