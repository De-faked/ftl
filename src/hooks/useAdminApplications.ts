import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

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
  const { t } = useLanguage();
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
      logDevError('fetch admin applications failed', fetchError);
      setApplications([]);
      setError(t.admin.studentsPanel.errors.applicationsLoadFailed);
      setLoading(false);
      return;
    }

    setApplications((data as AdminApplicationRecord[]) ?? []);
    setLoading(false);
  }, [t]);

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
        logDevError('approve application update failed', updateError);
        return { error: t.admin.studentsPanel.errors.approveFailed };
      }

      const { error: insertError } = await supabase
        .from('students')
        .upsert({ user_id: application.user_id }, { onConflict: 'user_id', ignoreDuplicates: true });

      if (insertError) {
        logDevError('approve application insert failed', insertError);
        return { error: t.admin.studentsPanel.errors.approveFailed };
      }

      await fetchApplications();
      return { error: null };
    },
    [fetchApplications, t]
  );

  return { applications, loading, error, refresh: fetchApplications, approveApplication };
};
