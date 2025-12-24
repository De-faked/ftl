import React, { Suspense, lazy, useState } from 'react';
import { AdminAccessPanel } from './AdminAccessPanel';
import { useAuth as useSupabaseAuth } from '../../src/auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { AdminStudentsPanel } from './AdminStudentsPanel';

const AdminDashboardModal = lazy(() =>
  import('../AdminDashboardModal').then((m) => ({ default: m.AdminDashboardModal }))
);

export const AdminPage: React.FC = () => {
  const { loading, isAdmin } = useSupabaseAuth();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminAccessPanel />

        {isAdmin ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t.admin.page.dashboardTitle}</h2>
                <p className="text-sm text-gray-500">{t.admin.page.dashboardSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
              >
                {t.admin.page.openTools}
              </button>
            </div>
            <Suspense fallback={<div className="rounded-xl bg-white p-6 text-sm text-gray-500">{t.admin.page.loadingAdmin}</div>}>
              <AdminStudentsPanel />
            </Suspense>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
            {loading ? t.admin.page.checkingAccess : t.admin.page.accessRequired}
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <AdminDashboardModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      </Suspense>
    </div>
  );
};
