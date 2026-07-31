import { describe, expect, it } from 'vitest';
import { routing } from '@/i18n/routing';

describe('i18n routing config', () => {
  it('supports English and German locales', () => {
    expect(routing.locales).toEqual(['en', 'de']);
  });

  it('defaults to English', () => {
    expect(routing.defaultLocale).toBe('en');
  });

  it('always prefixes routes with the locale', () => {
    expect(routing.localePrefix).toBe('always');
  });
});
