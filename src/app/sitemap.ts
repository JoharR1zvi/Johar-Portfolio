import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getPublishedProjects } from '@/lib/db/projects';
import { SITE_URL } from '@/lib/seo';

// The lab demo pages are included even while feature-flagged off: they
// still resolve (as the "coming soon" placeholder), so there's nothing
// wrong with a crawler finding them, and the sitemap doesn't need to know
// about `site_settings` at all.
const STATIC_PATHS = [
  '',
  '/projects',
  '/resume',
  '/lab',
  '/lab/f1-explorer',
  '/lab/swiggy-simulator',
  '/notes',
  '/privacy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({ url: `${SITE_URL}/${locale}${path}` });
    }
  }

  for (const locale of routing.locales) {
    const projects = await getPublishedProjects(locale);
    for (const project of projects) {
      entries.push({ url: `${SITE_URL}/${locale}/projects/${project.slug}` });
    }
  }

  return entries;
}
