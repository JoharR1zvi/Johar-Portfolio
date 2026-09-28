import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectListItem } from '@/lib/db/projects';

export async function SelectedWork({
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
      id="selected-work"
      className="border-border mx-auto w-full max-w-6xl border-t px-4 py-16 sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
          {t('selectedWork')}
        </h2>
        <Link href="/projects" className="text-muted-foreground text-sm hover:underline">
          {t('viewAllProjects')} &rarr;
        </Link>
      </div>
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
