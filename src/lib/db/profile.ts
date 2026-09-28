import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

function toLocale(locale: string): Locale {
  return locale as Locale;
}

export interface Profile {
  fullName: string;
  primaryTitle: string;
  supportingDescriptor: string | null;
  location: string | null;
  publicEmail: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  aboutText: string | null;
  availabilityLine: string | null;
}

/** Single-row table (one profile), so `.limit(1).maybeSingle()` rather than a slug lookup. Null translation (no reviewed row for this locale yet) falls back to base-table facts only — hero/about text stays empty rather than throwing. */
export async function getProfile(locale: string): Promise<Profile | null> {
  const db = await createClient();

  const { data: profile, error } = await db
    .from('profiles')
    .select(
      'full_name, primary_title, supporting_descriptor, location, public_email, github_url, linkedin_url',
    )
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed loading profile: ${error.message}`);
  if (!profile) return null;

  const { data: translation, error: translationError } = await db
    .from('profile_translations')
    .select('hero_headline, hero_subheadline, about_text, availability_line')
    .eq('locale', toLocale(locale))
    .maybeSingle();
  if (translationError) {
    throw new Error(`Failed loading profile translation: ${translationError.message}`);
  }

  return {
    fullName: profile.full_name,
    primaryTitle: profile.primary_title,
    supportingDescriptor: profile.supporting_descriptor,
    location: profile.location,
    publicEmail: profile.public_email,
    githubUrl: profile.github_url,
    linkedinUrl: profile.linkedin_url,
    heroHeadline: translation?.hero_headline ?? null,
    heroSubheadline: translation?.hero_subheadline ?? null,
    aboutText: translation?.about_text ?? null,
    availabilityLine: translation?.availability_line ?? null,
  };
}
