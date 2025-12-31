import React, { Suspense, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AuthPage = React.lazy(() =>
  import('../src/pages/AuthPage').then((m) => ({ default: m.AuthPage }))
);

export function SupabaseAuthModal(props: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  useEffect(() => {
    if (!props.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.isOpen, props.onClose]);

  if (!props.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 relative">
          <div className="text-sm font-semibold text-gray-700">{t.auth.supabaseModal.title}</div>
          <button
            type="button"
            onClick={props.onClose}
            className="w-11 h-11 rounded-full hover:bg-gray-50 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300 absolute top-2 right-2 rtl:right-auto rtl:left-2"
            aria-label={t.auth.supabaseModal.close}
            title={t.auth.supabaseModal.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <Suspense fallback={<div className="text-sm text-gray-600">Loading...</div>}>
            <AuthPage onSuccess={props.onClose} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
