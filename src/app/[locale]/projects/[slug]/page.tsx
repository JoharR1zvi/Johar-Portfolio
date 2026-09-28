import { TriangleAlert } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectMarkdown } from '@/components/projects/project-markdown';
import { getProjectBySlug } from '@/lib/db/projects';
import { projectStatusLabel, projectTypeLabel } from '@/lib/projects/labels';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  if (!project) return {};

  return {
    title: project.title,
    description: project.oneLiner ?? project.recruiterSummary ?? undefined,
    alternates: localeAlternates(locale, `/projects/${slug}`),
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });
  const statusT = await getTranslations({ locale, namespace: 'projectStatus' });
  const typeT = await getTranslations({ locale, namespace: 'projectType' });

  const project = await getProjectBySlug(slug, locale);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/projects" className="text-muted-foreground text-sm hover:underline">
        &larr; {t('backToProjects')}
      </Link>

      <header className="mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{projectStatusLabel(statusT, project.status)}</Badge>
          {project.projectType ? (
            <Badge variant="outline">{projectTypeLabel(typeT, project.projectType)}</Badge>
          ) : null}
        </div>
        <h1 className="font-heading text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        {project.oneLiner ? (
          <p className="text-muted-foreground max-w-3xl text-xl">{project.oneLiner}</p>
        ) : null}
        {project.recruiterSummary ? (
          <p className="text-foreground max-w-3xl text-base">{project.recruiterSummary}</p>
        ) : null}

        {project.safetyLabel ? (
          <div className="border-border bg-muted/50 text-muted-foreground flex max-w-3xl items-start gap-2 rounded-xl border px-4 py-3 text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{project.safetyLabel}</span>
          </div>
        ) : null}

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {project.role ? (
            <span>
              <span className="text-foreground font-medium">{t('role')}:</span> {project.role}
            </span>
          ) : null}
          {project.teamSize ? (
            <span>
              <span className="text-foreground font-medium">{t('teamSize')}:</span>{' '}
              {project.teamSize}
            </span>
          ) : null}
        </div>

        {project.githubUrl || project.demoUrl ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.githubUrl ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href={project.githubUrl} target="_blank" rel="noreferrer" />}
              >
                {t('viewOnGithub')}
              </Button>
            ) : null}
            {project.demoUrl ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<a href={project.demoUrl} target="_blank" rel="noreferrer" />}
              >
                {t('liveDemo')}
              </Button>
            ) : null}
          </div>
        ) : null}
      </header>

      {project.metrics.length > 0 ? (
        <dl className="border-border mt-10 grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-3 lg:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.key}>
              <dd className="text-foreground text-lg font-semibold tracking-tight">
                {metric.valueText}
              </dd>
              {metric.verificationNote ? (
                <dt className="text-muted-foreground mt-1 text-xs">{metric.verificationNote}</dt>
              ) : null}
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        {project.sections.length > 0 ? (
          <nav aria-label={t('onThisPage')} className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {t('onThisPage')}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {project.sections.map((section) => (
                  <li key={section.key}>
                    <a
                      href={`#${section.key}`}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}

        <div className="flex flex-col gap-12">
          {project.sections.map((section) => (
            <section key={section.key} id={section.key} className="scroll-mt-24">
              <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-4">
                <ProjectMarkdown>{section.body}</ProjectMarkdown>
              </div>
            </section>
          ))}

          {project.technologies.length > 0 ? (
            <section className="border-border border-t pt-8">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {t('technologies')}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <li key={tech.slug}>
                    <Badge variant="outline">{tech.name}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
