import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import type { SkillCategoryGroup } from '@/lib/db/skills';

export async function SkillGroups({
  groups,
  locale,
}: {
  groups: SkillCategoryGroup[];
  locale: string;
}) {
  if (groups.length === 0) return null;
  const categoryT = await getTranslations({ locale, namespace: 'skillCategory' });
  const skillT = await getTranslations({ locale, namespace: 'skills' });

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={group.category}>
          <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            {categoryT(group.category)}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {group.skills.map((skill) => (
              <li key={skill.slug}>
                <Badge variant={skill.confirmed ? 'outline' : 'secondary'}>
                  {skill.name}
                  {!skill.confirmed ? ` (${skillT('exploring')})` : ''}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
