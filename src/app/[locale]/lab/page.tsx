import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LabDemoCard, type LabDemo } from '@/components/lab/lab-demo-card';
import { getSiteSettings } from '@/lib/db/site-settings';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'lab' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/lab'),
  };
}

export default async function LabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'lab' });
  const settings = await getSiteSettings();

  const demos: LabDemo[] = [
    {
      href: '/lab/f1-explorer',
      title: t('f1ExplorerTitle'),
      description: t('f1ExplorerDescription'),
      enabled: settings.f1ExplorerEnabled,
    },
    {
      href: '/lab/swiggy-simulator',
      title: t('swiggySimulatorTitle'),
      description: t('swiggySimulatorDescription'),
      enabled: settings.swiggySimulatorEnabled,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="font-heading text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('title')}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{t('description')}</p>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {demos.map((demo) => (
          <li key={demo.href}>
            <LabDemoCard demo={demo} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
