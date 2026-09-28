import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import { SkillGroups } from '@/components/skills/skill-groups';
import { Button } from '@/components/ui/button';
import { getCertifications } from '@/lib/db/certifications';
import { getProfile } from '@/lib/db/profile';
import { getCapabilityMap } from '@/lib/db/skills';
import type { TimelineEntry } from '@/lib/db/timeline';
import { getTimeline } from '@/lib/db/timeline';
import { formatMonthYear } from '@/lib/format-date';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resume' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/resume'),
  };
}

function TimelineList({
  entries,
  locale,
  presentLabel,
}: {
  entries: TimelineEntry[];
  locale: string;
  presentLabel: string;
}) {
  return (
    <ol className="border-border mt-6 flex flex-col gap-6 border-l pl-6">
      {entries.map((entry, i) => (
        <li key={i}>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {entry.startDate ? formatMonthYear(entry.startDate, locale) : null}
            {' – '}
            {entry.endDate ? formatMonthYear(entry.endDate, locale) : presentLabel}
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
  );
}

export default async function ResumePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'resume' });
  const home = await getTranslations({ locale, namespace: 'home' });
  const common = await getTranslations({ locale, namespace: 'common' });
  const timelineT = await getTranslations({ locale, namespace: 'timeline' });

  const [profile, timeline, certifications, capabilityMap] = await Promise.all([
    getProfile(locale),
    getTimeline(locale),
    getCertifications(locale),
    getCapabilityMap(locale),
  ]);

  const education = timeline.filter((entry) => entry.itemType === 'education');
  const experience = timeline.filter((entry) => entry.itemType !== 'education');
  const presentLabel = timelineT('present');

  const contactLinks = [
    profile?.publicEmail
      ? { href: `mailto:${profile.publicEmail}`, label: home('emailMe'), icon: Mail }
      : null,
    profile?.githubUrl
      ? { href: profile.githubUrl, label: home('viewOnGithub'), icon: GithubIcon }
      : null,
    profile?.linkedinUrl
      ? { href: profile.linkedinUrl, label: home('viewOnLinkedin'), icon: LinkedinIcon }
      : null,
  ].filter((link): link is { href: string; label: string; icon: typeof Mail } => link !== null);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-4 py-24 sm:px-6">
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        {profile ? (
          <div>
            <p className="text-foreground text-lg font-medium">{profile.fullName}</p>
            <p className="text-muted-foreground">
              {profile.primaryTitle}
              {profile.supportingDescriptor ? ` — ${profile.supportingDescriptor}` : ''}
            </p>
            {profile.location ? (
              <p className="text-muted-foreground text-sm">{profile.location}</p>
            ) : null}
          </div>
        ) : null}
        {contactLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {contactLinks.map((link) => (
              <Button
                key={link.label}
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  />
                }
              >
                <link.icon className="size-4" aria-hidden="true" />
                {link.label}
              </Button>
            ))}
          </div>
        ) : null}
        {/* No resume PDF has been uploaded via the admin yet — the download
            button stays disabled rather than pointing at a broken or stale
            link. */}
        <Button disabled className="w-fit">
          {common('comingSoon')}
        </Button>
      </header>

      {education.length > 0 ? (
        <section>
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
            {t('education')}
          </h2>
          <TimelineList entries={education} locale={locale} presentLabel={presentLabel} />
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section>
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
            {t('experience')}
          </h2>
          <TimelineList entries={experience} locale={locale} presentLabel={presentLabel} />
        </section>
      ) : null}

      {capabilityMap.length > 0 ? (
        <section>
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
            {home('capabilityMap')}
          </h2>
          <div className="mt-6">
            <SkillGroups groups={capabilityMap} locale={locale} />
          </div>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section>
          <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
            {t('certifications')}
          </h2>
          <ul className="mt-6 flex flex-col gap-2">
            {certifications.map((cert) => (
              <li key={cert.name} className="text-foreground text-sm">
                {cert.name}
                {cert.issuer ? (
                  <span className="text-muted-foreground"> — {cert.issuer}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
