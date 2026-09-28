import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';

export interface LabDemo {
  href: '/lab/f1-explorer' | '/lab/swiggy-simulator';
  title: string;
  description: string;
  enabled: boolean;
}

/** Shared demo-card markup for the homepage lab preview and the full /lab index — same data and card, each page supplies its own surrounding layout. */
export async function LabDemoCard({ demo, locale }: { demo: LabDemo; locale: string }) {
  const common = await getTranslations({ locale, namespace: 'common' });

  return (
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
  );
}
