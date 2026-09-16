import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { HomePage } from './pages/HomePage';
import { DocsLayout } from './components/layout/DocsLayout';
import { DocsIndexPage } from './pages/DocsIndexPage';
import { LibraryPage } from './pages/LibraryPage';
import { TypePage } from './pages/TypePage';
import { ExamplesPage } from './pages/ExamplesPage';
import { NotFound } from './pages/NotFound';
import { AboutPage } from './pages/AboutPage';
import { I18nProvider, detectLocale, isLocale } from './i18n';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LocaleGate({ children }: { children: ReactNode }) {
  const { lang } = useParams();
  if (!isLocale(lang)) {
    return <Navigate to={`/${detectLocale()}`} replace />;
  }
  return <I18nProvider>{children}</I18nProvider>;
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

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/:lang"
          element={
            <LocaleGate>
              <HomePage />
            </LocaleGate>
          }
        />
        <Route
          path="/:lang/about"
          element={
            <LocaleGate>
              <AboutPage />
            </LocaleGate>
          }
        />
        <Route
          path="/:lang/docs"
          element={
            <LocaleGate>
              <DocsLayout />
            </LocaleGate>
          }
        >
          <Route index element={<DocsIndexPage />} />
          <Route path=":library" element={<LibraryPage />} />
          <Route path=":library/examples" element={<ExamplesPage />} />
          <Route path=":library/:type" element={<TypePage />} />
        </Route>

        {/* Paths without locale → same path under detected locale */}
        <Route path="/about" element={<PrefixLocaleRedirect />} />
        <Route path="/docs/*" element={<PrefixLocaleRedirect />} />
        <Route path="/core" element={<Navigate to={`/${detectLocale()}/docs/core`} replace />} />
        <Route path="/core/:page" element={<Navigate to={`/${detectLocale()}/docs/core`} replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
