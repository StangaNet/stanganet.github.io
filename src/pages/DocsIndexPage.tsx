import { Link } from 'react-router-dom';
import { getLibraries, allTypesCount } from '../data/docs';
import { KindBadge } from '../components/docs/primitives';
import { useI18n } from '../i18n';

export function DocsIndexPage() {
  const { t, path, locale } = useI18n();
  const libraries = getLibraries(locale);

  return (
    <div className="min-w-0">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t.docs.apiReference}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.docs.libraries}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {t.docs.librariesLead} {allTypesCount} {t.docs.typesDocumented}.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {libraries.map((library) => {
          const typeCount = library.namespaces.reduce((sum, ns) => sum + ns.types.length, 0);
          return (
            <Link
              key={library.slug}
              to={path(`/docs/${library.slug}`)}
              className="min-w-0 rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-mono text-base font-semibold">{library.name}</h2>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  v{library.version}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{library.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">
                  {typeCount} {t.docs.typesDocumented}
                </span>
                <span>·</span>
                {library.targetFrameworks.map((fw) => (
                  <span key={fw} className="font-mono">
                    {fw}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {library.namespaces.slice(0, 3).map((ns) =>
                  ns.types[0] ? <KindBadge key={ns.name} kind={ns.types[0].kind} /> : null,
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
