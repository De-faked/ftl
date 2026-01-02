import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useView } from '../contexts/ViewContext';
import { INSTITUTE } from '../config/institute';
import type { AppView } from '../types';
import { Bdi } from './Bdi';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';

export const Footer: React.FC = () => {
  const { dir, t } = useLanguage();
  const { currentView, setCurrentView } = useView();
  const { user: supabaseUser, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const socialLinks =
    (INSTITUTE as { socialLinks?: Array<{ label: string; href: string }> }).socialLinks ?? [];

  const scrollToHash = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const goToLandingSection = (hash: string) => {
    const needsLanding = currentView !== 'LANDING';
    if (needsLanding) {
      setCurrentView('LANDING');
    }

    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToHash(hash), 200);
      return;
    }

    if (needsLanding) {
      setTimeout(() => scrollToHash(hash), 200);
      return;
    }

    scrollToHash(hash);
  };

  const goToView = (view: AppView) => {
    if (pathname !== '/') {
      navigate('/');
    }
    setCurrentView(view);
    if (pathname === '/') {
      scrollToTop();
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 mt-12 print:hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-madinah-green text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-madinah-green text-lg">
                  <Bdi>{t.footer.instituteNameLatin}</Bdi>
                </div>
                <div className="text-sm text-gray-500 arabic-text">{t.footer.instituteNameArabic}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 mb-2">{t.footer.about.title}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.footer.about.description}</p>
              <p className="text-sm text-gray-500 leading-relaxed mt-3">{t.footer.about.legalLine}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold text-gray-900">{t.footer.contact.title}</div>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <div>
                <span className="block text-gray-500">{t.footer.contact.emailLabel}</span>
                <a
                  href={`mailto:${INSTITUTE.email}`}
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-madinah-green hover:underline"
                >
                  <Bdi>{INSTITUTE.email}</Bdi>
                </a>
              </div>
              <div>
                <span className="block text-gray-500">{t.footer.contact.locationLabel}</span>
                <span className="text-gray-700">{t.footer.contact.locationValue}</span>
              </div>
            </address>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold text-gray-900">{t.footer.quickLinks.title}</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => goToLandingSection('#home')}
                className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
              >
                {t.footer.quickLinks.home}
              </button>
              <button
                type="button"
                onClick={() => goToLandingSection('#packages')}
                className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
              >
                {t.footer.quickLinks.courses}
              </button>
              <button
                type="button"
                onClick={() => goToLandingSection('#contact')}
                className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
              >
                {t.footer.quickLinks.admission}
              </button>
              {supabaseUser && (
                <Link
                  to="/portal"
                  className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
                >
                  {t.footer.quickLinks.portal}
                </Link>
              )}
              {supabaseUser && isAdmin && (
                <Link
                  to="/admin"
                  className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
                >
                  {t.footer.quickLinks.admin}
                </Link>
              )}
              <button
                type="button"
                onClick={() => goToView('PRIVACY_POLICY')}
                className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
              >
                {t.footer.quickLinks.privacy}
              </button>
              <button
                type="button"
                onClick={() => goToView('TERMS_OF_SERVICE')}
                className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
              >
                {t.footer.quickLinks.terms}
              </button>
            </div>
            {socialLinks.length > 0 && (
              <div className="pt-2">
                <div className="text-sm font-bold text-gray-900 mb-2">{t.footer.socials.title}</div>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-madinah-green hover:underline"
                      aria-label={t.footer.socials.linkLabel.replace('{name}', link.label)}
                      title={t.footer.socials.linkLabel.replace('{name}', link.label)}
                    >
                      {t.footer.socials.linkLabel.replace('{name}', link.label)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-400 mt-10 border-t border-gray-100 pt-6 leading-relaxed">
          {t.footer.copyright
            .replace('{year}', String(new Date().getFullYear()))
            .replace('{name}', t.footer.instituteNameLatin)}
        </div>
      </div>
    </footer>
  );
};
