import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });
  const common = await getTranslations({ locale, namespace: 'common' });

  // Real case-study content (Supabase-backed) lands in Phase 2.
  return (
    <PagePlaceholder title={slug} description={t('description')} badge={common('comingSoon')} />
  );
}
