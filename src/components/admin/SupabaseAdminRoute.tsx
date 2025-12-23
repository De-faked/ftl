import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useLanguage } from '../../../contexts/LanguageContext';

export const SupabaseAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">{t.admin.page.checkingAccess}</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto">
          <span className="text-2xl">!</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{t.admin.notAuthorized.title}</h2>
          <p className="text-gray-600">{t.admin.notAuthorized.message}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-madinah-green text-white font-semibold hover:bg-madinah-green/90 transition-colors"
        >
          {t.admin.notAuthorized.backHome}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
