import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client — bypasses Row Level Security (RLS).
 * Use ONLY in server-side code (API routes, server actions).
 * Never import this in client components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
