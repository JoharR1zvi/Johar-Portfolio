import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

export default async function F1ExplorerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'lab' });
  const common = await getTranslations({ locale, namespace: 'common' });

  // Feature-flagged in Phase 4 (site_settings.f1_explorer_enabled) — the F1
  // project's targets/metrics are still unstable, see docs/CONTENT_FACTS.md.
  return (
    <PagePlaceholder
      title={t('title')}
      description={t('description')}
      badge={common('comingSoon')}
    />
  );
}
