import 'server-only';
import { createClient } from '@/lib/db/server';
import type { Database } from '@/types/supabase';

type Locale = Database['public']['Enums']['locale_code'];

function toLocale(locale: string): Locale {
  return locale as Locale;
}

export interface Certification {
  name: string;
  issuer: string | null;
  issueDate: string | null;
}

export async function getCertifications(locale: string): Promise<Certification[]> {
  const db = await createClient();

  const { data, error } = await db
    .from('certifications')
    .select('issuer, issue_date, certification_translations!inner(name)')
    .eq('certification_translations.locale', toLocale(locale));
  if (error) throw new Error(`Failed loading certifications: ${error.message}`);

  return (data ?? []).flatMap((cert) => {
    const translation = cert.certification_translations[0];
    if (!translation) return [];
    return [{ name: translation.name, issuer: cert.issuer, issueDate: cert.issue_date }];
  });
}
