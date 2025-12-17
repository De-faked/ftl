import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AuthPage } from '../src/pages/AuthPage';

export function SupabaseAuthModal(props: { isOpen: boolean; onClose: () => void }) {
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-700">Authentication</div>
          <button
            type="button"
            onClick={props.onClose}
            className="p-2 rounded-full hover:bg-gray-50"
            aria-label="Close authentication"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <AuthPage onSuccess={props.onClose} />
        </div>
      </div>
    </div>
  );
}

