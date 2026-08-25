import "server-only";

import { getSupabasePublicEnv } from "./public";

function requireServerEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseAdminEnv() {
  return {
    ...getSupabasePublicEnv(),
    supabaseServiceRoleKey: requireServerEnv(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY"
    ),
  };
}
