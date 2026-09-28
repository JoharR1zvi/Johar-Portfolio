import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

/** Narrows a route param's `string` locale to the DB's locale enum. Safe here because `hasLocale()` in the locale layout already rejects any value outside `routing.locales` before these pages render. */
function toLocale(locale: string): Locale {
  return locale as Locale;
}

/**
 * Public project reads for `/projects` and `/projects/[slug]`. Uses the
 * RLS-respecting client (`lib/db/server.ts`) throughout — `published` and
 * `review_status` gating is enforced entirely by the RLS policies in
 * `supabase/migrations/0004_rls_policies.sql`, not duplicated here. Locale
 * is the one filter these queries do apply themselves, since picking a
 * translation row isn't a security concern the way publish state is.
 */

interface TechRef {
  slug: string;
  name: string;
}

export interface ProjectListItem {
  slug: string;
  status: string;
  projectType: string | null;
  homepagePriority: number | null;
  title: string;
  oneLiner: string | null;
  technologies: TechRef[];
}

export interface ProjectSection {
  key: string;
  heading: string;
  body: string;
}

export interface ProjectMetric {
  key: string;
  valueText: string;
  verificationNote: string | null;
}

export interface ProjectDetail {
  slug: string;
  status: string;
  projectType: string | null;
  teamSize: number | null;
  role: string | null;
  safetyLabel: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  title: string;
  oneLiner: string | null;
  recruiterSummary: string | null;
  sections: ProjectSection[];
  metrics: ProjectMetric[];
  technologies: TechRef[];
}

async function getTechnologyNameMap(locale: string) {
  const db = await createClient();
  const { data, error } = await db
    .from('technologies')
    .select('id, slug, technology_translations!inner(name)')
    .eq('technology_translations.locale', toLocale(locale));
  if (error) throw new Error(`Failed loading technologies: ${error.message}`);

  const map = new Map<string, TechRef>();
  for (const row of data ?? []) {
    const name = row.technology_translations[0]?.name ?? row.slug;
    map.set(row.id, { slug: row.slug, name });
  }
  return map;
}

async function getTechnologiesForProjects(projectIds: string[], locale: string) {
  if (projectIds.length === 0) return new Map<string, TechRef[]>();

  const db = await createClient();
  const [{ data: links, error }, techMap] = await Promise.all([
    db
      .from('project_technologies')
      .select('project_id, technology_id')
      .in('project_id', projectIds),
    getTechnologyNameMap(locale),
  ]);
  if (error) throw new Error(`Failed loading project technologies: ${error.message}`);

  const byProject = new Map<string, TechRef[]>();
  for (const link of links ?? []) {
    const tech = techMap.get(link.technology_id);
    if (!tech) continue;
    const list = byProject.get(link.project_id) ?? [];
    list.push(tech);
    byProject.set(link.project_id, list);
  }
  return byProject;
}

/** Distinct filter facets derived from the currently published project list, so the UI never offers a filter value with zero matching projects. */
export interface ProjectFilterOptions {
  types: string[];
  technologies: TechRef[];
}

export function getProjectFilterOptions(projects: ProjectListItem[]): ProjectFilterOptions {
  const types = Array.from(
    new Set(projects.map((p) => p.projectType).filter((t): t is string => t !== null)),
  ).sort();

  const technologies = Array.from(
    new Map(projects.flatMap((p) => p.technologies).map((tech) => [tech.slug, tech])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  return { types, technologies };
}

export function filterProjects(
  projects: ProjectListItem[],
  filters: { type?: string; tech?: string },
): ProjectListItem[] {
  return projects.filter((p) => {
    if (filters.type && p.projectType !== filters.type) return false;
    if (filters.tech && !p.technologies.some((t) => t.slug === filters.tech)) return false;
    return true;
  });
}

export async function getPublishedProjects(locale: string): Promise<ProjectListItem[]> {
  const db = await createClient();
  const { data: projects, error } = await db
    .from('projects')
    .select(
      'id, slug, status, project_type, homepage_priority, start_date, project_translations!inner(title, one_liner)',
    )
    .eq('project_translations.locale', toLocale(locale))
    .order('homepage_priority', { ascending: true, nullsFirst: false })
    .order('start_date', { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Failed loading projects: ${error.message}`);
  if (!projects || projects.length === 0) return [];

  const techByProject = await getTechnologiesForProjects(
    projects.map((p) => p.id),
    locale,
  );

  return projects.map((p) => {
    const translation = p.project_translations[0];
    return {
      slug: p.slug,
      status: p.status,
      projectType: p.project_type,
      homepagePriority: p.homepage_priority,
      title: translation?.title ?? p.slug,
      oneLiner: translation?.one_liner ?? null,
      technologies: techByProject.get(p.id) ?? [],
    };
  });
}

export async function getProjectBySlug(
  slug: string,
  locale: string,
): Promise<ProjectDetail | null> {
  const db = await createClient();

  const { data: project, error } = await db
    .from('projects')
    .select(
      'id, slug, status, project_type, team_size, role, safety_label, github_url, demo_url, project_translations!inner(title, one_liner, recruiter_summary)',
    )
    .eq('slug', slug)
    .eq('project_translations.locale', toLocale(locale))
    .maybeSingle();
  if (error) throw new Error(`Failed loading project "${slug}": ${error.message}`);
  if (!project) return null;

  const translation = project.project_translations[0];
  if (!translation) return null;

  const [sectionsResult, metricsResult, techByProject] = await Promise.all([
    db
      .from('project_sections')
      .select(
        'section_key, section_order, project_section_translations!inner(heading, body_markdown)',
      )
      .eq('project_id', project.id)
      .eq('project_section_translations.locale', toLocale(locale))
      .order('section_order', { ascending: true }),
    db
      .from('project_metrics')
      .select('metric_key, value_text, verification_note, display_order')
      .eq('project_id', project.id)
      .order('display_order', { ascending: true, nullsFirst: false }),
    getTechnologiesForProjects([project.id], locale),
  ]);
  if (sectionsResult.error) {
    throw new Error(`Failed loading sections for "${slug}": ${sectionsResult.error.message}`);
  }
  if (metricsResult.error) {
    throw new Error(`Failed loading metrics for "${slug}": ${metricsResult.error.message}`);
  }

  const sections: ProjectSection[] = (sectionsResult.data ?? []).flatMap((section) => {
    const sectionTranslation = section.project_section_translations[0];
    if (!sectionTranslation?.heading || !sectionTranslation.body_markdown) return [];
    return [
      {
        key: section.section_key,
        heading: sectionTranslation.heading,
        body: sectionTranslation.body_markdown,
      },
    ];
  });

  const metrics: ProjectMetric[] = (metricsResult.data ?? []).map((metric) => ({
    key: metric.metric_key,
    valueText: metric.value_text,
    verificationNote: metric.verification_note,
  }));

  return {
    slug: project.slug,
    status: project.status,
    projectType: project.project_type,
    teamSize: project.team_size,
    role: project.role,
    safetyLabel: project.safety_label,
    githubUrl: project.github_url,
    demoUrl: project.demo_url,
    title: translation.title,
    oneLiner: translation.one_liner,
    recruiterSummary: translation.recruiter_summary,
    sections,
    metrics,
    technologies: techByProject.get(project.id) ?? [],
  };
}
