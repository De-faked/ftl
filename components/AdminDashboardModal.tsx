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
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<ProfileListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
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
    })();

    return () => {
      active = false;
    };
  }, [props.isOpen, isAdmin]);

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
            className="p-2 rounded-full hover:bg-gray-50"
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
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="py-2 pr-4 font-semibold text-gray-700">Email</th>
                    <th className="py-2 pr-4 font-semibold text-gray-700">Role</th>
                    <th className="py-2 pr-4 font-semibold text-gray-700">Created</th>
                    <th className="py-2 pr-4 font-semibold text-gray-700">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50">
                      <td className="py-2 pr-4 text-gray-900">{p.email ?? '—'}</td>
                      <td className="py-2 pr-4 text-gray-700">{p.role ?? '—'}</td>
                      <td className="py-2 pr-4 text-gray-700">
                        {p.created_at ? new Date(p.created_at).toLocaleString() : '—'}
                      </td>
                      <td className="py-2 pr-4 text-gray-500 font-mono text-xs">{p.id}</td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr>
                      <td className="py-4 text-gray-600" colSpan={4}>
                        No profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
