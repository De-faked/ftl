import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useView } from '../contexts/ViewContext';
import { INSTITUTE } from '../config/institute';
import { getReducedMotionBehavior, scrollToAnchor } from '../utils/scroll';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const currentLanguageLabel = t.common.languages[language];
  const { currentView, setCurrentView } = useView();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileLangMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const phoneDigits = INSTITUTE.phone.replace(/\D/g, '');
  const whatsappMessage = (t as any)?.home?.courses?.whatsappMessage ?? '';
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(whatsappMessage)}` : '#contact';
  const whatsappLabel = (t as any)?.home?.courses?.whatsapp ?? 'WhatsApp';

  const navLinks = [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.teachers, href: '#teachers' },
    { name: t.nav.courses, href: '#courses' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    if (currentView !== 'LANDING') setCurrentView('LANDING');

    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToAnchor(href, getReducedMotionBehavior()), 200);
    } else {
      scrollToAnchor(href, getReducedMotionBehavior());
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!langMenuRef.current?.contains(target) && !mobileLangMenuRef.current?.contains(target)) {
        setIsLangOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLangOpen(false);
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

  const languageButtons = (
    <div className="grid grid-cols-1 gap-2">
      {(['en', 'ar', 'id'] as const).map((code) => (
        <button
          key={code}
          onClick={(event) => {
            event.stopPropagation();
            setLanguage(code);
            setIsLangOpen(false);
          }}
          className={`w-full px-4 py-3 rounded-lg border text-left rtl:text-right text-sm font-semibold flex items-center justify-between ${language === code ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
          aria-label={t.common.languages[code]}
          type="button"
        >
          <span>{t.common.languages[code]}</span>
          {language === code && <span className="text-xs">{t.nav.selected}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40 print:hidden" dir={dir} data-site-header="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3" onClick={() => setCurrentView('LANDING')} aria-label={t.common.instituteNameLatin} title={t.common.instituteNameLatin}>
            <img src="/images/brand/ftl-nav-logo.png" alt={t.common.instituteNameLatin} className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover shadow-sm ring-1 ring-black/10 bg-white shrink-0" width={44} height={44} loading="eager" decoding="async" />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="arabic-text font-bold text-[15px] sm:text-base md:text-[17px] text-madinah-green whitespace-nowrap truncate">{t.common.instituteNameArabic}</span>
              <span className="font-serif text-[11px] sm:text-xs text-gray-500/80 whitespace-nowrap truncate">{t.common.instituteNameLatin}</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => handleNavClick(link.href)} className="text-gray-700 hover:text-madinah-gold transition-colors font-medium text-sm tracking-wide uppercase">{link.name}</button>
            ))}

            <div className="relative" ref={langMenuRef}>
              <button onClick={() => setIsLangOpen((prev) => !prev)} className="flex items-center gap-2 text-gray-700 hover:text-madinah-gold px-3 py-2 rounded-md min-h-[44px] min-w-[44px]" aria-expanded={isLangOpen} aria-haspopup="true" aria-label={t.nav.language} type="button">
                <Globe className="w-4 h-4" />
                <span className="text-sm uppercase font-medium">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && <div className={`absolute top-full mt-2 w-40 ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-lg border border-gray-100 p-2`}>{languageButtons}</div>}
            </div>

            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2 bg-madinah-green text-white rounded-full text-sm font-medium hover:bg-madinah-green/90 transition-colors min-h-[44px] whitespace-nowrap">
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappLabel}</span>
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-madinah-green p-3 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={whatsappLabel} title={whatsappLabel}>
              <MessageCircle className="w-5 h-5" />
            </a>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 w-11 h-11 p-2.5 rounded-full flex items-center justify-center" aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu} aria-expanded={isOpen} aria-controls="mobile-nav-menu" title={isOpen ? t.nav.closeMenu : t.nav.openMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-nav-menu" className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-madinah-green text-white py-3 rounded-lg font-bold mb-2">
              <MessageCircle className="w-4 h-4" />
              {whatsappLabel}
            </a>

            <div className="px-1 py-2" ref={mobileLangMenuRef}>
              <button onClick={() => setIsLangOpen((prev) => !prev)} className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 text-base font-medium text-gray-900 min-h-[44px]" aria-expanded={isLangOpen} aria-haspopup="true" aria-label={t.nav.language} type="button">
                <span className="flex items-center gap-3"><Globe className="w-5 h-5" /><span>{t.nav.language}</span></span>
                <span className="text-sm uppercase font-semibold text-madinah-gold">{currentLanguageLabel}</span>
              </button>
              {isLangOpen && <div className="mt-2">{languageButtons}</div>}
            </div>

            {navLinks.map((link) => (
              <button key={link.name} onClick={() => handleNavClick(link.href)} className="block w-full text-left rtl:text-right px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-madinah-gold hover:bg-gray-50">{link.name}</button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
