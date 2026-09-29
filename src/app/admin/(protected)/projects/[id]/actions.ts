'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth/session';
import type { AdminProjectCore, AdminProjectTranslation } from '@/lib/db/admin-projects';
import { updateProjectCore, upsertProjectTranslation } from '@/lib/db/admin-projects';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error('Not authorized.');
}

export async function saveProjectCore(id: string, values: Omit<AdminProjectCore, 'id' | 'slug'>) {
  await requireAdmin();
  await updateProjectCore(id, values);
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath('/admin/projects');
}

export async function saveProjectTranslation(
  id: string,
  locale: Locale,
  values: AdminProjectTranslation,
) {
  await requireAdmin();
  await upsertProjectTranslation(id, locale, values);
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath('/admin/projects');
}
