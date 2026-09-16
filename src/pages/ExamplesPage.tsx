import { Link, useParams } from 'react-router-dom';
import { getLibrary } from '../data/docs';
import { getLibraryExamples } from '../data/docs/examples';
import { CodeBlock } from '../components/docs/primitives';
import { useI18n } from '../i18n';

export function ExamplesPage() {
  const { library: slug } = useParams();
  const { t, path, locale } = useI18n();
  const library = slug ? getLibrary(slug, locale) : undefined;
  const examples = slug ? getLibraryExamples(slug) : undefined;

  if (!library || !examples) {
    return (
      <div className="min-w-0">
        <h1 className="text-2xl font-bold">{t.notFound.heading}</h1>
        <p className="mt-2 text-muted-foreground">{t.notFound.body}</p>
        <Link to={path('/docs')} className="mt-4 inline-block text-primary hover:underline">
          {t.docs.apiReference}
        </Link>
      </div>
    );
  }

  const intro = examples.intro[locale === 'it' ? 'it' : 'en'];

  return (
    <div className="min-w-0">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {library.name}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {t.docs.examples}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{intro}</p>

      <p className="mt-4">
        <Link
          to={path(`/docs/${library.slug}`)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← {t.docs.overview}
        </Link>
      </p>

      <div className="mt-10 space-y-12">
        {examples.sections.map((section) => {
          const title = section.title[locale === 'it' ? 'it' : 'en'];
          const description = section.description?.[locale === 'it' ? 'it' : 'en'];
          return (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
              ) : null}
              <div className="mt-4">
                <CodeBlock code={section.code} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
