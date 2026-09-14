import { Link } from 'react-router-dom';
import { detectLocale, localePath } from '../i18n';
import { en } from '../i18n/messages/en';
import { it } from '../i18n/messages/it';

export function NotFound() {
  const locale = detectLocale();
  const t = locale === 'it' ? it : en;

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t.notFound.title}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.notFound.heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.notFound.body}</p>
        <div className="mt-6">
          <Link
            to={localePath(locale)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.notFound.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
