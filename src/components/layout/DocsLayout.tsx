import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { getLibraries } from '../../data/docs';
import { cn } from '../../lib/utils';
import { useTheme } from '../../theme/theme';
import { LOCALES, useI18n, type Locale } from '../../i18n';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LibraryNavGroup({
  library,
  onNavigate,
}: {
  library: ReturnType<typeof getLibraries>[number];
  onNavigate?: () => void;
}) {
  const { path, t } = useI18n();
  const { pathname } = useLocation();
  const base = path(`/docs/${library.slug}`);
  const containsActive = pathname.startsWith(base);
  const [open, setOpen] = useState(containsActive);
  const expanded = open || containsActive;

  return (
    <div className="min-w-0">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <span
          className={cn(
            'inline-block size-0 border-y-4 border-l-[6px] border-y-transparent border-l-current transition-transform',
            expanded && 'rotate-90',
          )}
          aria-hidden
        />
        <span className="truncate">{library.name}</span>
      </button>
      {expanded && (
        <div className="mt-3 grid gap-5 border-l border-border pl-3">
          <div className="min-w-0">
            <NavLink
              to={path(`/docs/${library.slug}`)}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'block truncate rounded px-2 py-1 font-mono text-[12.5px] text-muted-foreground hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted font-medium text-foreground',
                )
              }
            >
              {t.docs.overview}
            </NavLink>
          </div>
          {library.namespaces.map((ns) => (
            <div key={ns.name} className="min-w-0">
              <p className="truncate font-mono text-[11px] text-muted-foreground/70">{ns.name}</p>
              <ul className="mt-2 grid gap-1">
                {ns.types.map((type) => (
                  <li key={type.slug} className="min-w-0">
                    <NavLink
                      to={path(`/docs/${library.slug}/${type.slug}`)}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'block truncate rounded px-2 py-1 font-mono text-[12.5px] text-muted-foreground hover:bg-muted hover:text-foreground',
                          isActive && 'bg-muted font-medium text-foreground',
                        )
                      }
                    >
                      {type.displayName}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { path, t, locale } = useI18n();
  const libraries = getLibraries(locale);
  return (
    <nav className="grid gap-8 text-sm">
      <div>
        <NavLink
          to={path('/docs')}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'font-mono text-[11px] uppercase tracking-wide hover:text-foreground',
              isActive ? 'font-semibold text-foreground' : 'text-muted-foreground',
            )
          }
        >
          {t.docs.apiReference}
        </NavLink>
      </div>
      {libraries.map((library) => (
        <LibraryNavGroup key={library.slug} library={library} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}


export function DocsLayout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, path, locale, setLocale } = useI18n();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link to={path()} className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded bg-primary font-mono text-sm font-bold text-primary-foreground">
              S/
            </span>
            <span className="font-bold tracking-tight">{t.brand}</span>
          </Link>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">/ docs</span>
          <nav className="ml-4 hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link to={path('/about')} className="hover:text-foreground">
              {t.nav.about}
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <select
              id="docs-locale"
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
              aria-label={isDark ? t.theme.toLight : t.theme.toDark}
              className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <a
              href="https://github.com/StangaNet"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground sm:inline-flex"
            >
              <GitHubIcon className="size-4" /> {t.nav.github}
            </a>
            <button
              type="button"
              aria-label={open ? t.docs.closeNav : t.docs.openNav}
              onClick={() => setOpen((value) => !value)}
              className="grid size-9 place-items-center rounded-md border border-border lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="docs-sidebar-scroll max-h-[70vh] overflow-y-auto border-t border-border bg-background px-4 py-6 lg:hidden">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-10 px-4 sm:px-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="docs-sidebar-scroll sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-2">
            <SidebarNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 py-10">
          <Outlet />
        </main>
      </div>

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
            <a href="https://github.com/StangaNet" target="_blank" rel="noreferrer" className="hover:text-foreground">
              {t.nav.github}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
