import { getTranslations } from 'next-intl/server';
import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectListItem } from '@/lib/db/projects';

export async function MoreProjects({
  projects,
  locale,
}: {
  projects: ProjectListItem[];
  locale: string;
}) {
  if (projects.length === 0) return null;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="more-projects"
      className="border-border mx-auto w-full max-w-6xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('moreProjects')}
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
