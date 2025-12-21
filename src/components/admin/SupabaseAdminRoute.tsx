import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

export const SupabaseAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Checking access…</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto">
          <span className="text-2xl">!</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Not authorized</h2>
          <p className="text-gray-600">You need admin access to view this page.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-madinah-green text-white font-semibold hover:bg-madinah-green/90 transition-colors"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
