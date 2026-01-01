import React, { useRef, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Bdi } from '../../../components/Bdi';

type StudentDashboardProps = {
  student: {
    student_id: string;
    status: string | null;
    enrolled_at: string | null;
  };
};

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4">
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{message}</p>
  </div>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const { t, language, dir } = useLanguage();
  const idRef = useRef<HTMLSpanElement | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const locale = language === 'ar' ? 'ar' : language === 'id' ? 'id-ID' : 'en-US';

  const handleCopy = async () => {
    setCopyMessage(null);
    const idValue = student.student_id;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(idValue);
        setCopyMessage(t.portal.studentDashboard.copySuccess);
        return;
      } catch {
        setCopyMessage(t.portal.studentDashboard.copyFailure);
      }
    }

    if (idRef.current) {
      const range = document.createRange();
      range.selectNodeContents(idRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      setCopyMessage(t.portal.studentDashboard.copySelected);
    }
  };

  const statusValue = student.status ?? t.portal.studentDashboard.pendingStatus;
  const [statusBefore, statusAfter] = t.portal.studentDashboard.statusLine.split('{status}');
  const [enrolledBefore, enrolledAfter] = t.portal.studentDashboard.enrolledLine.split('{date}');
  const enrolledDate = student.enrolled_at
    ? new Date(student.enrolled_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <section className="space-y-6" dir={dir}>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.portal.studentDashboard.title}</h1>
        <p className="text-gray-600 mt-2">{t.portal.studentDashboard.subtitle}</p>
        <div className="mt-6 rounded-xl border border-madinah-green/20 bg-madinah-green/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-madinah-green">{t.portal.studentId}</p>
              <span ref={idRef} className="text-lg font-bold text-gray-900 break-all">
                <Bdi dir="auto">{student.student_id}</Bdi>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-madinah-green/30 bg-white px-4 py-2 text-sm font-semibold text-madinah-green hover:border-madinah-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madinah-gold focus-visible:ring-offset-2 sm:w-auto"
            >
              {t.portal.studentDashboard.copyButton}
            </button>
          </div>
          {copyMessage && (
            <p className="mt-2 text-xs text-gray-600" role="status" aria-live="polite">
              {copyMessage}
            </p>
          )}
        </div>
        <div className="mt-3 text-sm text-gray-500 break-words" aria-live="polite">
          {statusBefore}
          <Bdi dir="auto">{statusValue}</Bdi>
          {statusAfter ?? ''}
          {enrolledDate ? (
            <>
              <span className="mx-2 text-gray-300" aria-hidden="true">
                {t.portal.studentDashboard.separator}
              </span>
              {enrolledBefore}
              <Bdi dir="auto">{enrolledDate}</Bdi>
              {enrolledAfter ?? ''}
            </>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.coursesTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.coursesSubtitle}</p>
          <div className="mt-4">
            <EmptyState title={t.portal.studentDashboard.emptyTitle} message={t.portal.studentDashboard.coursesEmpty} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.scheduleTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.scheduleSubtitle}</p>
          <div className="mt-4">
            <EmptyState title={t.portal.studentDashboard.emptyTitle} message={t.portal.studentDashboard.scheduleEmpty} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.announcementsTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.announcementsSubtitle}</p>
          <div className="mt-4">
            <EmptyState
              title={t.portal.studentDashboard.emptyTitle}
              message={t.portal.studentDashboard.announcementsEmpty}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.profileTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.profileSubtitle}</p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>{t.portal.studentDashboard.profileStatusLabel}</span>
              <span className="font-semibold text-gray-900">
                <Bdi dir="auto">{statusValue}</Bdi>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t.portal.studentDashboard.enrollmentDateLabel}</span>
              <span className="font-semibold text-gray-900">
                {enrolledDate ? <Bdi dir="auto">{enrolledDate}</Bdi> : t.portal.studentDashboard.emptyValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
