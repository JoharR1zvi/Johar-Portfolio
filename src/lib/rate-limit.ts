import 'server-only';
import { createAdminClient } from '@/lib/db/admin';

const WINDOW_MINUTES = 10;
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * `rate_limit_events` has RLS enabled with zero public policies (see
 * `supabase/migrations/0004_rls_policies.sql`) — the admin client is the
 * only way to read or write it, by design, not a shortcut around RLS.
 * Returns `true` when the request is allowed (and records it), `false`
 * when the caller is over the limit for this window.
 */
export async function checkAndRecordRateLimit(ipHash: string, endpoint: string): Promise<boolean> {
  const db = createAdminClient();
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error } = await db
    .from('rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart);
  if (error) throw new Error(`Failed checking rate limit: ${error.message}`);
  if ((count ?? 0) >= MAX_REQUESTS_PER_WINDOW) return false;

  const { error: insertError } = await db
    .from('rate_limit_events')
    .insert({ ip_hash: ipHash, endpoint });
  if (insertError) throw new Error(`Failed recording rate limit event: ${insertError.message}`);

  return true;
}
