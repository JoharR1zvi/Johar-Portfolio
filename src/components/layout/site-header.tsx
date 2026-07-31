import { Menu, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/projects', key: 'work' } as const,
  { href: '/lab', key: 'lab' } as const,
  { href: '/#about', key: 'about' } as const,
  { href: '/#journey', key: 'journey' } as const,
  { href: '/notes', key: 'notes' } as const,
  { href: '/#contact', key: 'contact' } as const,
];

export function SiteHeader() {
  const t = useTranslations('nav');

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-foreground font-heading font-semibold tracking-tight">
          Johar Rizvi
        </Link>

        <nav aria-label={t('primaryNavigation')} className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" size="sm" render={<Link href="/resume" />}>
            {t('resume')}
          </Button>
          <Button variant="default" size="sm" className="gap-1.5">
            <Sparkles className="size-4" aria-hidden="true" />
            {t('openAssistant')}
          </Button>
          <LanguageSwitcher label={t('switchLanguage')} />
          <ThemeToggle label={t('toggleTheme')} />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t('openMenu')}
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6 p-6">
            <SheetTitle>Johar Rizvi</SheetTitle>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-foreground text-base font-medium"
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link href="/resume" className="text-foreground text-base font-medium">
                {t('resume')}
              </Link>
            </nav>
            <div className="mt-auto flex items-center justify-between">
              <LanguageSwitcher label={t('switchLanguage')} />
              <ThemeToggle label={t('toggleTheme')} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
