'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(nextLocale: (typeof routing.locales)[number]) {
    // Preserves the current page (and any params baked into pathname) —
    // only the locale segment changes.
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div role="group" aria-label={label} className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          variant={loc === locale ? 'secondary' : 'ghost'}
          size="sm"
          aria-pressed={loc === locale}
          onClick={() => switchTo(loc)}
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
