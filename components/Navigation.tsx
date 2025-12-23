import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Globe, ShoppingCart, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartModal } from './CartModal';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const currentLanguageLabel = t.common.languages[language];
  
  const { currentView, setCurrentView } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [isSupabaseAuthOpen, setIsSupabaseAuthOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const { user: supabaseUser, loading: authLoading, signOut, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { name: t.nav.home, href: '#home', view: 'LANDING' },
    { name: t.nav.about, href: '#about', view: 'LANDING' },
    { name: t.nav.teachers, href: '#teachers', view: 'LANDING' },
    { name: t.nav.courses, href: '#courses', view: 'LANDING' },
    { name: t.nav.stories, href: '#testimonials', view: 'TESTIMONIALS' },
    { name: t.nav.contact, href: '#contact', view: 'LANDING' },
  ];

  const handleNavClick = (view: string, href: string) => {
      const shouldScroll = view !== 'TESTIMONIALS';

      if (view === 'TESTIMONIALS') {
        setCurrentView('TESTIMONIALS');
      } else if (currentView !== 'LANDING') {
        setCurrentView('LANDING');
      }

      if (pathname !== '/') {
        navigate('/');
        if (shouldScroll) {
          setTimeout(() => {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      } else if (shouldScroll) {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }

      setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
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

  return (
    <>
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40 transition-all duration-300 print:hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView('LANDING')}
          >
            <BookOpen className="h-8 w-8 text-madinah-gold rtl:flip" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-madinah-green tracking-tight">{t.common.instituteNameLatin}</span>
              <span className="text-xs text-gray-500 arabic-text">{t.common.instituteNameArabic}</span>
            </div>
          </Link>

            {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.view, link.href)}
                  className="text-gray-700 hover:text-madinah-gold transition-colors font-medium text-sm tracking-wide uppercase"
              >
                {link.name}
              </button>
            ))}
            
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center gap-2 text-gray-700 hover:text-madinah-gold focus:outline-none px-3 py-2 rounded-md min-h-[44px] min-w-[44px]"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase font-medium">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && (
                <div
                  className={`absolute top-full mt-2 w-40 max-w-[calc(100vw-2rem)] ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg border border-gray-100 p-1`}
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 ${language === 'en' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                  >
                    {t.common.languages.en}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 ${language === 'ar' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                  >
                    {t.common.languages.ar}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 ${language === 'id' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                  >
                    {t.common.languages.id}
                  </button>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Cart Button */}
            <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-madinah-green transition-colors p-3 rounded-full min-h-[44px] min-w-[44px]"
                aria-label={t.nav.openCart}
                title={t.nav.cartTitle}
            >
                <ShoppingCart className="w-5 h-5" />
                {cart && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
                )}
            </button>

            {/* Portal */}
            {!authLoading && supabaseUser && (
              <Link
                to="/portal"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px]"
                title={t.nav.portal}
              >
                <span>{t.nav.portal}</span>
              </Link>
            )}

            {/* Admin */}
            {!authLoading && supabaseUser && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px]"
                title={t.nav.admin}
              >
                <Shield className="w-4 h-4" />
                <span>{t.nav.admin}</span>
              </Link>
            )}

            {/* User Auth */}
            {authLoading ? (
              <div className="text-sm text-gray-500">{t.nav.authLoading}</div>
            ) : supabaseUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[220px]" title={supabaseUser.email}>
                  <Bdi>{supabaseUser.email}</Bdi>
                </span>
                <button
                  onClick={() => void signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.signOut}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSupabaseAuthOpen(true)}
                className="flex items-center gap-2 px-5 py-2 bg-madinah-green text-white rounded-full text-sm font-medium hover:bg-madinah-green/90 transition-colors min-h-[44px]"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t.nav.signIn}</span>
              </button>
            )}

          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 p-3 rounded-full min-h-[44px] min-w-[44px]"
                aria-label={t.nav.openCart}
                title={t.nav.cartTitle}
            >
                <ShoppingCart className="w-5 h-5" />
                {cart && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
                )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-madinah-green focus:outline-none w-11 h-11 p-2.5 rounded-full flex items-center justify-center"
              aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              title={isOpen ? t.nav.closeMenu : t.nav.openMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-nav-menu" className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authLoading ? (
              <div className="bg-gray-50 p-4 rounded-lg mb-2 text-gray-600 text-sm">{t.nav.authLoading}</div>
            ) : supabaseUser ? (
              <div className="bg-gray-50 p-4 rounded-lg mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate" title={supabaseUser.email}>
                    <Bdi>{supabaseUser.email}</Bdi>
                  </p>
                </div>
                <button
                  onClick={() => void signOut()}
                  className="text-red-500 text-sm font-semibold whitespace-nowrap"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSupabaseAuthOpen(true);
                  setIsOpen(false);
                }}
                className="w-full bg-madinah-green text-white py-3 rounded-lg font-bold mb-2"
              >
                {t.nav.signIn}
              </button>
            )}

            <div className="px-1 py-2">
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 text-base font-medium text-gray-900 hover:border-madinah-gold focus:outline-none min-h-[44px] min-w-[44px]"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
              >
                <span className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <span>{t.nav.language}</span>
                </span>
                <span className="text-sm uppercase font-semibold text-madinah-gold">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && (
                <div className="mt-2 grid grid-cols-1 gap-2" role="listbox">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between ${language === 'en' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                  >
                    <span>{t.common.languages.en}</span>
                    {language === 'en' && <span className="text-xs">{t.nav.selected}</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between ${language === 'ar' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                  >
                    <span>{t.common.languages.ar}</span>
                    {language === 'ar' && <span className="text-xs">{t.nav.selected}</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between ${language === 'id' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                  >
                    <span>{t.common.languages.id}</span>
                    {language === 'id' && <span className="text-xs">{t.nav.selected}</span>}
                  </button>
                </div>
              )}
            </div>

            {!authLoading && supabaseUser && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {t.nav.admin}
              </Link>
            )}

            {!authLoading && supabaseUser && (
              <Link
                to="/portal"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {t.nav.portal}
              </Link>
            )}

            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.view, link.href)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>

    <SupabaseAuthModal isOpen={isSupabaseAuthOpen} onClose={() => setIsSupabaseAuthOpen(false)} />
    <CartModal />
    </>
  );
};
