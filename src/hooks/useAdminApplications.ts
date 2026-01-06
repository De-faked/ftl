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
setApplicationStatus: (applicationId: string, status: 'under_review' | 'rejected') => Promise<{ error: string | null }>;
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
      const { error: approveError } = await supabase.rpc('approve_application', {
        p_application_id: application.id,
      });

      if (approveError) {
        logDevError('approve application rpc failed', approveError);
        return { error: t.admin.studentsPanel.errors.approveFailed };
      }

      // Always refresh after a successful approval RPC
      await fetchApplications();
      return { error: null };
    },
    [fetchApplications, t]
  );


  const setApplicationStatus = useCallback(
    async (applicationId: string, status: 'under_review' | 'rejected') => {
      const { error: updateError } = await supabase.rpc('admin_update_application_status', {
        p_application_id: applicationId,
        p_status: status,
      });

      if (updateError) {
        logDevError('admin update application status failed', updateError);
        return { error: t.admin.studentsPanel.errors.approveFailed };
      }

      await fetchApplications();
      return { error: null };
    },
    [fetchApplications, t]
  );

  return { applications, loading, error, refresh: fetchApplications, approveApplication, setApplicationStatus };
};
