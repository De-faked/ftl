import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../src/lib/supabaseClient';
import { useAuth } from '../src/auth/useAuth';

type ProfileListRow = {
  id: string;
  email: string | null;
  role: string | null;
  created_at: string;
};

export function AdminDashboardModal(props: { isOpen: boolean; onClose: () => void }) {
  const { isAdmin, user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rowActionLoading, setRowActionLoading] = useState<Record<string, boolean>>({});

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
          setError(error.message);
          setProfiles([]);
        } else {
          setProfiles((data ?? []) as ProfileListRow[]);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load profiles');
        setProfiles([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfiles();

    return () => {
      active = false;
    };
  }, [props.isOpen, isAdmin]);

  const setRoleForUser = async (targetUser: ProfileListRow, newRole: 'admin' | 'student') => {
    setActionError(null);
    setRowActionLoading((prev) => ({ ...prev, [targetUser.id]: true }));
    try {
      const { error } = await supabase.rpc('set_profile_role', {
        target_user_id: targetUser.id,
        new_role: newRole,
      });

      if (error) {
        const label = targetUser.email ?? targetUser.id;
        setActionError(`Failed to update role for ${label}: ${error.message}`);
        return;
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === targetUser.id ? { ...p, role: newRole } : p))
      );
    } catch (err) {
      const label = targetUser.email ?? targetUser.id;
      setActionError(
        `Failed to update role for ${label}: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
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
          <div className="text-sm font-semibold text-gray-700">Admin</div>
          <button
            type="button"
            onClick={props.onClose}
            className="w-11 h-11 rounded-full hover:bg-gray-50 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
            aria-label="Close admin dashboard"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isAdmin ? (
            <div className="text-sm text-gray-700">Not authorized</div>
          ) : loading ? (
            <div className="text-sm text-gray-600">Loading profiles…</div>
          ) : (
            <div className="space-y-3">
              {error && <div className="text-sm text-red-600">{error}</div>}
              {actionError && <div className="text-sm text-red-600">{actionError}</div>}

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="py-2 pr-4 font-semibold text-gray-700">Email</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Role</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Created</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">ID</th>
                      <th className="py-2 pr-4 font-semibold text-gray-700">Action</th>
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
                              label: 'Promote to admin',
                              newRole: 'admin' as const,
                            }
                          : normalizedRole === 'admin'
                            ? {
                                label: 'Demote to student',
                                newRole: 'student' as const,
                              }
                            : null;

                      return (
                        <tr key={p.id} className="border-b border-gray-50">
                          <td className="py-2 pr-4 text-gray-900">{p.email ?? '—'}</td>
                          <td className="py-2 pr-4 text-gray-700">{p.role ?? '—'}</td>
                          <td className="py-2 pr-4 text-gray-700">
                            {p.created_at ? new Date(p.created_at).toLocaleString() : '—'}
                          </td>
                          <td className="py-2 pr-4 text-gray-500 font-mono text-xs">{p.id}</td>
                          <td className="py-2 pr-4">
                            {action ? (
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSelf || isRowLoading}
                                onClick={() => setRoleForUser(p, action.newRole)}
                                title={isSelf ? 'You cannot change your own role' : action.label}
                              >
                                {isRowLoading ? 'Updating…' : action.label}
                              </button>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {profiles.length === 0 && (
                      <tr>
                        <td className="py-4 text-gray-600" colSpan={5}>
                          No profiles found.
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
