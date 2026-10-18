import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DEFAULT_LOCALE,
  detectLocale,
  isLocale,
  localePath,
  LOCALES,
  LOCALE_STORAGE_KEY,
  type Locale,
} from './locales';
import { en, type Messages } from './messages/en';
import { it } from './messages/it';

const catalogs: Record<Locale, Messages> = { en, it };

type I18nContextValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
  path: (path?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const navigate = useNavigate();
  const locale: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      const rest = window.location.pathname.replace(/^\/(en|it)(?=\/|$)/, '') || '';
      const search = window.location.search;
      const hash = window.location.hash;
      navigate(`/${next}${rest}${search}${hash}`);
    },
    [navigate],
  );

  const path = useCallback((p = '') => localePath(locale, p), [locale]);

  const value = useMemo(
    () => ({ locale, t: catalogs[locale], setLocale, path }),
    [locale, setLocale, path],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useOptionalI18n() {
  return useContext(I18nContext);
}

export { localePath, isLocale, detectLocale, DEFAULT_LOCALE, LOCALES };
export type { Locale, Messages };
