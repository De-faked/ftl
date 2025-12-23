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

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-sm text-gray-500">{message}</p>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const { t } = useLanguage();
  const idRef = useRef<HTMLSpanElement | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

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
  const enrolledLine = student.enrolled_at
    ? t.portal.studentDashboard.enrolledLine.replace('{date}', new Date(student.enrolled_at).toLocaleDateString())
    : '';

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t.portal.studentDashboard.title}</h1>
        <p className="text-gray-600 mt-2">{t.portal.studentDashboard.subtitle}</p>
        <div className="mt-6 rounded-xl border border-madinah-green/20 bg-madinah-green/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-madinah-green">{t.portal.studentId}</p>
              <span ref={idRef} className="text-lg font-bold text-gray-900">
                <Bdi>{student.student_id}</Bdi>
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-madinah-green/30 bg-white px-4 py-2 text-sm font-semibold text-madinah-green hover:border-madinah-green"
            >
              {t.portal.studentDashboard.copyButton}
            </button>
          </div>
          {copyMessage && <p className="mt-2 text-xs text-gray-600">{copyMessage}</p>}
        </div>
        <div className="mt-3 text-sm text-gray-500" aria-live="polite">
          {statusBefore}
          <Bdi>{statusValue}</Bdi>
          {statusAfter ?? ''}
          {enrolledLine ? ` ${t.portal.studentDashboard.separator} ${enrolledLine}` : ''}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.coursesTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.coursesSubtitle}</p>
          <div className="mt-4">
            <EmptyState message={t.portal.studentDashboard.coursesEmpty} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.scheduleTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.scheduleSubtitle}</p>
          <div className="mt-4">
            <EmptyState message={t.portal.studentDashboard.scheduleEmpty} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.announcementsTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.announcementsSubtitle}</p>
          <div className="mt-4">
            <EmptyState message={t.portal.studentDashboard.announcementsEmpty} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">{t.portal.studentDashboard.profileTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.portal.studentDashboard.profileSubtitle}</p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>{t.portal.studentDashboard.profileStatusLabel}</span>
              <span className="font-semibold text-gray-900"><Bdi>{statusValue}</Bdi></span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t.portal.studentDashboard.enrollmentDateLabel}</span>
              <span className="font-semibold text-gray-900">
                {student.enrolled_at
                  ? new Date(student.enrolled_at).toLocaleDateString()
                  : t.portal.studentDashboard.emptyValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
