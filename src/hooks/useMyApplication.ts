import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { logDevError } from '../utils/logging';

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

type RawApplicationRecord = {
  id: string;
  user_id: string;
  status: string | null;
  data: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ApplicationRecord = Omit<RawApplicationRecord, 'status'> & {
  status: ApplicationStatus;
};

const resolveApplicationStatus = (status: string | null | undefined): ApplicationStatus => {
  if (status === 'submitted' || status === 'under_review' || status === 'approved' || status === 'rejected') {
    return status;
  }
  return 'draft';
};

const normalizeApplicationRecord = (record: RawApplicationRecord | null): ApplicationRecord | null => {
  if (!record) return null;
  return { ...record, status: resolveApplicationStatus(record.status) };
};

type SaveResult = { error: string | null };

type MyApplicationState = {
  application: ApplicationRecord | null;
  loading: boolean;
  error: string | null;
  upsertDraft: (data: Record<string, unknown>) => Promise<SaveResult>;
  submit: (data: Record<string, unknown>) => Promise<SaveResult>;
};

export const useMyApplication = (): MyApplicationState => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setApplication(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    supabase
      .from('applications')
      .select('id,user_id,status,data,created_at,updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (!active) return;
        if (fetchError) {
          logDevError('fetch application failed', fetchError);
          setApplication(null);
          setError(t.applicationForm.errors.loadFailed);
          setLoading(false);
          return;
        }

        setApplication(normalizeApplicationRecord((data as RawApplicationRecord) ?? null));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t, user]);

  const saveApplication = useCallback(
    async (status: 'draft' | 'submitted', data: Record<string, unknown>): Promise<SaveResult> => {
      if (!user) {
        const message = t.applicationForm.errors.authRequired;
        setError(message);
        return { error: message };
      }

      setError(null);

      const selectCols = 'id,user_id,status,data,created_at,updated_at';

      // RLS allows INSERT only when status='draft'. So for 'submitted' we must:
      // 1) upsert draft, then 2) update to submitted (only from draft).
      if (status === 'draft') {
        const { data: saved, error: saveError } = await supabase
          .from('applications')
          .upsert({ user_id: user.id, status: 'draft', data }, { onConflict: 'user_id' })
          .select(selectCols)
          .maybeSingle();

        if (saveError) {
          logDevError('save application failed', saveError);
          setError(t.applicationForm.errors.submitFailed);
          return { error: t.applicationForm.errors.submitFailed };
        }

        setApplication(normalizeApplicationRecord((saved as RawApplicationRecord) ?? null));
        return { error: null };
      }

      // submitted: ensure draft exists first (insert/update draft)
      const { data: draftRow, error: draftError } = await supabase
        .from('applications')
        .upsert({ user_id: user.id, status: 'draft', data }, { onConflict: 'user_id' })
        .select(selectCols)
        .maybeSingle();

      if (draftError) {
        logDevError('save application (draft step) failed', draftError);
        setError(t.applicationForm.errors.submitFailed);
        return { error: t.applicationForm.errors.submitFailed };
      }

      if (!draftRow) {
        setError(t.applicationForm.errors.submitFailed);
        return { error: t.applicationForm.errors.submitFailed };
      }

      // Promote draft -> submitted (only if current status is still draft)
      const { data: submittedRow, error: submitError } = await supabase
        .from('applications')
        .update({ status: 'submitted', data })
        .eq('id', (draftRow as RawApplicationRecord).id)
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .select(selectCols)
        .maybeSingle();

      if (submitError) {
        logDevError('save application (submit step) failed', submitError);
        setError(t.applicationForm.errors.submitFailed);
        return { error: t.applicationForm.errors.submitFailed };
      }

      if (!submittedRow) {
        // If status changed out from under us (race), treat as failure and let UI reload.
        setError(t.applicationForm.errors.submitFailed);
        return { error: t.applicationForm.errors.submitFailed };
      }

      setApplication(normalizeApplicationRecord((submittedRow as RawApplicationRecord) ?? null));
      return { error: null };
    },
    [t, user]
  );
const upsertDraft = useCallback(
    async (data: Record<string, unknown>) => saveApplication('draft', data),
    [saveApplication]
  );

  const submit = useCallback(
    async (data: Record<string, unknown>): Promise<SaveResult> => {
      if (!user) {
        const message = t.applicationForm.errors.authRequired;
        setError(message);
        return { error: message };
      }

      setError(null);
      setLoading(true);
      try {
        const { error: rpcError } = await supabase.rpc('submit_application', { p_data: data });

        if (rpcError) {
          logDevError('submit application rpc failed', rpcError);
          setError(t.applicationForm.errors.submitFailed);
          return { error: t.applicationForm.errors.submitFailed };
        }

        const { data: latest, error: fetchError } = await supabase
          .from('applications')
          .select('id,user_id,status,data,created_at,updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          logDevError('fetch application after submit failed', fetchError);
          setError(t.applicationForm.errors.loadFailed);
          return { error: t.applicationForm.errors.loadFailed };
        }

        setApplication(normalizeApplicationRecord((latest as RawApplicationRecord) ?? null));
        return { error: null };
      } finally {
        setLoading(false);
      }
    },
    [t, user]
  );

  return { application, loading, error, upsertDraft, submit };
};
