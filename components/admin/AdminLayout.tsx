import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Globe, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../src/auth/useAuth';

export const AdminLayout: React.FC = () => {
  const { t, language, setLanguage, dir } = useLanguage();
  const { signOut, user, loading } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const currentLanguageLabel = t.common.languages[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!langMenuRef.current?.contains(target)) {
        setIsLangOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const dashboardLinks = [
    { label: t.admin.page.dashboardTitle, href: '/admin#dashboard' },
    { label: t.admin.accessPanel.title, href: '/admin#access' },
    { label: t.admin.studentsPanel.title, href: '/admin#students' },
    { label: t.admin.payments.title, href: '/admin#payments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {dashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-madinah-gold hover:text-madinah-gold transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-madinah-gold hover:text-madinah-gold transition-colors"
                  aria-expanded={isLangOpen}
                  aria-haspopup="true"
                  aria-label={t.nav.language}
                  type="button"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{currentLanguageLabel}</span>
                </button>
                {isLangOpen && (
                  <div
                    className={`absolute top-full mt-2 w-40 max-w-[calc(100vw-2rem)] ${dir === 'rtl' ? 'left-0' : 'right-0'} rounded-lg border border-gray-100 bg-white p-1 shadow-lg`}
                    onMouseDown={(event) => event.stopPropagation()}
                    onTouchStart={(event) => event.stopPropagation()}
                  >
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setLanguage('en');
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left rtl:text-right text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'en' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                      aria-label={t.common.languages.en}
                      type="button"
                    >
                      {t.common.languages.en}
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setLanguage('ar');
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left rtl:text-right text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'ar' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                      aria-label={t.common.languages.ar}
                      type="button"
                    >
                      {t.common.languages.ar}
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setLanguage('id');
                        setIsLangOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left rtl:text-right text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'id' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                      aria-label={t.common.languages.id}
                      type="button"
                    >
                      {t.common.languages.id}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => void signOut()}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-madinah-gold hover:text-madinah-gold transition-colors disabled:opacity-60"
                type="button"
                disabled={loading || !user}
              >
                <LogOut className="h-4 w-4" />
                <span>{t.nav.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};
