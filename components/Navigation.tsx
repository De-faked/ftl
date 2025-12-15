import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, BookOpen, Globe, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { AuthModal } from './AuthModal';
import { CartModal } from './CartModal';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  
  const { user, logout, currentView, setCurrentView } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { name: t.nav.home, href: '#home', view: 'LANDING' },
    { name: t.nav.about, href: '#about', view: 'LANDING' },
    { name: t.nav.teachers, href: '#teachers', view: 'LANDING' },
    { name: t.nav.courses, href: '#courses', view: 'LANDING' },
    { name: 'Stories', href: '#testimonials', view: 'TESTIMONIALS' },
    { name: t.nav.contact, href: '#contact', view: 'LANDING' },
  ];

  const handleNavClick = (view: string, href: string) => {
      if (view === 'TESTIMONIALS') {
          setCurrentView('TESTIMONIALS');
      } else if (currentView !== 'LANDING') {
          setCurrentView('LANDING');
          setTimeout(() => {
              const element = document.querySelector(href);
              if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40 transition-all duration-300 print:hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('LANDING')}
          >
            <BookOpen className="h-8 w-8 text-madinah-gold rtl:flip" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-madinah-green tracking-tight">Fos7a Taibah</span>
              <span className="text-xs text-gray-500 arabic-text">معهد فصحى طيبة</span>
            </div>
          </div>

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
                <span className="text-sm uppercase font-medium">{language}</span>
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
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 ${language === 'ar' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left rtl:text-right px-4 py-2 text-sm rounded-md hover:bg-gray-50 ${language === 'id' ? 'text-madinah-gold font-bold' : 'text-gray-700'}`}
                  >
                    Indonesia
                  </button>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Cart Button */}
            <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 hover:text-madinah-green transition-colors p-3 rounded-full min-h-[44px] min-w-[44px]"
                aria-label="Open shopping cart"
                title="Shopping cart"
            >
                <ShoppingCart className="w-5 h-5" />
                {cart && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
                )}
            </button>

            {/* User Auth */}
            {user ? (
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-madinah-gold transition-colors min-h-[44px]">
                        <div className="w-6 h-6 bg-madinah-green text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                    </button>
                    
                    <div className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block p-3 animate-fade-in">
                         <div className="mb-3 pb-3 border-b border-gray-100">
                             <p className="text-sm font-bold text-gray-900">{user.name}</p>
                             <p className="text-xs text-madinah-gold font-mono">{user.studentId}</p>
                         </div>
                         
                         {user.role === 'admin' ? (
                            <button 
                                onClick={() => setCurrentView('ADMIN_DASHBOARD')}
                                className="w-full flex items-center gap-2 text-left px-2 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors mb-1"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </button>
                         ) : (
                             <button 
                                onClick={() => setCurrentView('STUDENT_PORTAL')}
                                className="w-full flex items-center gap-2 text-left px-2 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors mb-1"
                             >
                                <UserIcon className="w-4 h-4" />
                                Student Portal
                            </button>
                         )}

                         <button 
                            onClick={logout}
                            className="w-full flex items-center gap-2 text-left px-2 py-2 text-sm text-red-500 rounded-md hover:bg-red-50 transition-colors"
                         >
                             <LogOut className="w-4 h-4" />
                             Logout
                         </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-madinah-green text-white rounded-full text-sm font-medium hover:bg-madinah-green/90 transition-colors min-h-[44px]"
                >
                    <UserIcon className="w-4 h-4" />
                    <span>Login</span>
                </button>
            )}

          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-700 p-3 rounded-full min-h-[44px] min-w-[44px]"
                aria-label="Open shopping cart"
                title="Shopping cart"
            >
                <ShoppingCart className="w-5 h-5" />
                {cart && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
                )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-madinah-green focus:outline-none p-3 rounded-full min-h-[44px] min-w-[44px]"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              title={isOpen ? 'Close menu' : 'Open menu'}
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
             {user ? (
                <div className="bg-gray-50 p-4 rounded-lg mb-2 flex items-center justify-between">
                     <div>
                         <p className="font-bold text-gray-900">{user.name}</p>
                         <p className="text-xs text-madinah-gold">{user.studentId}</p>
                     </div>
                     <button onClick={logout} className="text-red-500 text-sm">Logout</button>
                </div>
             ) : (
                 <button 
                    onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
                    className="w-full bg-madinah-green text-white py-3 rounded-lg font-bold mb-2"
                 >
                     Login / Register
                 </button>
             )}
             
             {user && (
                 <button 
                    onClick={() => { setCurrentView(user.role === 'admin' ? 'ADMIN_DASHBOARD' : 'STUDENT_PORTAL'); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2 text-base font-bold text-madinah-green hover:bg-gray-50 block mb-2"
                 >
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Student Portal'}
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
                  <span>Language</span>
                </span>
                <span className="text-sm uppercase font-semibold text-madinah-gold">{language}</span>
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
                    <span>English</span>
                    {language === 'en' && <span className="text-xs">Selected</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between ${language === 'ar' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                  >
                    <span>العربية</span>
                    {language === 'ar' && <span className="text-xs">Selected</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('id');
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-semibold flex items-center justify-between ${language === 'id' ? 'border-madinah-gold text-madinah-gold bg-madinah-gold/10' : 'border-gray-200 text-gray-800 hover:border-madinah-gold'}`}
                  >
                    <span>Indonesia</span>
                    {language === 'id' && <span className="text-xs">Selected</span>}
                  </button>
                </div>
              )}
            </div>

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

    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    <CartModal />
    </>
  );
};