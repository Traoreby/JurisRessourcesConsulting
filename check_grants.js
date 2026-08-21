const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const extractEnv = (key) => {
  const match = envFile.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};
const supabase = createClient(extractEnv('NEXT_PUBLIC_SUPABASE_URL'), extractEnv('SUPABASE_SERVICE_ROLE_KEY'));

async function checkGrants() {
  const query = `
    SELECT grantee, privilege_type 
    FROM information_schema.role_table_grants 
    WHERE table_name = 'profiles' AND table_schema = 'public';
  `;
  // We can't run raw SQL directly with supabase-js unless we use postgres connection
  // Instead, let's create a temporary RPC to run this
}
