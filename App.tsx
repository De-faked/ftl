import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Methodology } from './components/Methodology';
import { Teachers } from './components/Teachers';
import { Courses } from './components/Courses';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { CourseAdvisorModal } from './components/CourseAdvisorModal';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { CookiePolicy } from './components/legal/CookiePolicy';
import { SupabaseAdminRoute } from './src/components/admin/SupabaseAdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { PlacementTestProvider } from './contexts/PlacementTestContext';
import { useView } from './contexts/ViewContext';

const AdminPage = lazy(() => import('./components/admin/AdminPage').then((m) => ({ default: m.AdminPage })));
const StudentPortalPage = lazy(() => import('./src/pages/StudentPortalPage').then((m) => ({ default: m.StudentPortalPage })));
const AuthPage = lazy(() => import('./src/pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const ForgotPasswordPage = lazy(() => import('./src/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const UpdatePasswordPage = lazy(() => import('./src/pages/UpdatePasswordPage').then((m) => ({ default: m.UpdatePasswordPage })));
const CheckoutPage = lazy(() => import('./src/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const PaymentReturnPage = lazy(() => import('./src/pages/PaymentReturnPage').then((m) => ({ default: m.PaymentReturnPage })));
const GalleryPage = lazy(() => import('./src/pages/GalleryPage'));

const RouteFallback: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center py-20 text-center text-gray-500">
      {t.common.loading}
    </div>
  );
};

const LandingPage: React.FC = () => {
    // Smooth scroll behavior for anchor links
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(anchor.hash);
            if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            }
        }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <main>
            <Hero />
            <About />
            <Methodology />
            <Teachers />
            <Courses />
            <FAQ />
            <Contact />
            <CourseAdvisorModal />
        </main>
    )
}

const AppContent: React.FC = () => {
  const { currentView } = useView();
  const { pathname } = useLocation();
  const isAppRoute =
    pathname === '/portal' ||
    pathname === '/admin' ||
    pathname === '/checkout' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/payment');

  return (
    <>
      {currentView === 'LANDING' && !isAppRoute && <LandingPage />}

      {currentView === 'PRIVACY_POLICY' && <PrivacyPolicy />}
      {currentView === 'TERMS_OF_SERVICE' && <Terms />}
      {currentView === 'REFUND_POLICY' && <RefundPolicy />}
      {currentView === 'COOKIE_POLICY' && <CookiePolicy />}
    </>
  );
};

const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navigation />
    <Outlet />
    <Footer />
  </div>
);

const ScrollRestoration: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CartProvider>
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
                <Route
                  path="/auth"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <AuthPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ForgotPasswordPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/auth/update-password"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <UpdatePasswordPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/portal"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <StudentPortalPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <CheckoutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/payment/return"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PaymentReturnPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <SupabaseAdminRoute>
                        <AdminPage />
                      </SupabaseAdminRoute>
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </PlacementTestProvider>
      </CartProvider>
    </LanguageProvider>
  );
};

export default App;
