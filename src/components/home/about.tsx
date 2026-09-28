import { getTranslations } from 'next-intl/server';
import type { Profile } from '@/lib/db/profile';

export async function About({ profile, locale }: { profile: Profile | null; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      id="about"
      className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('about')}
      </h2>
      <p className="text-foreground mt-4 text-base leading-relaxed">
        {profile?.aboutText ?? t('pendingTranslation')}
      </p>
    </section>
  );
}
