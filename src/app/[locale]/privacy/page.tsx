import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return <PagePlaceholder title={t('title')} description={t('description')} />;
}
