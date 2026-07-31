import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'notes' });
  const common = await getTranslations({ locale, namespace: 'common' });

  return (
    <PagePlaceholder title={slug} description={t('description')} badge={common('comingSoon')} />
  );
}
