"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Using the service role key to bypass RLS and access the admin auth API
// Function to get admin client inside actions, preventing top-level crashes if env vars are missing
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error("Missing Supabase URL or Service Role Key in environment variables");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function checkIsSuperAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé : Utilisateur non connecté.");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'SUPER_ADMIN') {
    throw new Error("Non autorisé : Seul un SUPER_ADMIN peut effectuer cette action.");
  }
  
  return user;
}

export async function createUser(data: any) {
  await checkIsSuperAdmin();
  
  const { email, password, full_name, role } = data;
  
  // Create user in Auth
  const { data: userData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  });
  
  if (authError) throw new Error(authError.message);
  
  // The trigger handle_new_user automatically creates the profile with role 'ADMIN'.
  // If we need it to be 'SUPER_ADMIN', we update it.
  if (role === 'SUPER_ADMIN') {
    const { error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .update({ role: 'SUPER_ADMIN' })
      .eq('id', userData.user.id);
      
    if (profileError) throw new Error(profileError.message);
  }
  
  return { success: true };
}

export async function updateUser(userId: string, data: any) {
  const currentUser = await checkIsSuperAdmin();
  
  const { full_name, role, password } = data;
  
  // Prevent changing own role or demoting the last super admin
  if (currentUser.id === userId && role === 'ADMIN') {
    // Check if there are other super admins
    const { data: superAdmins, error: countError } = await getSupabaseAdmin()
      .from('profiles')
      .select('id')
      .eq('role', 'SUPER_ADMIN');
      
    if (!countError && superAdmins && superAdmins.length <= 1) {
      throw new Error("Vous ne pouvez pas retirer le rôle SUPER_ADMIN au dernier SUPER_ADMIN.");
    }
  }
  
  // Update Auth password if provided
  if (password && password.trim() !== '') {
    const { error: authError } = await getSupabaseAdmin().auth.admin.updateUserById(userId, {
      password
    });
    if (authError) throw new Error(authError.message);
  }
  
  // Update Profile
  const { error: profileError } = await getSupabaseAdmin()
    .from('profiles')
    .update({ 
      full_name, 
      role,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (profileError) throw new Error(profileError.message);
  
  return { success: true };
}

export async function deleteUser(userId: string) {
  const currentUser = await checkIsSuperAdmin();
  
  if (currentUser.id === userId) {
    throw new Error("Vous ne pouvez pas vous supprimer vous-même.");
  }
  
  const { data: profile } = await getSupabaseAdmin().from('profiles').select('role').eq('id', userId).single();
  
  if (profile && profile.role === 'SUPER_ADMIN') {
    const { data: superAdmins } = await getSupabaseAdmin().from('profiles').select('id').eq('role', 'SUPER_ADMIN');
    if (superAdmins && superAdmins.length <= 1) {
      throw new Error("Vous ne pouvez pas supprimer le dernier SUPER_ADMIN.");
    }
  }
  
  const { error: authError } = await getSupabaseAdmin().auth.admin.deleteUser(userId);
  if (authError) throw new Error(authError.message);
  
  return { success: true };
}
