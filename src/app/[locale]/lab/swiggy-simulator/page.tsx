import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PagePlaceholder } from '@/components/layout/page-placeholder';
import { SwiggyAgentSimulator } from '@/components/lab/swiggy-agent-simulator';
import { getSiteSettings } from '@/lib/db/site-settings';

interface BrokeItem {
  title: string;
  body: string;
}

export default async function SwiggySimulatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'lab' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const settings = await getSiteSettings();

  if (!settings.swiggySimulatorEnabled) {
    return (
      <PagePlaceholder
        title={t('swiggySimulatorTitle')}
        description={t('description')}
        badge={common('comingSoon')}
      />
    );
  }

  const swiggyT = await getTranslations({ locale, namespace: 'labSwiggy' });
  const broke = swiggyT.raw('broke') as BrokeItem[];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16 sm:px-6">
      <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
        {t('swiggySimulatorTitle')}
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">{swiggyT('intro')}</p>

      <SwiggyAgentSimulator />

      <h2 className="text-foreground mt-12 text-sm font-semibold tracking-wide uppercase">
        {swiggyT('brokeHeading')}
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {broke.map((item) => (
          <li key={item.title} className="border-border bg-card rounded-2xl border p-5">
            <h3 className="text-foreground font-medium">{item.title}</h3>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
