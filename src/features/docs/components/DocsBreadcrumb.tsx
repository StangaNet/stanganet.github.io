import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/shared/i18n';

type Crumb = { label: string; to?: string };

export function DocsBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const { t, path } = useI18n();
  const items: Crumb[] = [{ label: t.nav.docs, to: path('/docs') }, ...crumbs];

  return (
    <nav className="min-w-0 font-mono text-xs text-muted-foreground">
      {items.map((crumb, i) => (
        <Fragment key={`${crumb.label}-${i}`}>
          {i > 0 && ' / '}
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-foreground">
              {crumb.label}
            </Link>
          ) : (
            <span className="break-all">{crumb.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
