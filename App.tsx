import React, { useEffect } from 'react';
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
import { LanguageProvider } from './contexts/LanguageContext';
import { PlacementTestProvider } from './contexts/PlacementTestContext';
import { ViewProvider } from './contexts/ViewContext';
import { getReducedMotionBehavior, scrollToAnchor } from './utils/scroll';

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

const App: React.FC = () => (
  <LanguageProvider>
    <PlacementTestProvider>
      <ViewProvider>
        <BrowserRouter>
          <ScrollRestoration />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ViewProvider>
    </PlacementTestProvider>
  </LanguageProvider>
);

export default App;
