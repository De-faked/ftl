import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth as useSupabaseAuth } from '../../src/auth/useAuth';
import { useAuth } from '../../contexts/AuthContext';

export const AdminAccessPanel: React.FC = () => {
  const { user, loading, isAdmin } = useSupabaseAuth();
  const { setCurrentView } = useAuth();
  const emailLabel = user?.email ?? 'Not signed in';
  const adminLabel = loading ? 'Checking…' : isAdmin ? 'Yes' : 'No';

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Access Panel</p>
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[220px]" title={emailLabel}>
              {emailLabel}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-400">Admin</p>
            <p className={`text-sm font-semibold ${isAdmin ? 'text-green-600' : 'text-red-500'}`}>
              {adminLabel}
            </p>
          </div>
        </div>
      </div>
      {!loading && !isAdmin && (
        <div className="mt-4 rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          <p>Admin access is limited to approved accounts.</p>
          <Link
            to="/"
            onClick={() => setCurrentView('LANDING')}
            className="mt-2 inline-flex font-semibold text-madinah-green hover:underline"
          >
            Back to home
          </Link>
        </div>
      )}
    </section>
  );
};
