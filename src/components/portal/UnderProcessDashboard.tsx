import React from 'react';
import { Link } from 'react-router-dom';

export const UnderProcessDashboard: React.FC = () => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Application in progress</h1>
          <p className="text-gray-600">
            We’re reviewing your application. Once approved, you’ll receive a student ID and full portal
            access.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">Checklist</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[
              { label: 'Documents', status: 'Pending review' },
              { label: 'Payment', status: 'Awaiting confirmation' },
              { label: 'Admin approval', status: 'Queued' },
            ].map((step) => (
              <div key={step.label} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                <p className="text-xs text-gray-500 mt-1">{step.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            Need an update or have questions? Email{' '}
            <a href="mailto:admission.ftl@ptdima.sa" className="font-semibold text-madinah-green hover:underline">
              admission.ftl@ptdima.sa
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="mailto:admission.ftl@ptdima.sa"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-madinah-green px-5 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90"
          >
            Contact admissions
          </a>
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};
