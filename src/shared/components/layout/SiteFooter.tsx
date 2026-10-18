import { Link } from 'react-router-dom';
import { site } from '@/shared/config/site';
import { useI18n } from '@/shared/i18n';
import { BrandMark } from '@/shared/components/layout/BrandMark';

export type SiteFooterVariant = 'marketing' | 'docs' | 'about';

export function SiteFooter({ variant }: { variant: SiteFooterVariant }) {
  const { t, path } = useI18n();

  if (variant === 'docs') {
    return (
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-foreground">{t.brand}</span>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.docsFooter}</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link to={path()} className="hover:text-foreground">
              {t.nav.home}
            </Link>
            <Link to={path('/about')} className="hover:text-foreground">
              {t.nav.about}
            </Link>
            <a
              href={site.githubOrgUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {t.nav.github}
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark toHome={false} />
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.footer.blurb}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t.footer.site}
          </p>
          <ul className="mt-3 grid gap-2 text-sm">
            {variant === 'about' && (
              <li>
                <Link to={path()} className="text-muted-foreground hover:text-foreground">
                  {t.nav.home}
                </Link>
              </li>
            )}
            <li>
              <Link to={path('/docs')} className="text-muted-foreground hover:text-foreground">
                {t.nav.apiDocs}
              </Link>
            </li>
            <li>
              <Link to={path('/about')} className="text-muted-foreground hover:text-foreground">
                {t.nav.about}
              </Link>
            </li>
            {variant === 'marketing' && (
              <li>
                <a href="#libraries" className="text-muted-foreground hover:text-foreground">
                  {t.nav.libraries}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t.footer.links}
          </p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <a
                href={site.githubOrgUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.footer.githubOrg}
              </a>
            </li>
            <li>
              <a
                href={site.authorGithubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.footer.author}
              </a>
            </li>
            <li>
              <a
                href={site.authorPortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                {t.footer.portfolio}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <span>{t.footer.tagline}</span>
          <span className="font-mono">{t.footer.frameworks}</span>
        </div>
      </div>
    </footer>
  );
}
