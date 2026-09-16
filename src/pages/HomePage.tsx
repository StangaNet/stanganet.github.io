import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Boxes, Check, Shield, Workflow, Zap } from 'lucide-react';
import { useTheme } from '../theme/theme';
import { Button } from '../components/ui/button';
import { CodeBlock } from '../components/docs/primitives';
import { getLibraries } from '../data/docs';
import { LOCALES, useI18n, type Locale } from '../i18n';

const githubOrg = 'https://github.com/StangaNet';

const libraryHighlightsEn: Record<string, readonly [string, string][]> = {
  core: [
    ['AggregateRoot<TId>', 'Domain entities with event tracking'],
    ['Result<T>', 'Explicit, functional outcomes'],
    ['ISpecification<T>', 'Encapsulated query rules'],
    ['ValueObject', 'Structural equality for domain values'],
  ],
  contentflow: [
    ['ContentItem<T>', 'Immutable content through the lifecycle'],
    ['IContentWorkflowService<T>', 'State transitions with Result'],
    ['ContentState', 'Draft → Pending → Approved → Published'],
    ['ContentReviewLog', 'Immutable review trail'],
  ],
  resilience: [
    ['IResilientExecutor', 'Execute via named pipelines → Result'],
    ['ResiliencePipelineSettings', 'Retry, circuit breaker, timeout'],
    ['ResilienceErrors', 'Typed failures instead of exceptions'],
    ['AddStangaNetLibResilience', 'DI registration from config or code'],
  ],
  concurrency: [
    ['IKeyedLock', 'Per-key async mutual exclusion'],
    ['IAsyncThrottle', 'Semaphore concurrency limiter'],
    ['IWorkQueue<T>', 'Bounded producer-consumer queue'],
    ['IDebouncer', 'Per-key debounce of async actions'],
  ],
  gdpr: [
    ['IConsentRepository', 'Consent grant / withdraw with history'],
    ['IDsarService', 'DSAR lifecycle and Art. 12 deadlines'],
    ['IPseudonymizationService', 'AES-256-GCM + SHA-256 anonymize'],
    ['RequireConsentAttribute', 'Endpoint consent enforcement'],
  ],
};

