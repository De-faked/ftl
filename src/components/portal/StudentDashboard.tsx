import React from 'react';

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
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-gray-600 mt-2">Welcome back. Here’s your student record.</p>
        <div className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-madinah-green/10 px-5 py-2 text-sm font-semibold text-madinah-green">
          Student ID: {student.student_id}
        </div>
        <div className="mt-3 text-sm text-gray-500">
          Status: {student.status ?? 'Pending'}
          {student.enrolled_at ? ` • Enrolled: ${new Date(student.enrolled_at).toLocaleDateString()}` : ''}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
          <p className="text-sm text-gray-500 mt-1">Your current enrollments.</p>
          <div className="mt-4">
            <EmptyState message="No courses yet." />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">Upcoming classes and key dates.</p>
          <div className="mt-4">
            <EmptyState message="No schedule available." />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">Updates from the institute.</p>
          <div className="mt-4">
            <EmptyState message="No announcements yet." />
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
