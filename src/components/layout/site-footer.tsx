import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';

const links = [
  { href: 'mailto:thejoharrizvi@gmail.com', label: 'Email', icon: Mail },
  { href: 'https://github.com/JoharR1zvi', label: 'GitHub', icon: GithubIcon },
  { href: 'https://www.linkedin.com/in/johar-rizvi/', label: 'LinkedIn', icon: LinkedinIcon },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <p>&copy; {new Date().getFullYear()} Johar Rizvi. Oldenburg, Germany.</p>
        <div className="flex items-center gap-4">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
