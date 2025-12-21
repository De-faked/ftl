import React from 'react';
import { Link } from 'react-router-dom';

export const UnderProcessDashboard: React.FC = () => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Application in progress</h1>
        <p className="text-gray-600">
          You’re not enrolled yet. Once your application is approved, you’ll receive a student ID and
          access to your portal.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:admission.ftl@ptdima.sa"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-madinah-green px-5 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90"
          >
            Contact admissions
          </a>
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};
