import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import { ContactForm } from '@/components/home/contact-form';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/lib/db/profile';

export async function Contact({ profile, locale }: { profile: Profile | null; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  const links = [
    profile?.publicEmail
      ? { href: `mailto:${profile.publicEmail}`, label: t('emailMe'), icon: Mail }
      : null,
    profile?.githubUrl
      ? { href: profile.githubUrl, label: t('viewOnGithub'), icon: GithubIcon }
      : null,
    profile?.linkedinUrl
      ? { href: profile.linkedinUrl, label: t('viewOnLinkedin'), icon: LinkedinIcon }
      : null,
  ].filter((link): link is { href: string; label: string; icon: typeof Mail } => link !== null);

  return (
    <section
      id="contact"
      className="border-border mx-auto w-full max-w-3xl border-t px-4 py-16 sm:px-6"
    >
      <h2 className="font-heading text-foreground text-2xl font-semibold tracking-tight">
        {t('contact')}
      </h2>
      {profile?.availabilityLine ? (
        <p className="text-muted-foreground mt-2 max-w-2xl">{profile.availabilityLine}</p>
      ) : null}
      {links.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <Button
              key={link.label}
              variant="outline"
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
      <ContactForm />
    </section>
  );
}
