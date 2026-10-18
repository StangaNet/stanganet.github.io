import { Link } from 'react-router-dom';
import { site } from '@/shared/config/site';
import { useI18n } from '@/shared/i18n';

export function AboutPage() {
  const { t, path } = useI18n();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t.about.label}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.about.title}</h1>
      <p className="mt-4 text-lg leading-7 text-muted-foreground">
        {t.about.leadBefore} <strong className="text-foreground">StangaNetLib</strong>{' '}
        {t.about.leadAfter}
      </p>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">{t.about.authorTitle}</h2>
        <p className="leading-7 text-muted-foreground">
          {t.about.authorBefore}{' '}
          <a
            href={site.authorGithubUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Enrico Stangherlin
          </a>
          {t.about.authorMid}{' '}
          <a
            href={site.authorPortfolioUrl}
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
              href={site.authorPortfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t.about.linkPortfolio}
            </a>
          </li>
          <li>
            <a
              href={site.githubOrgUrl}
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
  );
}
