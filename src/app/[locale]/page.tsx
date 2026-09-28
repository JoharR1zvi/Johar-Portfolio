import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { About } from '@/components/home/about';
import { CapabilityMap } from '@/components/home/capability-map';
import { Contact } from '@/components/home/contact';
import { Hero } from '@/components/home/hero';
import { Journey } from '@/components/home/journey';
import { LabPreview } from '@/components/home/lab-preview';
import { MoreProjects } from '@/components/home/more-projects';
import { NotesTeaser } from '@/components/home/notes-teaser';
import { SelectedWork } from '@/components/home/selected-work';
import { PersonJsonLd } from '@/components/seo/person-json-ld';
import { getProfile } from '@/lib/db/profile';
import { getPublishedProjects } from '@/lib/db/projects';
import { getSiteSettings } from '@/lib/db/site-settings';
import { getCapabilityMap } from '@/lib/db/skills';
import { getTimeline } from '@/lib/db/timeline';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale, '') };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, projects, capabilityMap, timeline, siteSettings] = await Promise.all([
    getProfile(locale),
    getPublishedProjects(locale),
    getCapabilityMap(locale),
    getTimeline(locale),
    getSiteSettings(),
  ]);

  const selectedWork = projects.filter((p) => p.homepagePriority !== null);
  const moreProjects = projects.filter((p) => p.homepagePriority === null);

  return (
    <div className="flex flex-1 flex-col">
      {profile ? <PersonJsonLd profile={profile} locale={locale} /> : null}
      <Hero profile={profile} locale={locale} />
      <SelectedWork projects={selectedWork} locale={locale} />
      <MoreProjects projects={moreProjects} locale={locale} />
      <LabPreview siteSettings={siteSettings} locale={locale} />
      <CapabilityMap groups={capabilityMap} locale={locale} />
      <About profile={profile} locale={locale} />
      <Journey entries={timeline} locale={locale} />
      <NotesTeaser locale={locale} />
      <Contact profile={profile} locale={locale} />
    </div>
  );
}
