import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'resume' });
  const common = await getTranslations({ locale, namespace: 'common' });

  // No resume PDF has been uploaded via the admin yet — the download button
  // stays disabled rather than pointing at a broken or stale link.
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight">
        {t('title')}
      </h1>
      <p className="text-muted-foreground text-lg">{t('description')}</p>
      <Button disabled>{common('comingSoon')}</Button>
    </div>
  );
}
