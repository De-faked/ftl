import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, GraduationCap } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';

export const CartModal: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart } = useCart();
  const { user, profile } = useSupabaseAuth();
  const { dir, t } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleGoToPortal = () => {
    setIsCartOpen(false);
    navigate('/portal');
  };

  const displayName = profile?.full_name || user?.email || t.common.emptyValue;
  const displayEmail = user?.email || t.common.emptyValue;
  const displayId = user?.id || t.common.emptyValue;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" dir={dir}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right rtl:animate-slide-in-left">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-madinah-sand/50">
          <h2 className="text-xl font-serif font-bold text-gray-900">{t.cart.title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-madinah-green"
            aria-label={t.cart.close}
            title={t.cart.close}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                 <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg">{t.cart.emptyTitle}</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-madinah-green font-bold hover:underline"
              >
                {t.cart.browseCourses}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-madinah-green/5 p-4 rounded-lg border border-madinah-green/10">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">{t.cart.studentLabel}</span>
                    <span className="text-xs font-bold text-madinah-gold uppercase font-mono"><Bdi>{displayId}</Bdi></span>
                </div>
                <p className="font-bold text-gray-900"><Bdi>{displayName}</Bdi></p>
                <p className="text-sm text-gray-600"><Bdi>{displayEmail}</Bdi></p>
              </div>

              {/* Cart Item */}
              <div className="border border-gray-200 rounded-xl p-4 relative group">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{cart.title}</h3>
                    <button
                        onClick={removeFromCart}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400/80"
                        aria-label={t.cart.removeCourse}
                        title={t.cart.removeCourseTitle}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-madinah-gold font-bold text-sm mb-2">{cart.arabicTitle}</p>
                <p className="text-sm text-gray-600 mb-4">{cart.shortDescription}</p>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{cart.duration}</span>
                    <span className="font-bold text-lg text-madinah-green">{cart.price === t.home.courses.priceOnRequest ? t.cart.fallbackPrice : cart.price}</span>
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="font-bold mb-2">{t.cart.packageIncludes}</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t.cart.includesItems.accommodation}</li>
                    <li>{t.cart.includesItems.meals}</li>
                    <li>{t.cart.includesItems.transport}</li>
                    <li>{t.cart.includesItems.tuition}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart && (
            <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{t.cart.totalDue}</span>
                    <span className="text-2xl font-bold text-gray-900">{cart.price === t.home.courses.priceOnRequest ? t.cart.fallbackPrice : cart.price}</span>
                </div>
                <button
                    onClick={handleGoToPortal}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                >
                    {t.cart.goToPortal}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
