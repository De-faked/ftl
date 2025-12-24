import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useStudentRecord } from '../hooks/useStudentRecord';
import { useMyApplication } from '../hooks/useMyApplication';
import { StudentDashboard } from '../components/portal/StudentDashboard';
import { UnderProcessDashboard } from '../components/portal/UnderProcessDashboard';
import { ApplicationForm } from '../components/portal/ApplicationForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../../components/Bdi';

export const StudentPortalPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { student, loading: studentLoading, error: studentError } = useStudentRecord();
  const { application, loading: applicationLoading, error: applicationError, submit } = useMyApplication();
  const { t } = useLanguage();
  const location = useLocation();
  const courseId = useMemo(() => new URLSearchParams(location.search).get('course'), [location.search]);
  const combinedError = studentError ?? applicationError;

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.portalPage.signInTitle}</h1>
            <p className="text-gray-600 mt-2">{t.portal.portalPage.signInSubtitle}</p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-6 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90"
            >
              {t.portal.portalPage.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || studentLoading || applicationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-madinah-green" />
              <p className="text-sm font-semibold">{t.portal.portalPage.loading}</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">{t.portal.portalPage.loadingHint}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {combinedError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm sm:p-8" role="alert">
            <div className="space-y-2">
              <p className="text-base font-semibold text-red-800">{t.portal.portalPage.loadErrorTitle}</p>
              <p className="text-sm text-red-700">{t.portal.portalPage.loadErrorBody}</p>
            </div>
            <p className="mt-3 text-xs text-red-700">
              <Bdi>{combinedError}</Bdi>
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {t.portal.portalPage.retry}
              </button>
              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-700 hover:border-red-300"
              >
                {t.portal.portalPage.backHome}
              </Link>
            </div>
          </div>
        ) : student ? (
          <StudentDashboard student={student} />
        ) : application && application.status !== 'draft' ? (
          <UnderProcessDashboard status={application.status ?? undefined} />
        ) : (
          <ApplicationForm
            initialData={application?.data ?? null}
            courseId={courseId}
            submit={submit}
            error={applicationError}
          />
        )}
      </div>
    </div>
  );
};
