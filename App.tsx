import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Methodology } from './components/Methodology';
import { Teachers } from './components/Teachers';
import { Courses } from './components/Courses';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { CourseAdvisorModal } from './components/CourseAdvisorModal';
import { StudentPortal } from './components/StudentPortal';
import { ApplicationForm } from './components/ApplicationForm';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { DocumentConsent } from './components/legal/DocumentConsent';
import { GDPRNotice } from './components/legal/GDPRNotice';
import { AdminPage } from './components/admin/AdminPage';
import { SupabaseAdminRoute } from './src/components/admin/SupabaseAdminRoute';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { PlacementTestProvider } from './contexts/PlacementTestContext';
import { AppView, UserRole } from './types';
import { LogOut } from 'lucide-react';

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

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

// Protected Route Component
const ProtectedRoute: React.FC<{ 
    children: React.ReactNode, 
    role?: UserRole,
    fallback?: AppView
}> = ({ children, role, fallback = 'LANDING' }) => {
    const { user, authReady, setCurrentView } = useAuth();

    useEffect(() => {
        if (!authReady) return;
        if (!user && role !== 'admin') {
            setCurrentView(fallback);
        } else if (role && user.role !== role && role !== 'admin') {
            setCurrentView(fallback);
        }
    }, [authReady, user, role, fallback, setCurrentView]);

    if (!authReady) {
        return null;
    }

    if (role === 'admin' && (!user || user.role !== 'admin')) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto">
                    <LogOut className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Not authorized</h2>
                    <p className="text-gray-600">You need admin access to view this page.</p>
                </div>
                <button
                    onClick={() => setCurrentView('LANDING')}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-madinah-green text-white font-semibold hover:bg-madinah-green/90 transition-colors"
                >
                    Go back home
                </button>
            </div>
        );
    }

    if (!user || (role && user.role !== role)) {
        return null;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentView } = useAuth();

  return (
    <>
      {currentView === 'LANDING' && <LandingPage />}
      
      {currentView === 'TESTIMONIALS' && <Testimonials />}
      
      {currentView === 'LEGAL_PRIVACY' && <PrivacyPolicy />}
      {currentView === 'LEGAL_TERMS' && <Terms />}
      {currentView === 'LEGAL_REFUNDS' && <RefundPolicy />}
      {currentView === 'LEGAL_CONSENT' && <DocumentConsent />}
      {currentView === 'LEGAL_GDPR' && <GDPRNotice />}


      
      {currentView === 'STUDENT_PORTAL' && (
          <ProtectedRoute role="student">
              <StudentPortal />
          </ProtectedRoute>
      )}
      
      {currentView === 'APPLICATION' && (
          <ProtectedRoute role="student">
              <ApplicationForm />
          </ProtectedRoute>
      )}
      
      {currentView === 'ADMIN_DASHBOARD' && (
          <ProtectedRoute role="admin">
              <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading admin…</div>}>
                <AdminDashboard />
              </Suspense>
          </ProtectedRoute>
      )}
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

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <PlacementTestProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<AppContent />} />
                  <Route
                    path="/admin"
                    element={
                      <SupabaseAdminRoute>
                        <AdminPage />
                      </SupabaseAdminRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </PlacementTestProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
