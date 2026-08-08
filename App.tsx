import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { PartnerCardsStrip } from './components/PartnerCardsStrip';
import { About } from './components/About';
import { Methodology } from './components/Methodology';
import { Teachers } from './components/Teachers';
import { Courses } from './components/Courses';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { CookiePolicy } from './components/legal/CookiePolicy';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PlacementTestProvider } from './contexts/PlacementTestContext';
import { useView } from './contexts/ViewContext';
import { getReducedMotionBehavior, scrollToAnchor } from './utils/scroll';

const GalleryPage = lazy(() => import('./src/pages/GalleryPage'));

const RouteFallback: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center py-20 text-center text-gray-500">
      {t.common.loading}
    </div>
  );
};

const LandingPage: React.FC = () => (
  <main>
    <Hero />
    <PartnerCardsStrip />
    <About />
    <Methodology />
    <Teachers />
    <Courses compact />
    <FAQ />
    <Contact />
</main>
);

const AppContent: React.FC = () => {
  const { currentView } = useView();

  return (
    <>
      {currentView === 'LANDING' && <LandingPage />}

      {currentView === 'PRIVACY_POLICY' && <PrivacyPolicy />}
      {currentView === 'TERMS_OF_SERVICE' && <Terms />}
      {currentView === 'REFUND_POLICY' && <RefundPolicy />}
      {currentView === 'COOKIE_POLICY' && <CookiePolicy />}
    </>
  );
};

const AppLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Navigation />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ScrollRestoration: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const behavior = getReducedMotionBehavior();
      if (scrollToAnchor(id, behavior)) return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <PlacementTestProvider>
        <BrowserRouter>
          <ScrollRestoration />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<AppContent />} />
              <Route
                path="/gallery"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <GalleryPage />
                  </Suspense>
                }
              />
              <Route path="/stories" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PlacementTestProvider>
    </LanguageProvider>
  );
};

export default App;
