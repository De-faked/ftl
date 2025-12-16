import React, { useEffect } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { ApplicationForm } from './components/ApplicationForm';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { Terms } from './components/legal/Terms';
import { RefundPolicy } from './components/legal/RefundPolicy';
import { DocumentConsent } from './components/legal/DocumentConsent';
import { GDPRNotice } from './components/legal/GDPRNotice';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppView, UserRole } from './types';
import { FLOATING_CTA_CLEARANCE } from './utils/layout';

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
        if (!user) {
            setCurrentView(fallback);
        } else if (role && user.role !== role) {
            setCurrentView(fallback);
        }
    }, [authReady, user, role, fallback, setCurrentView]);

    if (!authReady) {
        return null;
    }

    if (!user || (role && user.role !== role)) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentView } = useAuth();

  return (
    <div
      className="min-h-screen bg-white"
      style={{ paddingBottom: FLOATING_CTA_CLEARANCE }}
    >
      <Navigation />
      
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
              <AdminDashboard />
          </ProtectedRoute>
      )}
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
            <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;