import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Canonical + hreflang alternates for a locale-agnostic pathname (no locale
 * prefix), e.g. "/projects" or `/projects/${slug}`. Relative URLs resolve
 * against the root layout's `metadataBase`.
 */
export function localeAlternates(locale: string, pathname: string): Metadata['alternates'] {
  return {
    canonical: `/${locale}${pathname}`,
    languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${pathname}`])),
  };
}
