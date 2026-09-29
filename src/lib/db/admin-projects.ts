import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];
type ReviewStatus = Database['public']['Enums']['review_status_type'];

/**
 * Admin reads/writes for `projects`/`project_translations`, scoped to core
 * fields + top-level translation fields only (sections/metrics/technologies
 * are a separate, later admin slice). Uses the RLS-respecting client
 * throughout, not the admin/secret one — the "admin can manage projects"
 * and "admin can manage project translations" policies already grant a
 * signed-in admin full access via `is_admin()`; there's no unpublished
 * visibility rule here that RLS can't already express, unlike the public
 * read functions in `lib/db/projects.ts`.
 */

export interface AdminProjectListItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  published: boolean;
  enReviewStatus: ReviewStatus;
  enPublished: boolean;
  hasDeTranslation: boolean;
  deReviewStatus: ReviewStatus | null;
  dePublished: boolean | null;
}

export async function getAdminProjectList(): Promise<AdminProjectListItem[]> {
  const db = await createClient();
  const { data, error } = await db
    .from('projects')
    .select(
      'id, slug, status, published, project_translations(locale, title, review_status, published)',
    )
    .order('slug', { ascending: true });
  if (error) throw new Error(`Failed loading projects: ${error.message}`);

  return (data ?? []).map((project) => {
    const en = project.project_translations.find((t) => t.locale === 'en');
    const de = project.project_translations.find((t) => t.locale === 'de');
    return {
      id: project.id,
      slug: project.slug,
      title: en?.title ?? project.slug,
      status: project.status,
      published: project.published,
      enReviewStatus: en?.review_status ?? 'draft',
      enPublished: en?.published ?? false,
      hasDeTranslation: !!de,
      deReviewStatus: de?.review_status ?? null,
      dePublished: de?.published ?? null,
    };
  });
}

export interface AdminProjectCore {
  id: string;
  slug: string;
  status: string;
  projectType: string | null;
  teamSize: number | null;
  role: string | null;
  startDate: string | null;
  lastUpdatedAt: string | null;
  homepagePriority: number | null;
  safetyLabel: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  isRepoPublic: boolean;
  published: boolean;
}

export interface AdminProjectTranslation {
  title: string;
  oneLiner: string | null;
  recruiterSummary: string | null;
  reviewStatus: ReviewStatus;
  published: boolean;
}

export interface AdminProjectDetail {
  core: AdminProjectCore;
  translations: Partial<Record<Locale, AdminProjectTranslation>>;
}

export async function getAdminProject(id: string): Promise<AdminProjectDetail | null> {
  const db = await createClient();
  const { data: project, error } = await db
    .from('projects')
    .select(
      'id, slug, status, project_type, team_size, role, start_date, last_updated_at, homepage_priority, safety_label, github_url, demo_url, is_repo_public, published, project_translations(locale, title, one_liner, recruiter_summary, review_status, published)',
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`Failed loading project ${id}: ${error.message}`);
  if (!project) return null;

  const translations: Partial<Record<Locale, AdminProjectTranslation>> = {};
  for (const t of project.project_translations) {
    translations[t.locale] = {
      title: t.title,
      oneLiner: t.one_liner,
      recruiterSummary: t.recruiter_summary,
      reviewStatus: t.review_status,
      published: t.published,
    };
  }

  return {
    core: {
      id: project.id,
      slug: project.slug,
      status: project.status,
      projectType: project.project_type,
      teamSize: project.team_size,
      role: project.role,
      startDate: project.start_date,
      lastUpdatedAt: project.last_updated_at,
      homepagePriority: project.homepage_priority,
      safetyLabel: project.safety_label,
      githubUrl: project.github_url,
      demoUrl: project.demo_url,
      isRepoPublic: project.is_repo_public,
      published: project.published,
    },
    translations,
  };
}

export async function updateProjectCore(
  id: string,
  values: Omit<AdminProjectCore, 'id' | 'slug'>,
): Promise<void> {
  const db = await createClient();
  const { error } = await db
    .from('projects')
    .update({
      status: values.status,
      project_type: values.projectType,
      team_size: values.teamSize,
      role: values.role,
      start_date: values.startDate,
      last_updated_at: values.lastUpdatedAt,
      homepage_priority: values.homepagePriority,
      safety_label: values.safetyLabel,
      github_url: values.githubUrl,
      demo_url: values.demoUrl,
      is_repo_public: values.isRepoPublic,
      published: values.published,
    })
    .eq('id', id);
  if (error) throw new Error(`Failed updating project ${id}: ${error.message}`);
}

/** Upserts on the `(project_id, locale)` unique constraint — a project may not have a translation row for a given locale yet (no project currently has a German one). */
export async function upsertProjectTranslation(
  projectId: string,
  locale: Locale,
  values: AdminProjectTranslation,
): Promise<void> {
  const db = await createClient();
  const { error } = await db.from('project_translations').upsert(
    {
      project_id: projectId,
      locale,
      title: values.title,
      one_liner: values.oneLiner,
      recruiter_summary: values.recruiterSummary,
      review_status: values.reviewStatus,
      published: values.published,
    },
    { onConflict: 'project_id,locale' },
  );
  if (error) {
    throw new Error(
      `Failed updating ${locale} translation for project ${projectId}: ${error.message}`,
    );
  }
}
