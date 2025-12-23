import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { INSTITUTE } from '../config/institute';
import { BookOpen } from 'lucide-react';
import { Bdi } from './Bdi';

export const Footer: React.FC = () => {
  const { dir, t } = useLanguage();
  const { setCurrentView } = useAuth();

  const legalLinks = [
    { key: 'privacy', view: 'LEGAL_PRIVACY', label: t.footer.legalLinks.privacy },
    { key: 'terms', view: 'LEGAL_TERMS', label: t.footer.legalLinks.terms },
    { key: 'refunds', view: 'LEGAL_REFUNDS', label: t.footer.legalLinks.refunds },
    { key: 'consent', view: 'LEGAL_CONSENT', label: t.footer.legalLinks.consent },
    { key: 'gdpr', view: 'LEGAL_GDPR', label: t.footer.legalLinks.gdpr },
  ] as const;

  return (
    <footer className="bg-white border-t border-gray-100 mt-12 print:hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-madinah-green text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-madinah-green text-lg">{t.common.instituteNameLatin}</div>
              <div className="text-sm text-gray-500 arabic-text">{t.common.instituteNameArabic}</div>
              <div className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                {t.common.instituteLegalLine}
              </div>
              <div className="text-sm text-gray-500 mt-2 leading-relaxed">
                {t.common.instituteAddress}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900 mb-3">{t.footer.legalTitle}</div>
            <div className="grid grid-cols-1 gap-2">
              {legalLinks.map(l => (
                <button
                  key={l.key}
                  onClick={() => setCurrentView(l.view as any)}
                  className="block w-full text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline rounded-md px-2 py-2"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900 mb-3">{t.footer.contactTitle}</div>
            <div className="text-sm text-gray-600">
              <span className="inline-block rounded-md px-2 py-1 -mx-2">
                <Bdi>{INSTITUTE.email}</Bdi>
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="inline-block rounded-md px-2 py-1 -mx-2">
                <Bdi>{INSTITUTE.phone}</Bdi>
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-4 leading-relaxed">
              {t.footer.domainLabel.replace(
                '{domain}',
                `${INSTITUTE.instituteSubdomain}.${INSTITUTE.mainDomain}`
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 mt-10 border-t border-gray-100 pt-6 leading-relaxed">
          {t.footer.copyright
            .replace('{year}', String(new Date().getFullYear()))
            .replace('{name}', t.common.instituteNameLatin)}
        </div>
      </div>
    </footer>
  );
};
