import { Link, useParams } from 'react-router-dom';
import { getLibrary } from '@/content/docs/registry';
import { DocsBreadcrumb } from '@/features/docs/components/DocsBreadcrumb';
import { CodeBlock, InlineCode, KindBadge } from '@/features/docs/components/primitives';
import { NotFound } from '@/features/marketing/NotFound';
import { GitHubIcon } from '@/shared/components/icons/GitHubIcon';
import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/i18n';

export function LibraryPage() {
  const { library: slug } = useParams<{ library: string }>();
  const { t, path, locale } = useI18n();
  const library = slug ? getLibrary(slug, locale) : undefined;
  if (!library) return <NotFound />;

  return (
    <div className="min-w-0">
      <DocsBreadcrumb crumbs={[{ label: library.slug }]} />
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{library.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{library.tagline}</p>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{library.description}</p>
      <p className="mt-4">
        <Link
          to={path(`/docs/${library.slug}/examples`)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t.docs.examples} →
        </Link>
      </p>

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
