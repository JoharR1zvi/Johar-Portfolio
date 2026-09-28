import { getTranslations } from 'next-intl/server';

interface Stage {
  title: string;
  body: string;
}

/**
 * Server-rendered accordion (native <details>, no client JS needed) walking
 * through the F1 predictor's stable, already-approved data pipeline facts
 * from docs/CONTENT_FACTS.md. Deliberately stops short of any model
 * accuracy/results claim — that project is still in progress.
 */
export async function F1Pipeline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'labF1' });
  const stages = t.raw('stages') as Stage[];

  return (
    <ol className="mt-8 flex flex-col gap-3">
      {stages.map((stage, index) => (
        <li key={stage.title}>
          <details
            className="border-border bg-card group rounded-2xl border px-5 py-4"
            open={index === 0}
          >
            <summary className="text-foreground flex cursor-pointer list-none items-center gap-3 font-medium marker:content-none">
              <span className="border-border text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full border text-xs">
                {index + 1}
              </span>
              {stage.title}
            </summary>
            <p className="text-muted-foreground mt-3 pl-9 text-sm leading-relaxed">{stage.body}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}
