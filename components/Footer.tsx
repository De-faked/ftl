import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useView } from '../contexts/ViewContext';
import { INSTITUTE } from '../config/institute';
import type { AppView } from '../types';
import { Bdi } from './Bdi';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';
import { getReducedMotionBehavior, scrollToAnchor } from '../utils/scroll';
import { getBankTransferCopy } from '../src/config/bankTransferCopy';
import { BANK_ACCOUNTS } from '../src/config/payments';

export const Footer: React.FC = () => {
  const { dir, t, language } = useLanguage();
  const { currentView, setCurrentView } = useView();
  const { user: supabaseUser, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const socialLinks =
    (INSTITUTE as { socialLinks?: Array<{ label: string; href: string }> }).socialLinks ?? [];
  const bankCopy = useMemo(() => getBankTransferCopy(language), [language]);
  const bankAccounts = BANK_ACCOUNTS ?? [];
  const hasBankAccounts = bankAccounts.length > 0;

  const renderBankFields = (bank: (typeof BANK_ACCOUNTS)[number]) => {
    const trimmedNote = bank.note?.trim();
    return (
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold text-gray-500">{bankCopy.labels.bankName}:</span>
          <span className="font-medium text-gray-900">
            <Bdi dir="auto">{bank.bankName}</Bdi>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold text-gray-500">{bankCopy.labels.accountHolder}:</span>
          <span className="font-medium text-gray-900">
            <Bdi dir="auto">{bank.accountHolder}</Bdi>
          </span>
        </div>
        {bank.iban ? (
          <div className="flex flex-wrap gap-2">
            <span className="font-semibold text-gray-500">{bankCopy.labels.iban}:</span>
            <span className="font-medium text-gray-900">
              <Bdi dir="auto">{bank.iban}</Bdi>
            </span>
          </div>
        ) : null}
        {bank.swift ? (
          <div className="flex flex-wrap gap-2">
            <span className="font-semibold text-gray-500">{bankCopy.labels.swift}:</span>
            <span className="font-medium text-gray-900">
              <Bdi dir="auto">{bank.swift}</Bdi>
            </span>
          </div>
        ) : null}
        {trimmedNote ? (
          <p className="text-xs text-gray-500">
            <Bdi dir="auto">{trimmedNote}</Bdi>
          </p>
        ) : null}
      </div>
    );
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
      setTimeout(() => scrollToAnchor(hash, getReducedMotionBehavior()), 200);
      return;
    }

    if (needsLanding) {
      setTimeout(() => scrollToAnchor(hash, getReducedMotionBehavior()), 200);
      return;
    }

    scrollToAnchor(hash, getReducedMotionBehavior());
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
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
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
                onClick={() => goToLandingSection('#courses')}
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
          {hasBankAccounts && (
            <div className="space-y-4 md:col-span-2 lg:col-span-2">
              <div className="text-sm font-bold text-gray-900">{bankCopy.bankTransferTitle}</div>
              <p className="text-sm text-gray-600 leading-relaxed">{bankCopy.bankTransferIntro}</p>
              <div className="space-y-3 md:hidden">
                {bankAccounts.map((bank) => (
                  <details
                    key={bank.label}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 rtl:text-right">
                      <Bdi dir="auto">{bank.label}</Bdi>
                      <span className="text-xs text-gray-500">{t.common.more}</span>
                    </summary>
                    <div className="border-t border-gray-100 px-4 py-3">{renderBankFields(bank)}</div>
                  </details>
                ))}
              </div>
              <div className="hidden md:flex flex-col gap-4">
                {bankAccounts.map((bank) => (
                  <div
                    key={bank.label}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      <Bdi dir="auto">{bank.label}</Bdi>
                    </p>
                    {renderBankFields(bank)}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">{bankCopy.bankTransferReferenceHint}</p>
            </div>
          )}
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
