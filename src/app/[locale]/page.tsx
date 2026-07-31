import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-4 py-24 sm:px-6">
        <h1 className="font-heading text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg">{t('description')}</p>
      </section>

      {/* Placeholder anchor targets for the header's in-page nav links.
          Full content lands in Phase 2 (selected work, capability map,
          about, journey, contact). */}
      <section
        id="about"
        className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
      >
        <h2 className="font-heading text-foreground text-2xl font-semibold">{nav('about')}</h2>
      </section>
      <section
        id="journey"
        className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
      >
        <h2 className="font-heading text-foreground text-2xl font-semibold">{nav('journey')}</h2>
      </section>
      <section
        id="contact"
        className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
      >
        <h2 className="font-heading text-foreground text-2xl font-semibold">{nav('contact')}</h2>
      </section>
    </div>
  );
}
