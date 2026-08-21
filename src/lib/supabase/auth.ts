import { createClient } from "./server";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile(): Promise<AdminProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;
  return profile as AdminProfile;
}

export async function isSuperAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "SUPER_ADMIN";
}
