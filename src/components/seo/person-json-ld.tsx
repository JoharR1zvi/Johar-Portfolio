import type { Profile } from '@/lib/db/profile';
import { SITE_URL } from '@/lib/seo';

/**
 * schema.org Person structured data for the homepage. Built only from
 * fields already public per docs/CONTENT_FACTS.md (name, title, city-level
 * location, public email, GitHub/LinkedIn) — nothing here is more exposed
 * than what's already rendered on the page itself.
 */
export function PersonJsonLd({ profile, locale }: { profile: Profile; locale: string }) {
  const sameAs = [profile.githubUrl, profile.linkedinUrl].filter(
    (url): url is string => url !== null,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.primaryTitle,
    url: `${SITE_URL}/${locale}`,
    ...(profile.publicEmail ? { email: `mailto:${profile.publicEmail}` } : {}),
    ...(profile.location
      ? { address: { '@type': 'PostalAddress', addressLocality: profile.location } }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
