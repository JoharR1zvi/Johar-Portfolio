import { ExternalLink } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { F1Pipeline } from '@/components/lab/f1-pipeline';
import { Button } from '@/components/ui/button';
import { getSiteSettings } from '@/lib/db/site-settings';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

const REPO_URL = 'https://github.com/JoharR1zvi/F1-race-predictor';

export default async function F1ExplorerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'lab' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const settings = await getSiteSettings();

  if (!settings.f1ExplorerEnabled) {
    return (
      <PagePlaceholder
        title={t('f1ExplorerTitle')}
        description={t('description')}
        badge={common('comingSoon')}
      />
    );
  }

  const f1T = await getTranslations({ locale, namespace: 'labF1' });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16 sm:px-6">
      <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
        {t('f1ExplorerTitle')}
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">{f1T('intro')}</p>

      <h2 className="text-foreground mt-10 text-sm font-semibold tracking-wide uppercase">
        {f1T('stagesHeading')}
      </h2>
      <F1Pipeline locale={locale} />

      <Button
        variant="outline"
        className="mt-8 w-fit gap-1.5"
        nativeButton={false}
        render={<a href={REPO_URL} target="_blank" rel="noopener noreferrer" />}
      >
        {f1T('repoCta')}
        <ExternalLink className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
