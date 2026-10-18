import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import { useEffect } from 'react';
import { DocsShell } from '@/features/docs/DocsShell';
import { DocsIndexPage } from '@/features/docs/pages/DocsIndexPage';
import { ExamplesPage } from '@/features/docs/pages/ExamplesPage';
import { LibraryPage } from '@/features/docs/pages/LibraryPage';
import { TypePage } from '@/features/docs/pages/TypePage';
import { AboutPage } from '@/features/marketing/AboutPage';
import { HomePage } from '@/features/marketing/HomePage';
import { NotFound } from '@/features/marketing/NotFound';
import { SiteShell } from '@/shared/components/layout/SiteShell';
import { I18nProvider, detectLocale, isLocale } from '@/shared/i18n';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LocaleLayout() {
  const { lang } = useParams();
  if (!isLocale(lang)) {
    return <Navigate to={`/${detectLocale()}`} replace />;
  }
  return (
    <I18nProvider>
      <Outlet />
    </I18nProvider>
  );
}

function RootRedirect() {
  return <Navigate to={`/${detectLocale()}`} replace />;
}

function PrefixLocaleRedirect() {
  const location = useLocation();
  const locale = detectLocale();
  return (
    <Navigate
      to={`/${locale}${location.pathname}${location.search}${location.hash}`}
      replace
    />
  );
}

function MarketingHomeShell() {
  return <SiteShell variant="marketing" />;
}

function MarketingAboutShell() {
  return <SiteShell variant="about" />;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/:lang" element={<LocaleLayout />}>
          <Route element={<MarketingHomeShell />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route element={<MarketingAboutShell />}>
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="docs" element={<DocsShell />}>
            <Route index element={<DocsIndexPage />} />
            <Route path=":library" element={<LibraryPage />} />
            <Route path=":library/examples" element={<ExamplesPage />} />
            <Route path=":library/:type" element={<TypePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/about" element={<PrefixLocaleRedirect />} />
        <Route path="/docs/*" element={<PrefixLocaleRedirect />} />
        <Route path="/core" element={<Navigate to={`/${detectLocale()}/docs/core`} replace />} />
        <Route
          path="/core/:page"
          element={<Navigate to={`/${detectLocale()}/docs/core`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
