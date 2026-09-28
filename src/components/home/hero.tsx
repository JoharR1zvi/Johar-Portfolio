import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/lib/db/profile';

export async function Hero({ profile, locale }: { profile: Profile | null; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  const headline = profile?.heroHeadline ?? t('title');
  const subheadline = profile?.heroSubheadline ?? t('description');

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-4 py-24 sm:px-6">
      <h1 className="font-heading text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
        {headline}
      </h1>
      <p className="text-muted-foreground text-lg">{subheadline}</p>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="lg" nativeButton={false} render={<Link href="/projects" />}>
          {t('selectedWork')}
        </Button>
        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/resume" />}>
          {nav('resume')}
        </Button>
      </div>
    </section>
  );
}
