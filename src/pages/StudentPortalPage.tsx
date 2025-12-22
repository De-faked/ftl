import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useStudentRecord } from '../hooks/useStudentRecord';
import { StudentDashboard } from '../components/portal/StudentDashboard';
import { UnderProcessDashboard } from '../components/portal/UnderProcessDashboard';

export const StudentPortalPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { student, loading: studentLoading, error: studentError } = useStudentRecord();

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
            <p className="text-gray-600 mt-2">Sign in to access your student portal.</p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-6 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || studentLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading portal…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {studentError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            <p className="font-semibold text-red-800">We couldn’t load your student record.</p>
            <p className="mt-2">{studentError}</p>
          </div>
        ) : student ? (
          <StudentDashboard student={student} />
        ) : (
          <UnderProcessDashboard />
        )}
      </div>
    </div>
  );
};
