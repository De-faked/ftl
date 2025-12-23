import React, { useMemo, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bdi } from '../Bdi';

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
  emptyMessage,
  renderActions,
}) => {
  const { t } = useLanguage();
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

  const resolveStatusLabel = (status: string) =>
    t.admin.statusLabels?.[status as keyof typeof t.admin.statusLabels] ?? formatLabel(status);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const totalRecordsLabel = t.admin.adminTable.totalRecords.replace('{count}', String(rows.length));
  const pluralSuffix =
    filteredRows.length === 1
      ? t.admin.adminTable.pluralSuffix.one
      : t.admin.adminTable.pluralSuffix.many;
  const resultsLabel = t.admin.adminTable.resultsCount
    .replace('{count}', String(filteredRows.length))
    .replace('{plural}', pluralSuffix);
  const emptyLabel = filtersActive
    ? t.admin.adminTable.emptyFiltered
    : emptyMessage || t.admin.adminTable.emptyDefault;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{totalRecordsLabel}</p>
          </div>
          <div className="text-sm text-gray-500" aria-live="polite">
            {resultsLabel}
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="space-y-1">
            <label htmlFor={`${idBase}-search`} className="text-xs font-semibold uppercase text-gray-500">
              {t.admin.adminTable.searchLabel}
            </label>
            <input
              id={`${idBase}-search`}
              type="search"
              value={search}
              onChange={(event) => handleFilterChange(setSearch)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
              placeholder={t.admin.adminTable.searchPlaceholder}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={`${idBase}-status`} className="text-xs font-semibold uppercase text-gray-500">
              {t.admin.adminTable.statusLabel}
            </label>
            <select
              id={`${idBase}-status`}
              value={statusFilter}
              onChange={(event) => handleFilterChange(setStatusFilter)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            >
              <option value="all">{t.admin.adminTable.allStatuses}</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {resolveStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor={`${idBase}-level`} className="text-xs font-semibold uppercase text-gray-500">
              {t.admin.adminTable.levelLabel}
            </label>
            <select
              id={`${idBase}-level`}
              value={levelFilter}
              onChange={(event) => handleFilterChange(setLevelFilter)(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-madinah-gold"
            >
              <option value="all">{t.admin.adminTable.allLevels}</option>
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
              {t.admin.adminTable.clearFilters}
            </button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">{t.admin.adminTable.selectedFilters}</span>{' '}
          {filtersActive ? (
            <span>
              {search.trim().length > 0 && t.admin.adminTable.searchFilter.replace('{value}', search.trim())}
              {search.trim().length > 0 && (statusFilter !== 'all' || levelFilter !== 'all') && t.admin.adminTable.separator}
              {statusFilter !== 'all' && t.admin.adminTable.statusFilter.replace('{value}', resolveStatusLabel(statusFilter))}
              {statusFilter !== 'all' && levelFilter !== 'all' && t.admin.adminTable.separator}
              {levelFilter !== 'all' && t.admin.adminTable.levelFilter.replace('{value}', levelFilter)}
            </span>
          ) : (
            <span>{t.admin.adminTable.none}</span>
          )}
        </div>
      </div>

      <div className="md:hidden space-y-3 p-4">
        {pagedRows.map((row) => (
          <div key={row.id} className="rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900"><Bdi>{row.name}</Bdi></div>
                <div className="text-xs text-gray-500"><Bdi>{row.email}</Bdi></div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(row.status)}`}
              >
                {resolveStatusLabel(row.status)}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-gray-500">
              <div className="flex items-center justify-between gap-4">
                <span>{t.admin.adminTable.headers.course}</span>
                <span className="text-gray-800"><Bdi>{row.course}</Bdi></span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>{t.admin.adminTable.headers.level}</span>
                <span className="text-gray-800"><Bdi>{row.level}</Bdi></span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>{t.admin.adminTable.headers.updated}</span>
                <span className="text-gray-800"><Bdi>{row.updated}</Bdi></span>
              </div>
            </div>
            {renderActions && <div className="mt-3 border-t border-gray-100 pt-3">{renderActions(row)}</div>}
          </div>
        ))}
        {pagedRows.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            {emptyLabel}
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.student}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.course}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.level}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.status}</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.updated}</th>
              {renderActions && <th className="px-6 py-3 text-left font-semibold text-gray-600">{t.admin.adminTable.headers.actions}</th>}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="font-semibold text-gray-900"><Bdi>{row.name}</Bdi></div>
                  <div className="text-xs text-gray-500"><Bdi>{row.email}</Bdi></div>
                </td>
                <td className="px-6 py-3 text-gray-700"><Bdi>{row.course}</Bdi></td>
                <td className="px-6 py-3 text-gray-700"><Bdi>{row.level}</Bdi></td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(row.status)}`}
                  >
                    {resolveStatusLabel(row.status)}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600"><Bdi>{row.updated}</Bdi></td>
                {renderActions && <td className="px-6 py-3">{renderActions(row)}</td>}
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={renderActions ? 6 : 5}>
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          {t.admin.adminTable.pageLabel
            .replace('{current}', String(safePage))
            .replace('{total}', String(totalPages))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.admin.adminTable.previous}
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-madinah-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.admin.adminTable.next}
          </button>
        </div>
      </div>
    </section>
  );
};
