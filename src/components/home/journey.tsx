import { getTranslations } from 'next-intl/server';
import { formatMonthYear } from '@/lib/format-date';
import type { TimelineEntry } from '@/lib/db/timeline';

export async function Journey({ entries, locale }: { entries: TimelineEntry[]; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const timelineT = await getTranslations({ locale, namespace: 'timeline' });

  return (
    <section
      id="journey"
      className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('journey')}
      </h2>
      {entries.length > 0 ? (
        <ol className="border-border mt-8 flex flex-col gap-8 border-l pl-6">
          {entries.map((entry, i) => (
            <li key={i}>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {entry.startDate ? formatMonthYear(entry.startDate, locale) : null}
                {' – '}
                {entry.endDate ? formatMonthYear(entry.endDate, locale) : timelineT('present')}
              </p>
              <h3 className="text-foreground mt-1 font-medium">{entry.title}</h3>
              {entry.organization ? (
                <p className="text-muted-foreground text-sm">{entry.organization}</p>
              ) : null}
              {entry.description ? (
                <p className="text-foreground mt-2 text-sm leading-relaxed">{entry.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted-foreground mt-4">{t('pendingTranslation')}</p>
      )}
    </section>
  );
}
