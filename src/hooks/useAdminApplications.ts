import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export type AdminApplicationRecord = {
  id: string;
  user_id: string;
  status: string | null;
  data: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AdminApplicationsState = {
  applications: AdminApplicationRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  approveApplication: (application: AdminApplicationRecord) => Promise<{ error: string | null }>;
};

export const useAdminApplications = (): AdminApplicationsState => {
  const [applications, setApplications] = useState<AdminApplicationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('applications')
      .select('id,user_id,status,data,created_at,updated_at');

    if (fetchError) {
      setApplications([]);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setApplications((data as AdminApplicationRecord[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const approveApplication = useCallback(
    async (application: AdminApplicationRecord) => {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', application.id);

      if (updateError) {
        return { error: updateError.message };
      }

      const { error: insertError } = await supabase
        .from('students')
        .upsert({ user_id: application.user_id }, { onConflict: 'user_id', ignoreDuplicates: true });

      if (insertError) {
        return { error: insertError.message };
      }

      await fetchApplications();
      return { error: null };
    },
    [fetchApplications]
  );

  return { applications, loading, error, refresh: fetchApplications, approveApplication };
};
