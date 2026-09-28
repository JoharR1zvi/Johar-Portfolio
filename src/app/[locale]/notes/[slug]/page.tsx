import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

/** No `posts` content is seeded yet, so every slug here is placeholder content — kept out of search results until real notes exist. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });
  return { title: slug, description: t('description'), robots: { index: false, follow: false } };
}

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
