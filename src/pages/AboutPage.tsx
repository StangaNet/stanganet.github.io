import { Link } from 'react-router-dom';
import { useTheme } from '../theme/theme';
import { LOCALES, useI18n, type Locale } from '../i18n';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { t, path, locale, setLocale } = useI18n();
  const isDark = theme === 'dark';
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        <Link to={path()} className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded bg-primary font-mono text-sm font-bold text-primary-foreground">
            S/
          </span>
          <span className="font-bold tracking-tight">{t.brand}</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <Link to={path('/docs')} className="hover:text-foreground">
            {t.nav.docs}
          </Link>
          <Link to={path('/about')} className="font-medium text-foreground">
            {t.nav.about}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <select
            aria-label={t.locale.label}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="h-9 rounded-md border border-border bg-background px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={isDark ? t.theme.toLight : t.theme.toDark}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z" />
              </svg>
            )}
          </button>
          <a
            href="https://github.com/StangaNet"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-md border border-input px-3 text-sm font-medium hover:bg-accent sm:inline-flex"
          >
            <GitHubIcon className="size-4" /> {t.nav.github}
          </a>
        </div>
      </div>
    </header>
  );
}

export function AboutPage() {
  const { t, path } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t.about.label}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.about.title}</h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">
          {t.about.leadBefore}{' '}
          <strong className="text-foreground">StangaNetLib</strong> {t.about.leadAfter}
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">{t.about.authorTitle}</h2>
          <p className="leading-7 text-muted-foreground">
            {t.about.authorBefore}{' '}
            <a
              href="https://github.com/stangherlin-enrico/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Enrico Stangherlin
            </a>
            {t.about.authorMid}{' '}
            <a
              href="https://stangherlin-enrico.github.io/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t.about.authorPortfolio}
            </a>
            {t.about.authorAfter}
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">{t.about.libsTitle}</h2>
          <p className="leading-7 text-muted-foreground">{t.about.libsBody}</p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">{t.about.siteTitle}</h2>
          <p className="leading-7 text-muted-foreground">{t.about.siteBody1}</p>
          <p className="leading-7 text-muted-foreground">{t.about.siteBody2}</p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">{t.about.linksTitle}</h2>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://stangherlin-enrico.github.io/"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t.about.linkPortfolio}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/StangaNet"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                {t.about.linkOrg}
              </a>
            </li>
            <li>
              <Link to={path('/docs')} className="text-primary underline-offset-4 hover:underline">
                {t.about.linkApi}
              </Link>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded bg-primary font-mono text-sm font-bold text-primary-foreground">
                S/
              </span>
              <span className="font-semibold tracking-tight">{t.brand}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{t.footer.blurb}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.footer.site}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <Link to={path()} className="text-muted-foreground hover:text-foreground">
                  {t.nav.home}
                </Link>
              </li>
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
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.footer.links}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <a
                  href="https://github.com/StangaNet"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t.footer.githubOrg}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/stangherlin-enrico/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t.footer.author}
                </a>
              </li>
              <li>
                <a
                  href="https://stangherlin-enrico.github.io/"
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
    </div>
  );
}
