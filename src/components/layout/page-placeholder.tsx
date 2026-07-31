import { Badge } from '@/components/ui/badge';

export function PagePlaceholder({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-4 py-24 sm:px-6">
      {badge ? <Badge variant="secondary">{badge}</Badge> : null}
      <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
}
