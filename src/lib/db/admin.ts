import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Trusted server-only Supabase client using the secret key. Bypasses RLS
 * entirely — full database access. Reserve for operations that genuinely
 * need it (the publish → revalidate → re-index pipeline, seed scripts,
 * scheduled jobs, and `rate_limit_events` reads/writes — that table has
 * zero public RLS policies by design, so this is the only client that can
 * touch it at all). Never import this into a Client Component; the
 * `server-only` import makes that a build error, not just a convention.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
