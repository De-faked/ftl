import React, { Suspense, lazy, useState } from 'react';
import { AdminAccessPanel } from './AdminAccessPanel';
import { useAuth as useSupabaseAuth } from '../../src/auth/useAuth';

const AdminDashboard = lazy(() => import('../AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminDashboardModal = lazy(() =>
  import('../AdminDashboardModal').then((m) => ({ default: m.AdminDashboardModal }))
);

export const AdminPage: React.FC = () => {
  const { loading, isAdmin } = useSupabaseAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminAccessPanel />

        {isAdmin ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">Manage students, applications, and courses.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
              >
                Open admin tools
              </button>
            </div>
            <Suspense fallback={<div className="rounded-xl bg-white p-6 text-sm text-gray-500">Loading admin…</div>}>
              <AdminDashboard />
            </Suspense>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            {loading ? 'Checking admin access…' : 'Admin access is required to view this dashboard.'}
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <AdminDashboardModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      </Suspense>
    </div>
  );
};