const libraryHighlightsIt: Record<string, readonly [string, string][]> = {
  core: [
    ['AggregateRoot<TId>', 'Entity di dominio con tracking degli eventi'],
    ['Result<T>', 'Esiti espliciti e funzionali'],
    ['ISpecification<T>', 'Regole di query incapsulate'],
    ['ValueObject', 'Uguaglianza strutturale per valori di dominio'],
  ],
  contentflow: [
    ['ContentItem<T>', 'Contenuto immutabile lungo il ciclo di vita'],
    ['IContentWorkflowService<T>', 'Transizioni di stato con Result'],
    ['ContentState', 'Draft → Pending → Approved → Published'],
    ['ContentReviewLog', 'Trail di review immutabile'],
  ],
  resilience: [
    ['IResilientExecutor', 'Esegui via pipeline nominate → Result'],
    ['ResiliencePipelineSettings', 'Retry, circuit breaker, timeout'],
    ['ResilienceErrors', 'Fallimenti tipizzati al posto delle eccezioni'],
    ['AddStangaNetLibResilience', 'Registrazione DI da config o codice'],
  ],
  concurrency: [
    ['IKeyedLock', 'Mutua esclusione async per chiave'],
    ['IAsyncThrottle', 'Limitatore di concorrenza a semaforo'],
    ['IWorkQueue<T>', 'Coda producer-consumer limitata'],
    ['IDebouncer', 'Debounce per chiave di azioni async'],
  ],
  gdpr: [
    ['IConsentRepository', 'Consenso grant / withdraw con cronologia'],
    ['IDsarService', 'Ciclo di vita DSAR e scadenze Art. 12'],
    ['IPseudonymizationService', 'AES-256-GCM + anonimizzazione SHA-256'],
    ['RequireConsentAttribute', 'Enforcement del consenso sugli endpoint'],
  ],
};

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function CodeWindow() {
  return (
    <CodeBlock
      label="PlaceOrder.cs"
      lang="csharp"
      code={`public async Task<Result<Guid>> PlaceOrderAsync(cmd)
{
  Guard.Against.NullOrWhiteSpace(cmd.CustomerId);

  var order = Order.Create(cmd.CustomerId, cmd.Lines);
  await _orders.AddAsync(order);
  await _uow.SaveChangesAsync();

  return order.Id;
}`}
    />
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
          <a href={githubOrg} target="_blank" rel="noreferrer" className="hidden sm:inline-flex">
            <span className="inline-flex h-9 items-center gap-2 rounded-md border border-input px-3 text-sm font-medium hover:bg-accent">
              <GitHubIcon className="size-4" /> {t.nav.github}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

export function HomePage() {
  const { t, path, locale } = useI18n();
  const libraries = getLibraries(locale);
  const core = libraries.find((l) => l.slug === 'core');
  const coreVersion = core?.version ?? '1.0.2';

  const concepts = [
    { title: t.home.conceptDomainTitle, copy: t.home.conceptDomainCopy, icon: Boxes },
    { title: t.home.conceptOutcomesTitle, copy: t.home.conceptOutcomesCopy, icon: Check },
    { title: t.home.conceptQueryTitle, copy: t.home.conceptQueryCopy, icon: Workflow },
    { title: t.home.conceptBoundariesTitle, copy: t.home.conceptBoundariesCopy, icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.06)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {t.home.badge}
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t.home.titleLine1}
              <br />
              <span className="text-primary">{t.home.titleLine2}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">{t.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={path('/docs/core')}>
                <Button type="button" className="gap-2">
                  <BookOpen className="size-4" /> {t.home.ctaStart} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href={githubOrg} target="_blank" rel="noreferrer">
                <Button type="button" variant="outline" className="gap-2">
                  <GitHubIcon className="size-4" /> {t.home.ctaSource}
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="size-4 text-primary" /> {t.home.featureZero}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="size-4 text-primary" /> {t.home.featureTyped}
              </span>
            </div>
          </div>
          <div className="lg:pt-4">
            <CodeWindow />
          </div>
        </div>
      </section>

      <section id="libraries" className="border-b border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t.home.suiteLabel}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t.home.suiteTitle}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{t.home.suiteLead}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {libraries.map((lib) => (
              <article key={lib.slug} className="rounded-md border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Boxes className="size-5 text-primary" />
                    <h3 className="font-mono text-sm font-semibold">{lib.name}</h3>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">v{lib.version}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{lib.description}</p>
                <ul className="mt-4 grid gap-2">
                  {((locale === 'it' ? libraryHighlightsIt : libraryHighlightsEn)[lib.slug] ?? (locale === 'it' ? libraryHighlightsIt : libraryHighlightsEn).core).map(([name, desc]) => (
                    <li key={name} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>
                        <code className="font-mono text-xs">{name}</code>
                        <span className="text-muted-foreground"> — {desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={path(`/docs/${lib.slug}`)}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t.home.exploreDocs} <ArrowRight className="size-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quick-start" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t.home.quickLabel}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t.home.quickTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {t.home.quickLeadBefore} <strong>StangaNetLib.Core</strong> (v{coreVersion})
              {t.home.quickLeadAfter}
            </p>
          </div>
          <ol className="grid gap-5">
            <li className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                1
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{t.home.step1Title}</h3>
                <div className="mt-2">
                  <CodeBlock
                    lang="xml"
                    code={`<add key="github"
  value="https://nuget.pkg.github.com/StangaNet/index.json" />`}
                  />
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                2
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{t.home.step2Title}</h3>
                <div className="mt-2">
                  <CodeBlock
                    lang="xml"
                    code={`<PackageReference Include="StangaNetLib.Core" Version="${coreVersion}" />`}
                  />
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                3
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{t.home.step3Title}</h3>
                <div className="mt-2">
                  <CodeBlock
                    lang="csharp"
                    code={`public sealed class Order : AggregateRoot<Guid>
{
    public void Confirm()
        => AddDomainEvent(new OrderConfirmed(Id));
}`}
                  />
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section id="concepts" className="bg-foreground py-16 text-background sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-background/60">{t.home.conceptsLabel}</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t.home.conceptsTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {concepts.map(({ title, copy, icon: Icon }) => (
                <article key={title} className="rounded-md border border-background/15 bg-background/5 p-4">
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-background/70">{copy}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-background/15 pt-8">
            <div>
              <p className="font-semibold">{t.home.ctaReady}</p>
              <p className="text-sm text-background/70">{t.home.ctaReadySub}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={path('/docs/core')}>
                <Button type="button" variant="secondary" className="gap-2">
                  <BookOpen className="size-4" /> {t.home.ctaCoreDocs} <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href={githubOrg} target="_blank" rel="noreferrer">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-background/30 bg-transparent text-background hover:bg-background/10"
                >
                  <GitHubIcon className="size-4" /> {t.home.ctaOrg}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

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
                <Link to={path('/docs')} className="text-muted-foreground hover:text-foreground">
                  {t.nav.apiDocs}
                </Link>
              </li>
              <li>
                <Link to={path('/about')} className="text-muted-foreground hover:text-foreground">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <a href="#libraries" className="text-muted-foreground hover:text-foreground">
                  {t.nav.libraries}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.footer.links}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <a href={githubOrg} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
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
