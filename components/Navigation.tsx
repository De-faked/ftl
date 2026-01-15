import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ShoppingCart, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';
import { useView } from '../contexts/ViewContext';
import { useCart } from '../contexts/CartContext';
import { CartModal } from './CartModal';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';
import { getReducedMotionBehavior, scrollToAnchor } from '../utils/scroll';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const currentLanguageLabel = t.common.languages[language];
  
  const { currentView, setCurrentView } = useView();
  const { cart, setIsCartOpen } = useCart();
  const [isSupabaseAuthOpen, setIsSupabaseAuthOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileLangMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { user: supabaseUser, loading: authLoading, signOut, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.teachers, href: '#teachers' },
    { name: t.nav.courses, href: '#courses' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    if (currentView !== 'LANDING') {
      setCurrentView('LANDING');
    }

    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToAnchor(href, getReducedMotionBehavior());
      }, 200);
    } else {
      scrollToAnchor(href, getReducedMotionBehavior());
    }

    setIsOpen(false);
  };

  const desktopNavClass = supabaseUser ? 'hidden xl:flex' : 'hidden lg:flex';
  const mobileControlsClass = supabaseUser ? 'xl:hidden' : 'lg:hidden';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const desktopContains = langMenuRef.current?.contains(target);
      const mobileContains = mobileLangMenuRef.current?.contains(target);
      const userMenuContains = userMenuRef.current?.contains(target);
      if (!desktopContains && !mobileContains) {
        setIsLangOpen(false);
      }
      if (!userMenuContains) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangOpen(false);
        setIsUserMenuOpen(false);
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
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40 transition-all duration-300 print:hidden" dir={dir} data-site-header="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 max-[352px]:grid max-[352px]:grid-cols-[1fr_auto_1fr] max-[352px]:gap-2">
          {/* Logo */}
          <Link
  to="/"
  className="flex items-center gap-3 cursor-pointer max-[352px]:justify-self-center max-[352px]:col-start-2"
  onClick={() => setCurrentView('LANDING')}
  aria-label={t.common.instituteNameLatin}
  title={t.common.instituteNameLatin}
>
  <div className="flex items-center gap-3">
    <img
      src="/images/brand/ftl-nav-logo.png"
      alt={t.common.instituteNameLatin}
      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover shadow-sm ring-1 ring-black/10 bg-white shrink-0"
      width={44}
      height={44}
      loading="eager"
      decoding="async"
    />
    <div className="flex min-w-0 flex-col leading-tight">
      <span className="arabic-text font-bold text-[15px] sm:text-base md:text-[17px] text-madinah-green whitespace-nowrap truncate">
        {t.common.instituteNameArabic}
      </span>
      <span className="font-serif text-[11px] sm:text-xs text-gray-500/80 whitespace-nowrap truncate">
        {t.common.instituteNameLatin}
      </span>
    </div>
  </div>
