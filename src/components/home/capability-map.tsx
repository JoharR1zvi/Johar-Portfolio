import { getTranslations } from 'next-intl/server';
import { SkillGroups } from '@/components/skills/skill-groups';
import type { SkillCategoryGroup } from '@/lib/db/skills';

export async function CapabilityMap({
  groups,
  locale,
}: {
  groups: SkillCategoryGroup[];
  locale: string;
}) {
  if (groups.length === 0) return null;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="capability-map"
      className="border-border mx-auto w-full max-w-6xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('capabilityMap')}
      </h2>
      <div className="mt-8">
        <SkillGroups groups={groups} locale={locale} />
      </div>
    </section>
  );
}
