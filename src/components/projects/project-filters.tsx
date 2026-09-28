import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { projectTypeLabel } from '@/lib/projects/labels';
import type { ProjectFilterOptions } from '@/lib/db/projects';

function FilterChip({
  href,
  active,
  children,
}: {
  href: { pathname: '/projects'; query: Record<string, string> };
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={active ? 'default' : 'outline'}
      render={<Link href={href} aria-current={active ? 'true' : undefined} />}
      className="cursor-pointer px-3 py-1"
    >
      {children}
    </Badge>
  );
}

export async function ProjectFilters({
  locale,
  options,
  activeType,
  activeTech,
}: {
  locale: string;
  options: ProjectFilterOptions;
  activeType?: string;
  activeTech?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'projects' });
  const typeT = await getTranslations({ locale, namespace: 'projectType' });

  if (options.types.length === 0 && options.technologies.length === 0) return null;

  const withQuery = (query: Record<string, string>) => ({ pathname: '/projects' as const, query });

  return (
    <div className="mt-8 flex flex-col gap-4">
      {options.types.length > 1 ? (
        <div>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('filterByType')}
          </span>
          <ul className="mt-2 flex flex-wrap gap-2">
            <li>
              <FilterChip
                href={withQuery(activeTech ? { tech: activeTech } : {})}
                active={!activeType}
              >
                {t('allTypes')}
              </FilterChip>
            </li>
            {options.types.map((type) => (
              <li key={type}>
                <FilterChip
                  href={withQuery({ ...(activeTech ? { tech: activeTech } : {}), type })}
                  active={activeType === type}
                >
                  {projectTypeLabel(typeT, type)}
                </FilterChip>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {options.technologies.length > 1 ? (
        <div>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('filterByTechnology')}
          </span>
          <ul className="mt-2 flex flex-wrap gap-2">
            <li>
              <FilterChip
                href={withQuery(activeType ? { type: activeType } : {})}
                active={!activeTech}
              >
                {t('allTechnologies')}
              </FilterChip>
            </li>
            {options.technologies.map((tech) => (
              <li key={tech.slug}>
                <FilterChip
                  href={withQuery({
                    ...(activeType ? { type: activeType } : {}),
                    tech: tech.slug,
                  })}
                  active={activeTech === tech.slug}
                >
                  {tech.name}
                </FilterChip>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
