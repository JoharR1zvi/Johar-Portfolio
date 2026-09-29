'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth/session';
import type { AdminPostCore, AdminPostTranslation } from '@/lib/db/admin-posts';
import {
  createPost,
  deletePost,
  updatePostCore,
  upsertPostTranslation,
} from '@/lib/db/admin-posts';
import { postSlugSchema } from '@/lib/validation/post';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error('Not authorized.');
}

/**
 * Returns the new post's id rather than redirecting server-side — a
 * Server Action's `redirect()` throws a signal the client can't
 * distinguish from a real error inside a try/catch (needed here for the
 * slug-validation error message), so the client navigates itself once
 * this resolves successfully.
 */
export async function createNote(slugInput: string): Promise<string> {
  await requireAdmin();
  const parsed = postSlugSchema.safeParse(slugInput);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Invalid slug.');

  const id = await createPost(parsed.data);
  revalidatePath('/admin/notes');
  return id;
}

export async function saveNoteCore(id: string, values: Omit<AdminPostCore, 'id' | 'slug'>) {
  await requireAdmin();
  await updatePostCore(id, values);
  revalidatePath(`/admin/notes/${id}`);
  revalidatePath('/admin/notes');
}

export async function saveNoteTranslation(
  id: string,
  locale: Locale,
  values: AdminPostTranslation,
) {
  await requireAdmin();
  await upsertPostTranslation(id, locale, values);
  revalidatePath(`/admin/notes/${id}`);
  revalidatePath('/admin/notes');
}

export async function deleteNote(id: string) {
  await requireAdmin();
  await deletePost(id);
  revalidatePath('/admin/notes');
}
