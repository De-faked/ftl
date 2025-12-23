import React, { useMemo, useEffect, useState } from 'react';
import { BookOpen, ClipboardList, Users, Briefcase, Minus, Plus, User as UserIcon, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';
import { Course, EnrollmentStatus, User } from '../types';
import { AdminTable, AdminTableRow } from './admin/AdminTable';
import { AdminStudentsPanel } from './admin/AdminStudentsPanel';

type AdminTab = 'students' | 'applications' | 'courses';

type CourseMeta = {
  title: string;
  level: string;
};

export const AdminDashboard: React.FC = () => {
  const { getAllStudents, approveDocument, rejectDocument, updateStudent, getCourseStats, updateCourseCapacity } =
    useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const data = getAllStudents();
    setStudents(data.slice(0, 200));
  }, [getAllStudents, refreshTrigger]);

  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  const courseById = useMemo(() => {
    return new Map<string, Course>(t.home.courses.list.map((course: Course) => [course.id, course]));
  }, [t.home.courses.list]);

  const getCourseMeta = (courseId?: string): CourseMeta => {
    if (!courseId) return { title: t.admin.courseMeta.notSelected, level: t.admin.courseMeta.unknown };
    const course = courseById.get(courseId);
    return {
      title: course?.title ?? courseId,
      level: course?.level ?? t.admin.courseMeta.unknown,
    };
  };

  const buildRows = (list: User[], useApplicationCourse: boolean): AdminTableRow[] =>
    list.map((student) => {
      const courseId = useApplicationCourse
        ? student.applicationData?.courseId ?? student.enrolledCourseId
        : student.enrolledCourseId ?? student.applicationData?.courseId;
      const courseMeta = getCourseMeta(courseId);
      const submitted = student.applicationData?.submissionDate
        ? new Date(student.applicationData.submissionDate).toLocaleDateString()
        : t.common.emptyValue;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        course: courseMeta.title,
        level: courseMeta.level,
        status: student.enrollmentStatus ?? 'pending',
        updated: submitted,
      };
    });

  const studentById = useMemo(() => new Map(students.map((student) => [student.id, student])), [students]);

  const applicationRows = useMemo(() => {
    const candidates = students.filter(
      (student) =>
        student.applicationData ||
        student.enrollmentStatus === 'pending' ||
        student.enrollmentStatus === 'payment_pending'
    );
    return buildRows(candidates, true);
  }, [students]);

  const collectOptions = (rows: AdminTableRow[], field: 'status' | 'level') => {
    return Array.from(new Set(rows.map((row) => row[field]))).sort();
  };

  const applicationStatusOptions = useMemo(() => collectOptions(applicationRows, 'status'), [applicationRows]);
  const applicationLevelOptions = useMemo(() => collectOptions(applicationRows, 'level'), [applicationRows]);
  const statusChoices: EnrollmentStatus[] = ['pending', 'payment_pending', 'enrolled', 'visa_issued'];

  const handleUpdateStatus = (studentId: string, status: EnrollmentStatus) => {
    updateStudent(studentId, { enrollmentStatus: status });
    refreshData();
  };

  const handleTogglePayment = (student: User) => {
    const next = student.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    if (next === 'unpaid') {
      const ok = window.confirm(t.admin.actions.markUnpaidConfirm.replace('{name}', student.name));
      if (!ok) return;
    }
    const nextEnrollment =
      next === 'paid' && student.enrollmentStatus === 'payment_pending'
        ? 'enrolled'
        : next === 'unpaid' && student.enrollmentStatus === 'enrolled'
          ? 'payment_pending'
          : student.enrollmentStatus;

    updateStudent(student.id, { paymentStatus: next, enrollmentStatus: nextEnrollment });
    refreshData();
  };

  const handleApproveDoc = (studentId: string, docId: string) => {
    approveDocument(studentId, docId);
    refreshData();
  };

  const handleRejectDoc = (studentId: string, docId: string, docName: string) => {
    const ok = window.confirm(t.admin.actions.rejectConfirm.replace('{doc}', docName));
    if (!ok) return;
    const reason = prompt(t.admin.actions.rejectReason) || t.admin.actions.rejectedDefault;
    rejectDocument(studentId, docId, reason);
    refreshData();
  };

  const renderActions = (row: AdminTableRow) => {
    const student = studentById.get(row.id);
    if (!student) return <span className="text-xs text-gray-400">{t.common.emptyValue}</span>;

    const pendingDocs = (student.documents ?? []).filter((doc) => doc.status === 'pending');
    const paymentLabel = student.paymentStatus === 'paid' ? t.admin.actions.markUnpaid : t.admin.actions.markPaid;

    return (
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-gray-500">
          {t.admin.actions.statusLabel}
          <select
            value={student.enrollmentStatus ?? 'pending'}
            onChange={(event) => handleUpdateStatus(student.id, event.target.value as EnrollmentStatus)}
            className="mt-1 w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            aria-label={t.admin.actions.updateStatusAria.replace('{name}', student.name)}
          >
            {statusChoices.map((status) => (
              <option key={status} value={status}>
                {t.admin.statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => handleTogglePayment(student)}
          className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold"
          aria-label={t.admin.actions.paymentAria.replace('{action}', paymentLabel).replace('{name}', student.name)}
        >
          {paymentLabel}
        </button>
        {pendingDocs.length > 0 && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-semibold text-gray-500">{t.admin.actions.pendingDocs}</p>
            {pendingDocs.map((doc) => (
              <div key={doc.id} className="mt-2 flex flex-col gap-2">
                <div className="text-xs text-gray-600"><Bdi>{doc.name}</Bdi></div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleApproveDoc(student.id, doc.id)}
                    className="min-h-[44px] rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                    aria-label={t.admin.actions.approveAria.replace('{doc}', doc.name).replace('{name}', student.name)}
                  >
                    {t.admin.actions.approve}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectDoc(student.id, doc.id, doc.name)}
                    className="min-h-[44px] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                    aria-label={t.admin.actions.rejectAria.replace('{doc}', doc.name).replace('{name}', student.name)}
                  >
                    {t.admin.actions.reject}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CoursesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.home.courses.list.map((course: Course) => {
          const stats = getCourseStats(course.id, course.capacity);
          const revenue = stats.enrolled * 2500;
          const revenueValue = t.admin.courseCard.revenueValue
            .replace('{currency}', t.common.currencySymbol)
            .replace('{amount}', revenue.toLocaleString());
          const percentage = Math.min(100, (stats.enrolled / stats.capacity) * 100);

          return (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {course.id === 'business' ? (
                      <Briefcase className="w-6 h-6 text-madinah-gold" />
                    ) : course.id === 'immersion' ? (
                      <UserIcon className="w-6 h-6 text-madinah-green" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      stats.isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {stats.isFull ? t.admin.courseCard.full : t.admin.courseCard.active}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.arabicTitle}</p>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">{t.admin.courseCard.capacity}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {stats.enrolled} / {stats.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                    <div
                      className={`h-2.5 rounded-full ${stats.isFull ? 'bg-red-500' : 'bg-madinah-green'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateCourseCapacity(course.id, Math.max(0, stats.capacity - 5));
                        refreshData();
                      }}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-madinah-green"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-mono font-bold w-8 text-center">{stats.capacity}</span>
                    <button
                      onClick={() => {
                        updateCourseCapacity(course.id, stats.capacity + 5);
                        refreshData();
                      }}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-madinah-green"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-400 ml-2">{t.admin.courseCard.adjustLimit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">{t.admin.courseCard.students}</p>
                    <p className="text-xl font-bold text-gray-900">{stats.enrolled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">{t.admin.courseCard.revenue}</p>
                    <p className="text-xl font-bold text-gray-900"><Bdi>{revenueValue}</Bdi></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">{t.admin.courseCard.recentEnrollees}</p>
                  {students
                    .filter((student) => student.enrolledCourseId === course.id)
                    .slice(0, 3)
                    .map((student) => (
                      <div key={student.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <Bdi>{student.name}</Bdi>
                      </div>
                    ))}
                  {stats.enrolled === 0 && <span className="text-sm text-gray-400 italic">{t.admin.courseCard.noStudents}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        {(
          [
            { id: 'students', label: t.admin.dashboardTabs.students, icon: Users },
            { id: 'applications', label: t.admin.dashboardTabs.applications, icon: ClipboardList },
            { id: 'courses', label: t.admin.dashboardTabs.courses, icon: BookOpen },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-madinah-green border-b-2 border-madinah-green'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'students' && (
        <AdminStudentsPanel />
      )}

      {activeTab === 'applications' && (
        <AdminTable
          title={t.admin.adminTable.titleApplications}
          rows={applicationRows}
          statusOptions={applicationStatusOptions}
          levelOptions={applicationLevelOptions}
          emptyMessage={t.admin.adminTable.emptyDefault}
          renderActions={renderActions}
        />
      )}

      {activeTab === 'courses' && <CoursesTab />}
    </div>
  );
};
