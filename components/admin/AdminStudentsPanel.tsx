import React, { useMemo, useState } from 'react';
import { useAdminStudents } from '../../src/hooks/useAdminStudents';

const formatLabel = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : '—');

const mapInsertError = (message: string, code?: string) => {
  if (code === '23505') return 'Student already exists for this user_id.';
  if (code === '22P02') return 'Invalid user_id. Provide a valid UUID.';
  if (code === '42501' || message.toLowerCase().includes('permission denied')) {
    return 'Permission denied. Check RLS policies for public.students.';
  }
  return message;
};

export const AdminStudentsPanel: React.FC = () => {
  const { students, loading, error, createStudent, updateStatus } = useAdminStudents();
  const [newUserId, setNewUserId] = useState('');
  const [cohortYear, setCohortYear] = useState('2026');
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [statusEdits, setStatusEdits] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'inactive' | 'graduated'>('all');

  const statusOptions = useMemo(() => {
    return ['enrolled', 'inactive', 'graduated'];
  }, []);

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

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = newUserId.trim();
    const cohortValue = cohortYear.trim();
    const parsedCohort = cohortValue ? Number(cohortValue) : null;
    setCreateMessage(null);
    setCreateError(null);

    if (!trimmed) {
      setCreateError('Enter a user_id to create a student row.');
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
      setCreateMessage(`Created student ${result.studentId}.`);
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
      setUpdateError('Select a status before saving.');
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

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Students</h2>
          <p className="text-sm text-gray-500">Manage student records stored in Supabase.</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1.4fr_0.6fr_auto]">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              New student user_id (uuid)
              <input
                type="text"
                value={newUserId}
                onChange={(event) => setNewUserId(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                placeholder="e.g. 2f6a8f5e-0f0a-4ed1-9b51-4d36f26f81a0"
                disabled={creating}
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              Cohort year (optional)
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
              {creating ? 'Creating…' : 'Create student'}
            </button>
          </form>
          {(createMessage || createError) && (
            <div className="mt-3 text-sm">
              {createMessage && <span className="text-green-700">{createMessage}</span>}
              {createError && <span className="text-red-600">{createError}</span>}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Student records</h3>
              <p className="text-sm text-gray-500">
                Showing {filteredStudents.length} of {students.length} records
              </p>
            </div>
            {updateError && <span className="text-sm text-red-600">{updateError}</span>}
          </div>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              Search by student_id
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                placeholder="Search by student_id"
              />
            </label>
            <label className="space-y-1 text-sm font-semibold text-gray-600">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatLabel(status)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-gray-500">Loading students…</div>}
        {!loading && error && <div className="p-6 text-sm text-red-600">Failed to load students: {error}</div>}
        {!loading && !error && students.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No student records found.</div>
        )}
        {!loading && !error && students.length > 0 && filteredStudents.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No students match the current filters.</div>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Student ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">User ID</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Enrolled</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const statusValue = statusEdits[student.student_id] ?? student.status ?? '';
                  const isDirty = statusValue !== (student.status ?? '');
                  return (
                    <tr key={student.student_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold text-gray-900">{student.student_id}</td>
                      <td className="px-6 py-3 text-xs text-gray-500">{student.user_id}</td>
                      <td className="px-6 py-3">
                        <select
                          value={statusValue}
                          onChange={(event) => handleStatusChange(student.student_id, event.target.value)}
                          className="w-full min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {formatLabel(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{formatDate(student.enrolled_at)}</td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => handleUpdate(student.student_id, student.status)}
                          disabled={savingId === student.student_id || !isDirty}
                          className="min-h-[44px] rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingId === student.student_id ? 'Saving…' : 'Update status'}
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
    </div>
  );
};
