import { Link, useParams } from 'react-router-dom';
import { getLibrary } from '../data/docs';
import { CodeBlock, InlineCode, KindBadge } from '../components/docs/primitives';
import { Button } from '../components/ui/button';
import { NotFound } from './NotFound';
import { useI18n } from '../i18n';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function LibraryPage() {
  const { library: slug } = useParams<{ library: string }>();
  const { t, path, locale } = useI18n();
  const library = slug ? getLibrary(slug, locale) : undefined;
  if (!library) return <NotFound />;

  return (
    <div className="min-w-0">
      <nav className="min-w-0 font-mono text-xs text-muted-foreground">
        <Link to={path('/docs')} className="hover:text-foreground">
          docs
        </Link>
        <span> / {library.slug}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{library.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{library.tagline}</p>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{library.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
          v{library.version}
        </span>
        {library.targetFrameworks.map((framework) => (
          <span
            key={framework}
            className="rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
          >
            {framework}
          </span>
        ))}
        <a href={library.repository} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm" type="button">
            <GitHubIcon className="size-4" /> {t.docs.repository}
          </Button>
        </a>
      </div>

      <div className="mt-8 max-w-2xl">
        <CodeBlock
          label={t.docs.install}
          lang="bash"
          code={`dotnet add package ${library.name} --version ${library.version}`}
        />
      </div>

      <div className="mt-12 grid gap-8">
        {library.namespaces.map((ns) => (
          <section key={ns.name} className="min-w-0">
            <h2 className="font-mono text-lg font-bold">{ns.name}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{ns.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ns.types.map((type) => (
                <Link
                  key={type.slug}
                  to={path(`/docs/${library.slug}/${type.slug}`)}
                  className="min-w-0 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <KindBadge kind={type.kind} />
                    <span className="truncate font-mono text-sm font-semibold">{type.displayName}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{type.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        {t.docs.namespacesImport} <InlineCode>using {library.namespaces[0]?.name};</InlineCode>
      </p>
    </div>
  );
}
