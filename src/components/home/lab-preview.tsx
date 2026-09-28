import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import type { SiteSettings } from '@/lib/db/site-settings';

export async function LabPreview({
  siteSettings,
  locale,
}: {
  siteSettings: SiteSettings;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'lab' });
  const common = await getTranslations({ locale, namespace: 'common' });

  const demos = [
    {
      href: '/lab/f1-explorer',
      title: t('f1ExplorerTitle'),
      description: t('f1ExplorerDescription'),
      enabled: siteSettings.f1ExplorerEnabled,
    },
    {
      href: '/lab/swiggy-simulator',
      title: t('swiggySimulatorTitle'),
      description: t('swiggySimulatorDescription'),
      enabled: siteSettings.swiggySimulatorEnabled,
    },
  ];

  return (
    <section
      id="lab-preview"
      className="border-border mx-auto w-full max-w-6xl border-t px-4 py-16 sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
          {t('title')}
        </h2>
        <Link href="/lab" className="text-muted-foreground text-sm hover:underline">
          {t('viewLab')} &rarr;
        </Link>
      </div>
      <p className="text-muted-foreground mt-2 max-w-2xl">{t('previewDescription')}</p>
      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link
              href={demo.href}
              className="border-border bg-card text-card-foreground hover:border-foreground/30 flex flex-col gap-2 rounded-2xl border p-6 transition-colors"
            >
              {!demo.enabled ? (
                <Badge variant="secondary" className="w-fit">
                  {common('comingSoon')}
                </Badge>
              ) : null}
              <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
                {demo.title}
              </h3>
              <p className="text-muted-foreground text-sm">{demo.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
