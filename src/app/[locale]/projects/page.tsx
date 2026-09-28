import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectFilters } from '@/components/projects/project-filters';
import { filterProjects, getProjectFilterOptions, getPublishedProjects } from '@/lib/db/projects';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/projects'),
  };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; tech?: string }>;
}) {
  const { locale } = await params;
  const { type, tech } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });
  const allProjects = await getPublishedProjects(locale);
  const options = getProjectFilterOptions(allProjects);
  const projects = filterProjects(allProjects, { type, tech });

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="font-heading text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('title')}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{t('description')}</p>

      <ProjectFilters locale={locale} options={options} activeType={type} activeTech={tech} />

      {projects.length > 0 ? (
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground mt-12">{t('empty')}</p>
      )}
    </div>
  );
}
