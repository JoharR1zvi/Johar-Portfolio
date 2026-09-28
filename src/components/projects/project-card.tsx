import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { projectStatusLabel } from '@/lib/projects/labels';
import type { ProjectListItem } from '@/lib/db/projects';

export async function ProjectCard({
  project,
  locale,
}: {
  project: ProjectListItem;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'projectStatus' });

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="border-border bg-card text-card-foreground hover:border-foreground/30 flex flex-col gap-3 rounded-2xl border p-6 transition-colors"
    >
      <Badge variant="secondary" className="w-fit">
        {projectStatusLabel(t, project.status)}
      </Badge>
      <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight">
        {project.title}
      </h2>
      {project.oneLiner ? (
        <p className="text-muted-foreground text-sm">{project.oneLiner}</p>
      ) : null}
      {project.technologies.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.technologies.map((tech) => (
            <li key={tech.slug}>
              <Badge variant="outline">{tech.name}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
