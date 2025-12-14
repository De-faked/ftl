import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { INSTITUTE } from '../config/institute';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { dir, language } = useLanguage();
  const { setCurrentView } = useAuth();

  const legalLinks = [
    { key: 'privacy', view: 'LEGAL_PRIVACY', labelEn: 'Privacy Policy', labelAr: 'سياسة الخصوصية' },
    { key: 'terms', view: 'LEGAL_TERMS', labelEn: 'Terms', labelAr: 'شروط الاستخدام' },
    { key: 'refunds', view: 'LEGAL_REFUNDS', labelEn: 'Refund Policy', labelAr: 'سياسة الاسترجاع' },
    { key: 'consent', view: 'LEGAL_CONSENT', labelEn: 'Document Consent', labelAr: 'موافقة جمع الوثائق' },
    { key: 'gdpr', view: 'LEGAL_GDPR', labelEn: 'GDPR Notice', labelAr: 'إشعار GDPR' },
  ] as const;

  const label = (en: string, ar: string) => (language === 'ar' ? ar : en);

  return (
    <footer className="bg-white border-t border-gray-100 mt-12 print:hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-madinah-green text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-madinah-green text-lg">{INSTITUTE.nameEn}</div>
              <div className="text-sm text-gray-500 arabic-text">{INSTITUTE.nameAr}</div>
              <div className="text-xs text-gray-500 mt-3 max-w-xl">
                {language === 'ar' ? INSTITUTE.legalLineAr : INSTITUTE.legalLineEn}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {language === 'ar' ? INSTITUTE.addressAr : INSTITUTE.addressEn}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900 mb-3">{label('Legal', 'قانوني')}</div>
            <div className="grid grid-cols-1 gap-2">
              {legalLinks.map(l => (
                <button
                  key={l.key}
                  onClick={() => setCurrentView(l.view as any)}
                  className="text-left rtl:text-right text-sm text-gray-600 hover:text-madinah-green hover:underline"
                >
                  {label(l.labelEn, l.labelAr)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900 mb-3">{label('Contact', 'التواصل')}</div>
            <div className="text-sm text-gray-600">{INSTITUTE.email}</div>
            <div className="text-sm text-gray-600 mt-1">{INSTITUTE.phone}</div>
            <div className="text-xs text-gray-400 mt-4">
              {label(
                `Domain: ${INSTITUTE.instituteSubdomain}.${INSTITUTE.mainDomain}`,
                `النطاق: ${INSTITUTE.instituteSubdomain}.${INSTITUTE.mainDomain}`
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-10 border-t border-gray-100 pt-6">
          {label('© ' + new Date().getFullYear() + ' ' + INSTITUTE.nameEn, '© ' + new Date().getFullYear() + ' ' + INSTITUTE.nameAr)}
        </div>
      </div>
    </footer>
  );
};
