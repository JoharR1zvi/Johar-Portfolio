import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export async function NotesTeaser({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="notes-teaser"
      className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('notes')}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-2xl">{t('notesTeaserDescription')}</p>
      <Button
        variant="outline"
        className="mt-4"
        nativeButton={false}
        render={<Link href="/notes" />}
      >
        {t('readNotes')}
      </Button>
    </section>
  );
}
