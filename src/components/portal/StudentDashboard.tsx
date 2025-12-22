import React, { useRef, useState } from 'react';

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
  const idRef = useRef<HTMLSpanElement | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleCopy = async () => {
    setCopyMessage(null);
    const idValue = student.student_id;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(idValue);
        setCopyMessage('Student ID copied.');
        return;
      } catch {
        setCopyMessage('Copy failed. Select the ID to copy.');
      }
    }

    if (idRef.current) {
      const range = document.createRange();
      range.selectNodeContents(idRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      setCopyMessage('Student ID selected. Press Ctrl+C to copy.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-gray-600 mt-2">Welcome back. Here’s your student record.</p>
        <div className="mt-6 rounded-xl border border-madinah-green/20 bg-madinah-green/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-madinah-green">Student ID</p>
              <span ref={idRef} className="text-lg font-bold text-gray-900">
                {student.student_id}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-madinah-green/30 bg-white px-4 py-2 text-sm font-semibold text-madinah-green hover:border-madinah-green"
            >
              Copy Student ID
            </button>
          </div>
          {copyMessage && <p className="mt-2 text-xs text-gray-600">{copyMessage}</p>}
        </div>
        <div className="mt-3 text-sm text-gray-500" aria-live="polite">
          Status: {student.status ?? 'Pending'}
          {student.enrolled_at ? ` • Enrolled: ${new Date(student.enrolled_at).toLocaleDateString()}` : ''}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
          <p className="text-sm text-gray-500 mt-1">Your current enrollments.</p>
          <div className="mt-4">
            <EmptyState message="No courses assigned yet. Check back after enrollment is confirmed." />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">Upcoming classes and key dates.</p>
          <div className="mt-4">
            <EmptyState message="We’ll post your schedule once classes are assigned." />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">Updates from the institute.</p>
          <div className="mt-4">
            <EmptyState message="No announcements right now. You’ll see updates here first." />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Your account details.</p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="font-semibold text-gray-900">{student.status ?? 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Enrollment date</span>
              <span className="font-semibold text-gray-900">
                {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
