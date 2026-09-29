import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];
type ReviewStatus = Database['public']['Enums']['review_status_type'];

/**
 * Admin reads/writes for `posts`/`post_translations` (the technical notes
 * — no `posts` are seeded yet, so this is currently the only way any will
 * ever get created, unlike projects, which are expected to come in through
 * the AI import pipeline). Same shape as `admin-projects.ts`: RLS-
 * respecting client throughout, since "admin can manage posts"/"admin can
 * manage post translations" already cover a signed-in admin.
 */

export interface AdminPostListItem {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  enReviewStatus: ReviewStatus;
  enPublished: boolean;
  hasDeTranslation: boolean;
  deReviewStatus: ReviewStatus | null;
  dePublished: boolean | null;
}

export async function getAdminPostList(): Promise<AdminPostListItem[]> {
  const db = await createClient();
  const { data, error } = await db
    .from('posts')
    .select('id, slug, published, post_translations(locale, title, review_status, published)')
    .order('slug', { ascending: true });
  if (error) throw new Error(`Failed loading posts: ${error.message}`);

  return (data ?? []).map((post) => {
    const en = post.post_translations.find((t) => t.locale === 'en');
    const de = post.post_translations.find((t) => t.locale === 'de');
    return {
      id: post.id,
      slug: post.slug,
      title: en?.title ?? post.slug,
      published: post.published,
      enReviewStatus: en?.review_status ?? 'draft',
      enPublished: en?.published ?? false,
      hasDeTranslation: !!de,
      deReviewStatus: de?.review_status ?? null,
      dePublished: de?.published ?? null,
    };
  });
}

export interface AdminPostCore {
  id: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
}

export interface AdminPostTranslation {
  title: string;
  bodyMarkdown: string | null;
  reviewStatus: ReviewStatus;
  published: boolean;
}

export interface AdminPostDetail {
  core: AdminPostCore;
  translations: Partial<Record<Locale, AdminPostTranslation>>;
}

export async function getAdminPost(id: string): Promise<AdminPostDetail | null> {
  const db = await createClient();
  const { data: post, error } = await db
    .from('posts')
    .select(
      'id, slug, published, published_at, post_translations(locale, title, body_markdown, review_status, published)',
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`Failed loading post ${id}: ${error.message}`);
  if (!post) return null;

  const translations: Partial<Record<Locale, AdminPostTranslation>> = {};
  for (const t of post.post_translations) {
    translations[t.locale] = {
      title: t.title,
      bodyMarkdown: t.body_markdown,
      reviewStatus: t.review_status,
      published: t.published,
    };
  }

  return {
    core: {
      id: post.id,
      slug: post.slug,
      published: post.published,
      publishedAt: post.published_at,
    },
    translations,
  };
}

/** Creates a bare post row (no translation yet) and returns its id — the admin fills in English via the edit page next, same as any other translation tab. */
export async function createPost(slug: string): Promise<string> {
  const db = await createClient();
  const { data, error } = await db.from('posts').insert({ slug }).select('id').single();
  if (error) throw new Error(`Failed creating post: ${error.message}`);
  return data.id;
}

export async function updatePostCore(
  id: string,
  values: Omit<AdminPostCore, 'id' | 'slug'>,
): Promise<void> {
  const db = await createClient();
  const { error } = await db
    .from('posts')
    .update({ published: values.published, published_at: values.publishedAt })
    .eq('id', id);
  if (error) throw new Error(`Failed updating post ${id}: ${error.message}`);
}

export async function upsertPostTranslation(
  postId: string,
  locale: Locale,
  values: AdminPostTranslation,
): Promise<void> {
  const db = await createClient();
  const { error } = await db.from('post_translations').upsert(
    {
      post_id: postId,
      locale,
      title: values.title,
      body_markdown: values.bodyMarkdown,
      review_status: values.reviewStatus,
      published: values.published,
    },
    { onConflict: 'post_id,locale' },
  );
  if (error) {
    throw new Error(`Failed updating ${locale} translation for post ${postId}: ${error.message}`);
  }
}

export async function deletePost(id: string): Promise<void> {
  const db = await createClient();
  const { error } = await db.from('posts').delete().eq('id', id);
  if (error) throw new Error(`Failed deleting post ${id}: ${error.message}`);
}
