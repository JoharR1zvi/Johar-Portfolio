import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectEditTabs } from '@/components/admin/project-edit-tabs';
import { getAdminProject } from '@/lib/db/admin-projects';

export const metadata: Metadata = { title: 'Edit project' };

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <div>
        <Link href="/admin/projects" className="text-muted-foreground text-sm hover:underline">
          &larr; All projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">
          {project.translations.en?.title ?? project.core.slug}
        </h1>
        <p className="text-muted-foreground text-sm">{project.core.slug}</p>
      </div>

      <ProjectEditTabs project={project} />
    </div>
  );
}
