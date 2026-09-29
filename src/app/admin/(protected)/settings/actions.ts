'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth/session';
import { updateSiteSettings } from '@/lib/db/site-settings';

/**
 * The RLS "admin can manage site settings" policy already blocks a
 * non-admin write at the database level — this session check exists so a
 * stray/expired-session request fails with a clear message instead of an
 * opaque RLS-denial error.
 */
export async function updateLabFlags(
  id: string,
  values: { f1ExplorerEnabled: boolean; swiggySimulatorEnabled: boolean },
) {
  const admin = await getAdminSession();
  if (!admin) throw new Error('Not authorized.');

  await updateSiteSettings(id, values);

  // Public lab pages are already fully dynamic (read live on every
  // request, see docs/architecture.md), so only this admin page itself
  // needs revalidating.
  revalidatePath('/admin/settings');
}
