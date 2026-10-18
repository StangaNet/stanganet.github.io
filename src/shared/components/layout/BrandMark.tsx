import { Link } from 'react-router-dom';
import { site } from '@/shared/config/site';
import { useI18n } from '@/shared/i18n';

export function BrandMark({ toHome = true }: { toHome?: boolean }) {
  const { t, path } = useI18n();
  const inner = (
    <>
      <span className="grid size-8 place-items-center rounded bg-primary font-mono text-sm font-bold text-primary-foreground">
        {site.brandMark}
      </span>
      <span className="font-bold tracking-tight">{t.brand}</span>
    </>
  );

  if (!toHome) {
    return <div className="flex items-center gap-2">{inner}</div>;
  }

  return (
    <Link to={path()} className="flex items-center gap-2">
      {inner}
    </Link>
  );
}
