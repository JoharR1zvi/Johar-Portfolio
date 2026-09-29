import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getAdminProjectList } from '@/lib/db/admin-projects';

export const metadata: Metadata = { title: 'Projects' };

export default async function AdminProjectsPage() {
  const projects = await getAdminProjectList();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Core fields and top-level translation text (title, one-liner, recruiter summary, review
          status). Sections, metrics, and technologies aren&apos;t editable here yet.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/admin/projects/${project.id}`}
              className="border-border hover:border-foreground/30 flex flex-col gap-2 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-muted-foreground text-sm">{project.slug}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{project.status}</Badge>
                <Badge variant={project.published ? 'default' : 'secondary'}>
                  project: {project.published ? 'published' : 'unpublished'}
                </Badge>
                <Badge variant={project.enPublished ? 'default' : 'secondary'}>
                  en: {project.enReviewStatus}
                  {project.enPublished ? '' : ', unpublished'}
                </Badge>
                {project.hasDeTranslation ? (
                  <Badge variant={project.dePublished ? 'default' : 'secondary'}>
                    de: {project.deReviewStatus}
                    {project.dePublished ? '' : ', unpublished'}
                  </Badge>
                ) : (
                  <Badge variant="outline">de: none</Badge>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
