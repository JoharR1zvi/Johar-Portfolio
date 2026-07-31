import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

export default async function SwiggySimulatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'lab' });
  const common = await getTranslations({ locale, namespace: 'common' });

  // Deterministic mocked agent-graph simulator lands in Phase 4. It must
  // never make live Swiggy calls from the public site (see docs/DECISIONS.md).
  return (
    <PagePlaceholder
      title={t('title')}
      description={t('description')}
      badge={common('comingSoon')}
    />
  );
}
