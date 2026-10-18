export const LOCALES = ['en', 'it'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'stanganet-locale';

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'it';
}

/** Prefer stored locale, then browser, then default. */
export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined') {
    const lang = (navigator.language || '').toLowerCase();
    if (lang.startsWith('it')) return 'it';
  }
  return DEFAULT_LOCALE;
}

export function localePath(locale: Locale, path = ''): string {
  const clean = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `/${locale}${clean === '/' ? '' : clean}` || `/${locale}`;
}
