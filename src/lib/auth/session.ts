import 'server-only';
import { createClient } from '@/lib/db/server';

/**
 * Returns the signed-in admin user, or `null` if nobody's signed in or the
 * signed-in user isn't the admin. `is_admin()` is a `security definer` SQL
 * function (supabase/migrations/0004_rls_policies.sql) exposed as an RPC —
 * this is the only way to check admin status from an RLS-respecting client,
 * since `admin_users` itself has no public SELECT policy at all.
 */
export async function getAdminSession() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await db.rpc('is_admin');
  if (error) throw new Error(`Failed checking admin status: ${error.message}`);
  if (!isAdmin) return null;

  return user;
}
