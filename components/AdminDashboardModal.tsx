import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../src/lib/supabaseClient';
import { useAuth as useSupabaseAuth } from '../src/auth/useAuth';
import { useView } from '../contexts/ViewContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bdi } from './Bdi';
import { Alert } from './Alert';
import { logDevError } from '../src/utils/logging';

type ProfileListRow = {
  id: string;
  email: string | null;
  role: string | null;
  created_at: string;
};

export function AdminDashboardModal(props: { isOpen: boolean; onClose: () => void }) {
  const { isAdmin, user } = useSupabaseAuth();
  const { setCurrentView } = useView();
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<ProfileListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ label: string } | null>(null);
  const [rowActionLoading, setRowActionLoading] = useState<Record<string, boolean>>({});
  const [reloadKey, setReloadKey] = useState(0);
  const renderTemplate = (template: string, values: Record<string, string>) =>
    template.split(/(\{[^}]+\})/g).map((part, index) => {
      const key = part.startsWith('{') ? part.slice(1, -1) : null;
      if (key && values[key] !== undefined) {
        return <Bdi key={`${key}-${index}`}>{values[key]}</Bdi>;
      }
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
    });

  useEffect(() => {
    if (!props.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.isOpen, props.onClose]);

  useEffect(() => {
    if (!props.isOpen) return;

    if (!isAdmin) {
      setProfiles([]);
      setLoading(false);
      setError(null);
      setActionError(null);
      setRowActionLoading({});
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setActionError(null);

    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id,email,role,created_at')
          .order('created_at', { ascending: false });

        if (!active) return;

        if (error) {
          logDevError('fetch profiles failed', error);
          setError(t.admin.accessModal.loadError);
          setProfiles([]);
        } else {
          setProfiles((data ?? []) as ProfileListRow[]);
        }
      } catch (err) {
        if (!active) return;
        logDevError('fetch profiles failed', err);
        setError(t.admin.accessModal.loadError);
        setProfiles([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfiles();

    return () => {
      active = false;
    };
  }, [props.isOpen, isAdmin, reloadKey]);

  const confirmRoleChange = (label: string, newRole: 'admin' | 'student') => {
    const isPromote = newRole === 'admin';
    const phrase = isPromote ? t.admin.accessModal.confirmPromotePhrase : t.admin.accessModal.confirmDemotePhrase;
    const promptText = isPromote
      ? t.admin.accessModal.confirmPromotePrompt
      : t.admin.accessModal.confirmDemotePrompt;
    const response = window.prompt(
      promptText
        .replace('{label}', label)
        .replace('{phrase}', phrase)
    );
    return response?.trim().toLowerCase() === phrase.toLowerCase();
  };

  const setRoleForUser = async (targetUser: ProfileListRow, newRole: 'admin' | 'student') => {
    setActionError(null);
    setRowActionLoading((prev) => ({ ...prev, [targetUser.id]: true }));
    const label = targetUser.email ?? targetUser.id;
    const confirmed = confirmRoleChange(label, newRole);
    if (!confirmed) {
      setRowActionLoading((prev) => {
        const next = { ...prev };
        delete next[targetUser.id];
        return next;
      });
      return;
    }
    try {
      const { error } = await supabase.rpc('set_profile_role', {
        target_user_id: targetUser.id,
        new_role: newRole,
      });

      if (error) {
        logDevError('set profile role failed', error);
        setActionError({ label });
        return;
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === targetUser.id ? { ...p, role: newRole } : p))
      );
    } catch (err) {
      logDevError('set profile role failed', err);
      setActionError({ label });
    } finally {
      setRowActionLoading((prev) => {
        const next = { ...prev };
        delete next[targetUser.id];
        return next;
      });
    }
  };

  if (!props.isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-700">{t.admin.accessModal.title}</div>
          <button
            type="button"
            onClick={props.onClose}
            className="w-11 h-11 rounded-full hover:bg-gray-50 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
            aria-label={t.admin.accessModal.close}
            title={t.admin.accessModal.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isAdmin ? (
            <div className="text-center space-y-4 py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500">
                <X className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{t.admin.accessModal.notAuthorizedTitle}</p>
                <p className="text-gray-600 text-sm">{t.admin.accessModal.notAuthorizedMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('LANDING');
                  props.onClose();
                }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-madinah-green text-white font-semibold hover:bg-madinah-green/90 transition-colors"
              >
                {t.admin.accessModal.backHome}
              </button>
            </div>
          ) : loading ? (
            <div className="text-sm text-gray-600">{t.admin.accessModal.loadingProfiles}</div>
          ) : (
            <div className="space-y-3">
              {error && (
                <Alert variant="error">
                  <div className="space-y-2">
                    <Bdi>{error}</Bdi>
                    <div>
                      <button
                        type="button"
                        onClick={() => setReloadKey((prev) => prev + 1)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        {t.admin.accessModal.retry}
                      </button>
                    </div>
                  </div>
                </Alert>
              )}
              {actionError && (
                <Alert variant="error">
                  {renderTemplate(t.admin.accessModal.updateError, {
                    label: actionError.label,
                  })}
                </Alert>
              )}

              <div className="md:hidden space-y-3">
                {profiles.map((p) => {
                  const normalizedRole = (p.role ?? '').toLowerCase();
                  const isSelf = p.id === (user?.id ?? '');
                  const isRowLoading = Boolean(rowActionLoading[p.id]);
                  const label = p.email ?? p.id;

                  const action =
                    normalizedRole === 'student'
                      ? {
                          label: t.admin.accessModal.table.promote,
                          newRole: 'admin' as const,
                        }
                      : normalizedRole === 'admin'
                        ? {
                            label: t.admin.accessModal.table.demote,
                            newRole: 'student' as const,
                          }
                        : null;

                  return (
                    <div key={p.id} className="rounded-xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900"><Bdi>{p.email ?? t.common.emptyValue}</Bdi></div>
                          <div className="text-xs text-gray-500"><Bdi>{p.id}</Bdi></div>
                        </div>
                        <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
                          <Bdi>{p.role ?? t.common.emptyValue}</Bdi>
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        {t.admin.accessModal.table.created}{' '}
                        <span className="text-gray-800">
                          <Bdi>{p.created_at ? new Date(p.created_at).toLocaleString() : t.common.emptyValue}</Bdi>
                        </span>
                      </div>
                      <div className="mt-3">
                        {action ? (
                          <button
                            type="button"
                            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSelf || isRowLoading}
                            onClick={() => setRoleForUser(p, action.newRole)}
                            title={isSelf ? t.admin.accessModal.table.selfRoleChange : action.label}
                          >
                            {isRowLoading ? t.admin.accessModal.table.updating : action.label}
                          </button>
                        ) : (
                          <span className="text-gray-500">{t.common.emptyValue}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {profiles.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    {t.admin.accessModal.table.noProfiles}
                  </div>
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="py-2 pr-4 font-semibold text-gray-700">{t.admin.accessModal.table.email}</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">{t.admin.accessModal.table.role}</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">{t.admin.accessModal.table.created}</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">{t.admin.accessModal.table.id}</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">{t.admin.accessModal.table.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => {
                      const normalizedRole = (p.role ?? '').toLowerCase();
                      const isSelf = p.id === (user?.id ?? '');
                      const isRowLoading = Boolean(rowActionLoading[p.id]);

                      const action =
                        normalizedRole === 'student'
                          ? {
                              label: t.admin.accessModal.table.promote,
                              newRole: 'admin' as const,
                            }
                          : normalizedRole === 'admin'
                            ? {
                                label: t.admin.accessModal.table.demote,
                                newRole: 'student' as const,
                              }
                            : null;

                      return (
                        <tr key={p.id} className="border-b border-gray-50">
                          <td className="py-2 pr-4 text-gray-900"><Bdi>{p.email ?? t.common.emptyValue}</Bdi></td>
                          <td className="py-2 pr-4 text-gray-700"><Bdi>{p.role ?? t.common.emptyValue}</Bdi></td>
                          <td className="py-2 pr-4 text-gray-700">
                            <Bdi>{p.created_at ? new Date(p.created_at).toLocaleString() : t.common.emptyValue}</Bdi>
                          </td>
                          <td className="py-2 pr-4 text-gray-500 font-mono text-xs"><Bdi>{p.id}</Bdi></td>
                          <td className="py-2 pr-4">
                            {action ? (
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSelf || isRowLoading}
                                onClick={() => setRoleForUser(p, action.newRole)}
                                title={isSelf ? t.admin.accessModal.table.selfRoleChange : action.label}
                              >
                                {isRowLoading ? t.admin.accessModal.table.updating : action.label}
                              </button>
                            ) : (
                              <span className="text-gray-500">{t.common.emptyValue}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {profiles.length === 0 && (
                      <tr>
                        <td className="py-4 text-gray-600" colSpan={5}>
                          {t.admin.accessModal.table.noProfiles}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
