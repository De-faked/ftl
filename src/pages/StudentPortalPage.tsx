import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useStudentRecord } from '../hooks/useStudentRecord';
import { useMyApplication } from '../hooks/useMyApplication';
import { useMyPayments } from '../hooks/useMyPayments';
import { StudentDashboard } from '../components/portal/StudentDashboard';
import { UnderProcessDashboard } from '../components/portal/UnderProcessDashboard';
import { ApplicationForm } from '../components/portal/ApplicationForm';
import { PaymentStatusPanel } from '../components/portal/PaymentStatusPanel';
import { useLanguage } from '../../contexts/LanguageContext';
import { Course } from '../../types';
import { Alert } from '../../components/Alert';
import { normalizePlanDays } from '../utils/planDays';

export const StudentPortalPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { student, loading: studentLoading, error: studentError } = useStudentRecord();
  const { application, loading: applicationLoading, error: applicationError, submit } = useMyApplication();
  const { latestPayment } = useMyPayments();
  const { t, dir } = useLanguage();
  const location = useLocation();
  const courseId = useMemo(() => new URLSearchParams(location.search).get('course'), [location.search]);
  const planDaysParam = useMemo(() => new URLSearchParams(location.search).get('planDays'), [location.search]);
  const courses = useMemo(() => t.home.courses.list as Course[], [t]);
  const selectedCourse = useMemo(() => courses.find((course) => course.id === courseId) ?? null, [courses, courseId]);
  const resolvedCourseId = selectedCourse?.id ?? null;
  const selectedCoursePlans = useMemo(() => {
    return selectedCourse?.plans && selectedCourse.plans.length ? selectedCourse.plans : null;
  }, [selectedCourse]);
  const courseHasPlans = Boolean(selectedCoursePlans?.length);
  const initialPlanDays = useMemo(() => {
    if (!selectedCoursePlans) return null;
    const allowed = new Set(selectedCoursePlans.map((plan) => plan.id));
    const normalizedPlan = normalizePlanDays(planDaysParam);
    if (normalizedPlan && allowed.has(normalizedPlan)) return normalizedPlan;
    return null;
  }, [planDaysParam, selectedCoursePlans]);

  const combinedError = Boolean(studentError ?? applicationError);
  const applicationStatus = application?.status ?? 'draft';

  const renderPortalContent = () => {
    if (student) {
      return <StudentDashboard student={student} />;
    }

    if (!application || applicationStatus === 'draft') {
      return (
          <ApplicationForm
            initialData={application?.data ?? null}
            courseId={resolvedCourseId}
            initialPlanDays={initialPlanDays}
            courseHasPlans={courseHasPlans}
            submit={submit}
            error={applicationError}
          />
        );
    }

    if (applicationStatus === 'submitted' || applicationStatus === 'under_review') {
      return <UnderProcessDashboard status={applicationStatus} />;
    }

    if (applicationStatus === 'rejected') {
      return (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.portalPage.rejectedTitle}</h1>
            <p className="text-gray-600">{t.portal.portalPage.rejectedBody}</p>
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
            >
              {t.portal.portalPage.backHome}
            </Link>
          </div>
        </section>
      );
    }

    if (applicationStatus === 'approved') {
      if (student) {
        return <StudentDashboard student={student} />;
      }

      return (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.portalPage.finalizingTitle}</h1>
            <p className="text-gray-600">{t.portal.portalPage.finalizingBody}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-5 py-2 text-sm font-semibold text-white hover:bg-madinah-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
            >
              {t.portal.portalPage.finalizingRefresh}
            </button>
          </div>
        </section>
      );
    }

    return (
      <ApplicationForm
        initialData={application?.data ?? null}
        courseId={resolvedCourseId}
        initialPlanDays={initialPlanDays}
        courseHasPlans={courseHasPlans}
        submit={submit}
        error={applicationError}
      />
    );
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">{t.portal.portalPage.signInTitle}</h1>
            <p className="text-gray-600 mt-2">{t.portal.portalPage.signInSubtitle}</p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-6 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
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
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir={dir}>
      <div className="max-w-6xl mx-auto">
        {combinedError ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              <Alert variant="error">
                <div>
                  <p className="text-base font-semibold">{t.portal.portalPage.loadErrorTitle}</p>
                  <p className="text-sm">{t.portal.portalPage.loadErrorBody}</p>
                </div>
              </Alert>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                >
                  {t.portal.portalPage.retry}
                </button>
                <Link
                  to="/"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-700 hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2"
                >
                  {t.portal.portalPage.backHome}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {student && latestPayment ? <PaymentStatusPanel payment={latestPayment} /> : null}
            {renderPortalContent()}
          </div>
        )}
      </div>
    </div>
  );
};
