import { LOCALES, useI18n, type Locale } from '@/shared/i18n';

export function LocaleSelect() {
  const { t, locale, setLocale } = useI18n();
  return (
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
  );
}
