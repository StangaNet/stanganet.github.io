import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Boxes, Check, Shield, Workflow, Zap } from 'lucide-react';
import { getLibraries } from '@/content/docs/registry';
import { CodeBlock } from '@/features/docs/components/primitives';
import { getLibraryHighlights } from '@/features/marketing/homeHighlights';
import { GitHubIcon } from '@/shared/components/icons/GitHubIcon';
import { Button } from '@/shared/components/ui/button';
import { site } from '@/shared/config/site';
import { useI18n } from '@/shared/i18n';

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

export function HomePage() {
  const { t, path, locale } = useI18n();
  const libraries = getLibraries(locale);
  const core = libraries.find((l) => l.slug === 'core');
  const coreVersion = core?.version ?? '1.0.0';

  const concepts = [
    { title: t.home.conceptDomainTitle, copy: t.home.conceptDomainCopy, icon: Boxes },
    { title: t.home.conceptOutcomesTitle, copy: t.home.conceptOutcomesCopy, icon: Check },
    { title: t.home.conceptQueryTitle, copy: t.home.conceptQueryCopy, icon: Workflow },
    { title: t.home.conceptBoundariesTitle, copy: t.home.conceptBoundariesCopy, icon: Shield },
  ] as const;

  return (
    <>
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
              <a href={site.githubOrgUrl} target="_blank" rel="noreferrer">
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
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t.home.suiteLabel}
          </p>
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
                  {getLibraryHighlights(locale, lib.slug).map(([name, desc]) => (
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
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t.home.quickLabel}
            </p>
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
  value="${site.nugetFeedUrl}" />`}
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
              <p className="font-mono text-xs uppercase tracking-wide text-background/60">
                {t.home.conceptsLabel}
              </p>
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
              <a href={site.githubOrgUrl} target="_blank" rel="noreferrer">
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
    </>
  );
}
