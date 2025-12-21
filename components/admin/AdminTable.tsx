import React, { useMemo, useState } from 'react';

export type AdminTableRow = {
  id: string;
  name: string;
  email: string;
  course: string;
  status: string;
  level: string;
  updated: string;
};

type AdminTableProps = {
  title: string;
  rows: AdminTableRow[];
  statusOptions: string[];
  levelOptions: string[];
  emptyMessage?: string;
  renderActions?: (row: AdminTableRow) => React.ReactNode;
};

const formatLabel = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const statusTone = (status: string) => {
  switch (status) {
    case 'enrolled':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'payment_pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'visa_issued':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const AdminTable: React.FC<AdminTableProps> = ({
  title,
  rows,
  statusOptions,
  levelOptions,
  emptyMessage = 'No records found.',
  renderActions,
}) => {
  const idBase = title.toLowerCase().replace(/\\s+/g, '-');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch = normalizedSearch
        ? `${row.name} ${row.email} ${row.course} ${row.status} ${row.level}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true;
      const matchesStatus = statusFilter === 'all' ? true : row.status === statusFilter;
      const matchesLevel = levelFilter === 'all' ? true : row.level === levelFilter;
      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [rows, search, statusFilter, levelFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage]);

  const filtersActive =
    search.trim().length > 0 || statusFilter !== 'all' || levelFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setLevelFilter('all');
    setPage(1);
  };

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{rows.length} total records</p>
          </div>
          <div className="text-sm text-gray-500" aria-live="polite">
            Showing {filteredRows.length} result{filteredRows.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="space-y-1">
            <label htmlFor={`${idBase}-search`} className="text-xs font-semibold uppercase text-gray-500">
              Search
            </label>
            <input
              id={`${idBase}-search`}
              type="search"
              value={search}
              onChange={(event) => handleFilterChange(setSearch)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              placeholder="Search by name, email, course"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={`${idBase}-status`} className="text-xs font-semibold uppercase text-gray-500">
              Status
            </label>
            <select
              id={`${idBase}-status`}
              value={statusFilter}
              onChange={(event) => handleFilterChange(setStatusFilter)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor={`${idBase}-level`} className="text-xs font-semibold uppercase text-gray-500">
              Level
            </label>
            <select
              id={`${idBase}-level`}
              value={levelFilter}
              onChange={(event) => handleFilterChange(setLevelFilter)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            >
              <option value="all">All levels</option>
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!filtersActive}
            >
              Clear filters
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Selected filters:</span>{' '}
          {filtersActive ? (
            <span>
              {search.trim().length > 0 && `Search: "${search.trim()}"`}
              {search.trim().length > 0 && (statusFilter !== 'all' || levelFilter !== 'all') && ' · '}
              {statusFilter !== 'all' && `Status: ${formatLabel(statusFilter)}`}
              {statusFilter !== 'all' && levelFilter !== 'all' && ' · '}
              {levelFilter !== 'all' && `Level: ${levelFilter}`}
            </span>
          ) : (
            <span>None</span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Student</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Course</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Level</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Updated</th>
              {renderActions && <th className="px-6 py-3 text-left font-semibold text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="font-semibold text-gray-900">{row.name}</div>
                  <div className="text-xs text-gray-500">{row.email}</div>
                </td>
                <td className="px-6 py-3 text-gray-700">{row.course}</td>
                <td className="px-6 py-3 text-gray-700">{row.level}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(row.status)}`}
                  >
                    {formatLabel(row.status)}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600">{row.updated}</td>
                {renderActions && <td className="px-6 py-3">{renderActions(row)}</td>}
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={renderActions ? 6 : 5}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          Page {safePage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
