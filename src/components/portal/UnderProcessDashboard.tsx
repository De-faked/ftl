import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bdi } from '../../../components/Bdi';

export const UnderProcessDashboard: React.FC = () => {
  const { t } = useLanguage();
  const emailTemplate = t.portal.inProgress.emailPrompt;
  const contactEmail = t.portal.inProgress.contactEmail;
  const [emailBefore, emailAfter] = emailTemplate.split('{email}');

  const steps = [
    {
      label: t.portal.inProgress.steps.documents.label,
      status: t.portal.inProgress.steps.documents.status
    },
    {
      label: t.portal.inProgress.steps.payment.label,
      status: t.portal.inProgress.steps.payment.status
    },
    {
      label: t.portal.inProgress.steps.approval.label,
      status: t.portal.inProgress.steps.approval.status
    }
  ];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{t.portal.inProgress.title}</h1>
          <p className="text-gray-600">{t.portal.inProgress.subtitle}</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">{t.portal.inProgress.checklistTitle}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.label} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                <p className="text-xs text-gray-500 mt-1">{step.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            {emailBefore}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-madinah-green hover:underline">
              <Bdi>{contactEmail}</Bdi>
            </a>
            {emailAfter ?? ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-madinah-green px-5 py-3 text-sm font-semibold text-white hover:bg-madinah-green/90"
          >
            {t.portal.inProgress.contactButton}
          </a>
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          >
            {t.portal.inProgress.backButton}
          </Link>
        </div>
      </div>
    </section>
  );
};
