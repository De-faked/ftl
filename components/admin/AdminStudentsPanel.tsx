import React, { useMemo, useState } from 'react';
import { useAdminStudents } from '../../src/hooks/useAdminStudents';
import { useAdminApplications } from '../../src/hooks/useAdminApplications';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../Bdi';
import { AdminTable } from './AdminTable';

export const AdminStudentsPanel: React.FC = () => {
  const { t } = useLanguage();
  const { students, loading, error, createStudent, updateStatus } = useAdminStudents();
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    approveApplication,
  } = useAdminApplications();
  const [createMessageBefore, createMessageAfter] = t.admin.studentsPanel.createMessage.split('{id}');
  const [newUserId, setNewUserId] = useState('');
  const [cohortYear, setCohortYear] = useState('2026');
  const [createMessageId, setCreateMessageId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [statusEdits, setStatusEdits] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'inactive' | 'graduated'>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approveError, setApproveError] = useState<string | null>(null);

  const statusOptions = useMemo(() => {
    return ['enrolled', 'inactive', 'graduated'];
  }, []);

  const mapInsertError = (message: string, code?: string) => {
    if (code === '23505') return t.admin.studentsPanel.errors.duplicate;
    if (code === '22P02') return t.admin.studentsPanel.errors.invalidUuid;
    if (code === '42501' || message.toLowerCase().includes('permission denied')) {
      return t.admin.studentsPanel.errors.permission;
    }
    return message;
  };

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = normalizedSearch
        ? student.student_id.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesStatus = statusFilter === 'all' ? true : student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString() : t.common.emptyValue;

  const applicationsById = useMemo(() => {
    return new Map(applications.map((application) => [application.id, application]));
  }, [applications]);

  const applicationRows = useMemo(() => {
    return applications.map((application) => {
      const data = application.data ?? {};
      const fullName = typeof data.fullName === 'string' && data.fullName.trim() ? data.fullName : application.user_id;
      const email = typeof data.email === 'string' && data.email.trim() ? data.email : t.common.emptyValue;
      const course = typeof data.courseId === 'string' && data.courseId.trim() ? data.courseId : t.common.emptyValue;
      const level =
        typeof data.desiredLevel === 'string' && data.desiredLevel.trim() ? data.desiredLevel : t.common.emptyValue;
      const updated = formatDate((application.updated_at ?? application.created_at ?? null) as string | null);
      return {
        id: application.id,
        name: fullName,
        email,
        course,
        status: application.status ?? 'draft',
        level,
        updated,
      };
    });
  }, [applications, formatDate, t.common.emptyValue]);

  const applicationStatusOptions = useMemo(() => {
    return Array.from(new Set(applicationRows.map((row) => row.status)));
  }, [applicationRows]);

  const applicationLevelOptions = useMemo(() => {
    return Array.from(new Set(applicationRows.map((row) => row.level)));
  }, [applicationRows]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newUserId.trim();
    const cohortValue = cohortYear.trim();
    const parsedCohort = cohortValue ? Number(cohortValue) : null;
    setCreateMessageId(null);
    setCreateError(null);

    if (!trimmed) {
      setCreateError(t.admin.studentsPanel.errors.emptyUserId);
      return;
    }

    setCreating(true);
    const result = await createStudent(trimmed, Number.isFinite(parsedCohort) ? parsedCohort : null);
    setCreating(false);

    if (result.error) {
      setCreateError(mapInsertError(result.error.message, result.error.code));
      return;
    }

    if (result.studentId) {
      setCreateMessageId(result.studentId);
      setNewUserId('');
    }
  };

  const handleStatusChange = (studentId: string, value: string) => {
    setStatusEdits((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleUpdate = async (studentId: string, currentStatus: string | null) => {
    const nextValue = statusEdits[studentId] ?? currentStatus ?? '';
    const normalized = nextValue.trim();
    setUpdateError(null);
    setSavingId(studentId);

    if (!normalized) {
      setSavingId(null);
      setUpdateError(t.admin.studentsPanel.validationMissing);
      return;
    }

    const result = await updateStatus(studentId, normalized);
    setSavingId(null);

    if (result.error) {
      setUpdateError(result.error.message);
      return;
    }

    setStatusEdits((prev) => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });
  };

  const handleApprove = async (applicationId: string) => {
    const application = applicationsById.get(applicationId);
    if (!application) return;
    setApproveError(null);
    setApprovingId(applicationId);
    const result = await approveApplication(application);
    setApprovingId(null);
    if (result.error) {
      setApproveError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{t.admin.studentsPanel.title}</h2>
          <p className="text-sm text-gray-500">{t.admin.studentsPanel.subtitle}</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1.4fr_0.6fr_auto]">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.studentsPanel.createUserId}
              <input
                type="text"
                value={newUserId}
                onChange={(event) => setNewUserId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                placeholder={t.admin.studentsPanel.createUserIdPlaceholder}
                disabled={creating}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.studentsPanel.cohortYear}
              <input
                type="number"
                value={cohortYear}
                onChange={(event) => setCohortYear(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                min={2000}
                max={2100}
                disabled={creating}
              />
            </label>
            <button
              type="submit"
              className="mt-6 h-[44px] rounded-lg bg-madinah-green px-5 text-sm font-semibold text-white hover:bg-madinah-green/90 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={creating}
            >
              {creating ? t.admin.studentsPanel.creating : t.admin.studentsPanel.createStudent}
            </button>
          </form>
          {(createMessageId || createError) && (
            <div className="mt-3 text-sm">
              {createMessageId && (
                <span className="text-green-700">
                  {createMessageBefore}
                  <Bdi>{createMessageId}</Bdi>
                  {createMessageAfter ?? ''}
                </span>
              )}
              {createError && <span className="text-red-600"><Bdi>{createError}</Bdi></span>}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t.admin.studentsPanel.recordsTitle}</h3>
              <p className="text-sm text-gray-500">
                {t.admin.studentsPanel.recordsSubtitle
                  .replace('{filtered}', String(filteredStudents.length))
                  .replace('{total}', String(students.length))}
              </p>
            </div>
            {updateError && <span className="text-sm text-red-600"><Bdi>{updateError}</Bdi></span>}
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.studentsPanel.searchLabel}
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                placeholder={t.admin.studentsPanel.searchPlaceholder}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              {t.admin.studentsPanel.statusLabel}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              >
                <option value="all">{t.admin.adminTable.allStatuses}</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {t.admin.studentsPanel.statusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-gray-500">{t.admin.studentsPanel.loading}</div>}
        {!loading && error && (
          <div className="p-6 text-sm text-red-600">
            <Bdi>{t.admin.studentsPanel.loadError.replace('{error}', error)}</Bdi>
          </div>
        )}
        {!loading && !error && students.length === 0 && (
          <div className="p-6 text-sm text-gray-500">{t.admin.studentsPanel.empty}</div>
        )}
        {!loading && !error && students.length > 0 && filteredStudents.length === 0 && (
          <div className="p-6 text-sm text-gray-500">{t.admin.studentsPanel.emptyFiltered}</div>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <div className="md:hidden space-y-3 p-4">
            {filteredStudents.map((student) => {
              const statusValue = statusEdits[student.student_id] ?? student.status ?? '';
              const isDirty = statusValue !== (student.status ?? '');
              const statusLabel = statusValue
                ? t.admin.studentsPanel.statusLabels[statusValue as keyof typeof t.admin.studentsPanel.statusLabels] ??
                  statusValue
                : t.admin.studentsPanel.selectStatus;

              return (
                <div key={student.student_id} className="rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900"><Bdi>{student.student_id}</Bdi></div>
                      <div className="text-xs text-gray-500"><Bdi>{student.user_id}</Bdi></div>
                    </div>
                    <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between gap-4">
                      <span>{t.admin.studentsPanel.tableHeaders.enrolled}</span>
                      <span className="text-gray-800"><Bdi>{formatDate(student.enrolled_at)}</Bdi></span>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <label className="text-xs font-semibold text-gray-600">
                      {t.admin.studentsPanel.tableHeaders.status}
                      <select
                        value={statusValue}
                        onChange={(event) => handleStatusChange(student.student_id, event.target.value)}
                        className="mt-2 w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                      >
                        <option value="">{t.admin.studentsPanel.selectStatus}</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {t.admin.studentsPanel.statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleUpdate(student.student_id, student.status)}
                      disabled={savingId === student.student_id || !isDirty}
                      className="min-h-[44px] rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingId === student.student_id ? t.admin.studentsPanel.saving : t.admin.studentsPanel.updateStatus}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.studentsPanel.tableHeaders.studentId}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.studentsPanel.tableHeaders.userId}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.studentsPanel.tableHeaders.status}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.studentsPanel.tableHeaders.enrolled}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.studentsPanel.tableHeaders.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const statusValue = statusEdits[student.student_id] ?? student.status ?? '';
                  const isDirty = statusValue !== (student.status ?? '');
                  return (
                    <tr key={student.student_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900"><Bdi>{student.student_id}</Bdi></td>
                      <td className="px-6 py-3 text-xs text-gray-500"><Bdi>{student.user_id}</Bdi></td>
                      <td className="px-6 py-3">
                        <select
                          value={statusValue}
                          onChange={(event) => handleStatusChange(student.student_id, event.target.value)}
                          className="w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        >
                          <option value="">{t.admin.studentsPanel.selectStatus}</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {t.admin.studentsPanel.statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-gray-600"><Bdi>{formatDate(student.enrolled_at)}</Bdi></td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => handleUpdate(student.student_id, student.status)}
                          disabled={savingId === student.student_id || !isDirty}
                          className="min-h-[44px] rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingId === student.student_id ? t.admin.studentsPanel.saving : t.admin.studentsPanel.updateStatus}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {approveError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <Bdi>{approveError}</Bdi>
        </div>
      )}

      {applicationsLoading && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
          {t.admin.page.loadingAdmin}
        </div>
      )}
      {!applicationsLoading && applicationsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
          <Bdi>{applicationsError}</Bdi>
        </div>
      )}
      {!applicationsLoading && !applicationsError && (
        <AdminTable
          title={t.admin.adminTable.titleApplications}
          rows={applicationRows}
          statusOptions={applicationStatusOptions}
          levelOptions={applicationLevelOptions}
          emptyMessage={t.admin.adminTable.emptyDefault}
          renderActions={(row) => {
            const isApproved = row.status === 'approved';
            const isLoading = approvingId === row.id;
            return (
              <button
                type="button"
                onClick={() => handleApprove(row.id)}
                disabled={isApproved || isLoading}
                className="min-h-[40px] rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-madinah-gold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? t.admin.studentsPanel.saving : t.admin.actions.approve}
              </button>
            );
          }}
        />
      )}
    </div>
  );
};
