import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { site } from '@/shared/config/site';
import { useI18n } from '@/shared/i18n';
import { GitHubIcon } from '@/shared/components/icons/GitHubIcon';
import { LocaleSelect } from '@/shared/components/ui/LocaleSelect';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { BrandMark } from '@/shared/components/layout/BrandMark';

export type SiteHeaderVariant = 'marketing' | 'docs' | 'about';

type SiteHeaderProps = {
  variant: SiteHeaderVariant;
  /** Docs mobile nav toggle */
  mobileNavOpen?: boolean;
  onMobileNavToggle?: () => void;
  docsSuffix?: boolean;
  /** When false, parent owns sticky positioning (e.g. docs + mobile drawer). */
  sticky?: boolean;
};

export function SiteHeader({
  variant,
  mobileNavOpen,
  onMobileNavToggle,
  docsSuffix = false,
  sticky = true,
}: SiteHeaderProps) {
  const { t, path } = useI18n();

  return (
    <header
      className={
        sticky
          ? 'sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur'
          : 'border-b border-border bg-background/90 backdrop-blur'
      }
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        <BrandMark />
        {docsSuffix && (
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">/ docs</span>
        )}

        {variant === 'marketing' && (
          <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#libraries" className="hover:text-foreground">
              {t.nav.libraries}
            </a>
            <a href="#quick-start" className="hover:text-foreground">
              {t.nav.quickStart}
            </a>
            <a href="#concepts" className="hover:text-foreground">
              {t.nav.concepts}
            </a>
            <Link to={path('/docs')} className="hover:text-foreground">
              {t.nav.docs}
            </Link>
            <Link to={path('/about')} className="hover:text-foreground">
              {t.nav.about}
            </Link>
          </nav>
        )}

        {variant === 'about' && (
          <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <Link to={path('/docs')} className="hover:text-foreground">
              {t.nav.docs}
            </Link>
            <Link to={path('/about')} className="font-medium text-foreground">
              {t.nav.about}
            </Link>
          </nav>
        )}

        {variant === 'docs' && (
          <nav className="ml-4 hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link to={path('/about')} className="hover:text-foreground">
              {t.nav.about}
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <LocaleSelect />
          <ThemeToggle />
          <a
            href={site.githubOrgUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          >
            <GitHubIcon className="size-4" /> {t.nav.github}
          </a>
          {variant === 'docs' && onMobileNavToggle && (
            <button
              type="button"
              aria-label={mobileNavOpen ? t.docs.closeNav : t.docs.openNav}
              onClick={onMobileNavToggle}
              className="grid size-9 place-items-center rounded-md border border-border lg:hidden"
            >
              {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
