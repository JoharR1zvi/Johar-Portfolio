'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Segment-level error boundary. Catches render/data-fetch failures below the
 * locale layout (header/footer/theme/locale-switch stay interactive) so a
 * transient issue like the database being unreachable shows a recoverable
 * message instead of a raw framework error page.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center gap-4 px-4 py-24 text-left sm:px-6">
      <h1 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('title')}
      </h1>
      <p className="text-muted-foreground">{t('description')}</p>
      <Button onClick={reset}>{t('retry')}</Button>
    </div>
  );
}