</Link>


            {/* Desktop Nav */}
              <div className={`${desktopNavClass} items-center gap-6`}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-gray-700 hover:text-madinah-gold transition-colors font-medium text-sm tracking-wide uppercase"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/gallery"
              onClick={() => setCurrentView('LANDING')}
              className="text-gray-700 hover:text-madinah-gold transition-colors font-medium text-sm tracking-wide uppercase"
            >
              {t.nav.gallery}
            </Link>
            
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center gap-2 text-gray-700 hover:text-madinah-gold focus:outline-none px-3 py-2 rounded-md min-h-[44px] min-w-[44px] pointer-events-auto"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
                aria-label={t.nav.language}
                type="button"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase font-medium">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && (
                <div
                  className={`absolute top-full mt-2 w-40 max-w-[calc(100vw-2rem)] ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg border border-gray-100 p-1`}
                  onMouseDown={(event) => event.stopPropagation()}
                  onTouchStart={(event) => event.stopPropagation()}
                >
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'en' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
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
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'ar' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
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
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 pointer-events-auto ${language === 'id' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                    aria-label={t.common.languages.id}
                    type="button"
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

            <div className="flex items-center gap-3 whitespace-nowrap min-w-0">
              {/* Portal */}
              {!authLoading && supabaseUser && (
                <Link
                  to="/portal"
                  className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px] whitespace-nowrap"
                  title={t.nav.portal}
                >
                  <span>{t.nav.portal}</span>
                </Link>
              )}

              {/* Admin */}
              {!authLoading && supabaseUser && isAdmin && (
                <Link
                  to="/admin"
                  className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px] whitespace-nowrap"
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
                <>
                  <div className="hidden xl:flex items-center gap-3 min-w-0 whitespace-nowrap">
                    <span
                      className="min-w-0 text-sm font-medium text-gray-700 truncate max-w-[180px]"
                      title={supabaseUser.email}
                    >
                      <Bdi>{supabaseUser.email}</Bdi>
                    </span>
                    <button
                      onClick={() => void signOut()}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px] whitespace-nowrap"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                  <div className="relative xl:hidden" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors text-sm min-h-[44px] min-w-[44px]"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="true"
                      aria-label={t.nav.accountMenu}
                      aria-controls="desktop-user-menu"
                      type="button"
                    >
                      <UserIcon className="w-4 h-4" />
                    </button>
                    {isUserMenuOpen && (
                      <div
                        id="desktop-user-menu"
                        role="menu"
                        className={`absolute top-full mt-2 w-64 max-w-[calc(100vw-2rem)] ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg border border-gray-100 p-2`}
                        onMouseDown={(event) => event.stopPropagation()}
                        onTouchStart={(event) => event.stopPropagation()}
                      >
                        <div className="px-3 py-2 text-sm text-gray-700 break-all">
                          <Bdi>{supabaseUser.email}</Bdi>
                        </div>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <Link
                          to="/portal"
                          role="menuitem"
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {t.nav.portal}
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            role="menuitem"
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {t.nav.admin}
                          </Link>
                        )}
                        <button
                          onClick={() => void signOut()}
                          role="menuitem"
                          className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t.nav.signOut}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsSupabaseAuthOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-madinah-green text-white rounded-full text-sm font-medium hover:bg-madinah-green/90 transition-colors min-h-[44px] whitespace-nowrap"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t.nav.signIn}</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Button */}
          <div className={`${mobileControlsClass} flex items-center gap-4 max-[352px]:col-start-3 max-[352px]:justify-self-end`}>
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
        <div id="mobile-nav-menu" className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50">
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

            <div className="px-1 py-2" ref={mobileLangMenuRef}>
              <button
                onClick={() => setIsLangOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 text-base font-medium text-gray-900 hover:border-madinah-gold focus:outline-none min-h-[44px] min-w-[44px] pointer-events-auto"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
                aria-label={t.nav.language}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <span>{t.nav.language}</span>
                </span>
                <span className="text-sm uppercase font-semibold text-madinah-gold">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && (
                <div
                  className="mt-2 grid grid-cols-1 gap-2"
                  role="listbox"
                  onMouseDown={(event) => event.stopPropagation()}
                  onTouchStart={(event) => event.stopPropagation()}
                >
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setLanguage('en');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left rtl:text-right text-sm font-semibold flex items-center justify-between pointer-events-auto ${language === 'en' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                    aria-label={t.common.languages.en}
                    type="button"
                  >
                    <span>{t.common.languages.en}</span>
                    {language === 'en' && <span className="text-xs">{t.nav.selected}</span>}
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setLanguage('ar');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left rtl:text-right text-sm font-semibold flex items-center justify-between pointer-events-auto ${language === 'ar' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                    aria-label={t.common.languages.ar}
                    type="button"
                  >
                    <span>{t.common.languages.ar}</span>
                    {language === 'ar' && <span className="text-xs">{t.nav.selected}</span>}
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setLanguage('id');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left rtl:text-right text-sm font-semibold flex items-center justify-between pointer-events-auto ${language === 'id' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                    aria-label={t.common.languages.id}
                    type="button"
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
                className="block w-full text-left rtl:text-right px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {t.nav.admin}
              </Link>
            )}

            {!authLoading && supabaseUser && (
              <Link
                to="/portal"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left rtl:text-right px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {t.nav.portal}
              </Link>
            )}

            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left rtl:text-right px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/gallery"
              onClick={() => {
                setCurrentView('LANDING');
                setIsOpen(false);
              }}
              className="block w-full text-left rtl:text-right px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50"
            >
              {t.nav.gallery}
            </Link>
          </div>
        </div>
      )}
    </nav>

    <SupabaseAuthModal isOpen={isSupabaseAuthOpen} onClose={() => setIsSupabaseAuthOpen(false)} />
    <CartModal />
    </>
  );
};
