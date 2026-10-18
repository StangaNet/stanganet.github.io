import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getLibraries } from '@/content/docs/registry';
import { cn } from '@/shared/lib/utils';
import { useI18n } from '@/shared/i18n';
import { SiteHeader } from '@/shared/components/layout/SiteHeader';
import { SiteFooter } from '@/shared/components/layout/SiteFooter';

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
            <NavLink
              to={path(`/docs/${library.slug}/examples`)}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'block rounded px-2 py-1 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {t.docs.examples}
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

export function DocsShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <SiteHeader
          variant="docs"
          docsSuffix
          sticky={false}
          mobileNavOpen={open}
          onMobileNavToggle={() => setOpen((value) => !value)}
        />
        {open && (
          <div className="docs-sidebar-scroll max-h-[70vh] overflow-y-auto border-b border-border bg-background px-4 py-6 lg:hidden">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>

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

      <SiteFooter variant="docs" />
    </div>
  );
}
